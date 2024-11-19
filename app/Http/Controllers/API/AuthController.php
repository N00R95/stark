<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Twilio\Rest\Client;
use App\Services\TwilioHttpClient;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    protected $twilio;
    protected $verificationSid;

    public function __construct()
    {
        try {
            $accountSid = config('services.twilio.account_sid');
            $authToken = config('services.twilio.auth_token');
            $verificationSid = config('services.twilio.verification_sid');

            if (empty($accountSid) || empty($authToken) || empty($verificationSid)) {
                throw new \Exception('Twilio credentials not properly configured');
            }

            $this->twilio = new Client(
                $accountSid,
                $authToken,
                null,
                null,
                new TwilioHttpClient()
            );

            $this->verificationSid = $verificationSid;

        } catch (\Exception $e) {
            \Log::error('Twilio Init Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public function getOTP(Request $request)
    {
        try {
            $request->validate([
                'phone' => ['required', 'string', 'regex:/^\+966\d{9}$/'],
                'channel' => 'required|in:sms,whatsapp'
            ]);

            $phone = $request->phone;

            \Log::info('Sending OTP', [
                'phone' => $phone,
                'channel' => $request->channel
            ]);

            try {
                $verification = $this->twilio->verify->v2
                    ->services($this->verificationSid)
                    ->verifications
                    ->create($phone, $request->channel);

                \Log::info('OTP Sent', [
                    'status' => $verification->status,
                    'phone' => $phone
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'OTP sent successfully'
                ]);

            } catch (\Exception $e) {
                \Log::error('Twilio OTP Error', [
                    'error' => $e->getMessage(),
                    'phone' => $phone
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Failed to send OTP: ' . $e->getMessage()
                ], 500);
            }

        } catch (\Exception $e) {
            \Log::error('OTP Request Error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function verifyOTP(Request $request)
    {
        try {
            $request->validate([
                'phone' => ['required', 'string', 'regex:/^\+966\d{9}$/'],
                'otp' => 'required|string|size:6',
                'type' => 'required|in:owner,renter'
            ]);

            \Log::info('Verifying OTP', [
                'phone' => $request->phone,
                'type' => $request->type
            ]);

            $verification_check = $this->twilio->verify->v2
                ->services($this->verificationSid)
                ->verificationChecks
                ->create([
                    'to' => $request->phone,
                    'code' => $request->otp
                ]);

            if ($verification_check->status === 'approved') {
                $profile = Profile::where('phone', $request->phone)
                    ->where('type', $request->type)
                    ->first();

                if (!$profile) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Profile not found'
                    ], 404);
                }

                $user = $profile->user;
                $token = $user->createToken('auth-token')->plainTextToken;

                return response()->json([
                    'success' => true,
                    'token' => $token,
                    'user' => $user->load(['profile', 'profiles'])
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Invalid OTP'
            ], 400);

        } catch (\Exception $e) {
            \Log::error('OTP verification failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to verify OTP: ' . $e->getMessage()
            ], 500);
        }
    }

    public function registerVerifyOTP(Request $request)
    {
        try {
            $request->validate([
                'phone' => ['required', 'string', 'regex:/^\+966\d{9}$/'],
                'otp' => 'required|string',
                'full_name' => 'required|string',
                'email' => 'required|email',
                'type' => 'required|in:owner,renter',
                'business_name' => 'nullable|string',
                'business_license' => 'nullable|string'
            ]);

            // Check if profile already exists with this phone and type combination
            $existingProfile = Profile::where('phone', $request->phone)
                ->where('type', $request->type)
                ->first();

            if ($existingProfile) {
                return response()->json([
                    'success' => false,
                    'error_code' => 'PROFILE_EXISTS',
                    'message' => 'An account with this phone number already exists for this user type. Please login instead.'
                ], 409);
            }

            // Verify OTP first
            try {
                $verification = $this->twilio->verify->v2
                    ->services($this->verificationSid)
                    ->verificationChecks
                    ->create([
                        'to' => $request->phone,
                        'code' => $request->otp
                    ]);

                if ($verification->status !== 'approved') {
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid OTP'
                    ], 400);
                }
            } catch (\Exception $e) {
                \Log::error('OTP verification failed', [
                    'error' => $e->getMessage(),
                    'phone' => $request->phone
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'OTP verification failed'
                ], 400);
            }

            DB::beginTransaction();
            try {
                // Find or create user
                $user = User::firstOrCreate(
                    ['email' => $request->email],
                    [
                        'name' => $request->full_name,
                        'password' => Hash::make(Str::random(16))
                    ]
                );

                // Create new profile
                $profile = new Profile([
                    'user_id' => $user->id,
                    'full_name' => $request->full_name,
                    'phone' => $request->phone,
                    'email' => $request->email,
                    'type' => $request->type
                ]);

                // Only add business fields if they are provided
                if ($request->type === 'owner') {
                    $profile->business_name = $request->business_name;
                    $profile->business_license = $request->business_license;
                }

                $profile->save();

                DB::commit();

                // Generate token
                $token = $user->createToken('auth_token')->plainTextToken;

                return response()->json([
                    'success' => true,
                    'message' => 'Registration successful',
                    'token' => $token,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'profile' => $profile
                    ]
                ]);

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            \Log::error('Registration failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Registration failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function user(Request $request)
    {
        try {
            // Get and clean the bearer token
            $bearerToken = $request->bearerToken();
            if ($bearerToken) {
                // Remove 'Bearer' prefix and trim spaces if present
                $bearerToken = trim(str_replace('Bearer', '', $bearerToken));
            }

            \Log::debug('Auth Check', [
                'raw_header' => $request->header('Authorization'),
                'cleaned_token' => $bearerToken ? substr($bearerToken, 0, 10) . '...' : null
            ]);

            $user = $request->user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                    'debug' => [
                        'has_token' => !empty($bearerToken),
                        'token_prefix' => $bearerToken ? substr($bearerToken, 0, 10) . '...' : null
                    ]
                ], 401);
            }

            $type = $request->query('type', $user->profiles()->first()->type ?? 'renter');
            $profile = $user->profiles()->where('type', $type)->first();

            if (!$profile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Profile not found for this user type'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'profile' => $profile
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('User data fetch failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user data'
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            \Log::info('Logout attempt', [
                'user_id' => $request->user()?->id,
                'token' => $request->bearerToken() ? substr($request->bearerToken(), 0, 10) . '...' : null
            ]);

            if (!$request->user()) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }

            // Delete the current token
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Successfully logged out'
            ]);
        } catch (\Exception $e) {
            \Log::error('Logout failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Logout failed: ' . $e->getMessage()
            ], 500);
        }
    }
}

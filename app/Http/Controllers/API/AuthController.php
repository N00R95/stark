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

            // Log the request details
            \Log::info('OTP Request', [
                'phone' => $phone,
                'channel' => $request->channel,
                'twilio_config' => [
                    'account_sid_exists' => !empty(config('services.twilio.account_sid')),
                    'auth_token_exists' => !empty(config('services.twilio.auth_token')),
                    'verification_sid_exists' => !empty(config('services.twilio.verification_sid')),
                ]
            ]);

            try {
                // Test Twilio connection first
                $account = $this->twilio->account->fetch();
                \Log::info('Twilio Account Status', [
                    'type' => $account->type,
                    'status' => $account->status
                ]);

                // Create verification
                $verification = $this->twilio->verify->v2
                    ->services($this->verificationSid)
                    ->verifications
                    ->create($phone, $request->channel);

                \Log::info('Verification Created', [
                    'sid' => $verification->sid,
                    'status' => $verification->status,
                    'phone' => $phone
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'OTP sent successfully',
                    'debug_info' => [
                        'account_type' => $account->type,
                        'account_status' => $account->status,
                        'verification_sid' => $verification->sid
                    ]
                ]);

            } catch (\Twilio\Exceptions\RestException $e) {
                \Log::error('Twilio API Error', [
                    'code' => $e->getCode(),
                    'message' => $e->getMessage(),
                    'phone' => $phone,
                    'details' => $e->getMessage()
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Failed to send OTP: ' . $e->getMessage(),
                    'error_code' => $e->getCode(),
                    'debug_info' => [
                        'error_type' => get_class($e),
                        'details' => $e->getMessage()
                    ]
                ], 400);
            }

        } catch (\Exception $e) {
            \Log::error('General Error in getOTP', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to send OTP: ' . $e->getMessage(),
                'debug_info' => [
                    'error_type' => get_class($e),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ], 500);
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
                'full_name' => 'required|string|max:255',
                'email' => 'required|email',
                'phone' => ['required', 'string', 'regex:/^\+966\d{9}$/'],
                'type' => 'required|in:owner,renter',
                'otp' => 'required|string|size:6'
            ]);

            \Log::info('Register OTP Verification', [
                'phone' => $request->phone,
                'type' => $request->type
            ]);

            // Check if profile exists with same phone and type
            $existingProfile = Profile::where('phone', $request->phone)
                ->where('type', $request->type)
                ->first();

            if ($existingProfile) {
                \Log::info('Duplicate profile attempt', [
                    'phone' => $request->phone,
                    'type' => $request->type,
                    'existing_user_id' => $existingProfile->user_id
                ]);

                return response()->json([
                    'success' => false,
                    'message' => "A {$request->type} profile with this phone number already exists. Please login instead.",
                    'error_code' => 'PROFILE_EXISTS'
                ], 400);
            }

            // Verify OTP
            $verification_check = $this->twilio->verify->v2
                ->services($this->verificationSid)
                ->verificationChecks
                ->create([
                    'to' => $request->phone,
                    'code' => $request->otp
                ]);

            if ($verification_check->status === 'approved') {
                // Find existing user by phone number (across any type)
                $existingUser = Profile::where('phone', $request->phone)
                    ->first()?->user;

                // If user exists, use that user, otherwise create new
                $user = $existingUser ?? User::create([
                    'name' => $request->full_name,
                    'email' => $request->email,
                    'password' => Hash::make(Str::random(16))
                ]);

                // Create new profile for this type
                $profile = Profile::create([
                    'user_id' => $user->id,
                    'full_name' => $request->full_name,
                    'phone' => $request->phone,
                    'email' => $request->email,
                    'type' => $request->type,
                    'business_name' => $request->business_name,
                    'business_license' => $request->business_license
                ]);

                $token = $user->createToken('auth-token')->plainTextToken;

                return response()->json([
                    'success' => true,
                    'token' => $token,
                    'user' => $user->load(['profile' => function($query) use ($request) {
                        $query->where('type', $request->type);
                    }])
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Invalid OTP'
            ], 400);

        } catch (\Exception $e) {
            \Log::error('Registration failed', [
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

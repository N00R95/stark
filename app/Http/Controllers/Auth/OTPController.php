<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Twilio\Rest\Client;
use Twilio\Exceptions\TwilioException;
use App\Services\TwilioHttpClient;

class OTPController extends Controller
{
    protected $twilio;
    protected $verificationSid;

    public function __construct()
    {
        $httpClient = new TwilioHttpClient();
        $this->twilio = new Client(
            config('services.twilio.account_sid'),
            config('services.twilio.auth_token'),
            null,
            null,
            $httpClient
        );
        $this->verificationSid = config('services.twilio.verification_sid');
    }

    public function send(Request $request)
    {
        try {
            $request->validate([
                'phone' => ['required', 'string', 'regex:/^\+966\d{9}$/'],
                'channel' => 'required|in:sms,whatsapp'
            ]);

            $verification = $this->twilio->verify->v2
                ->services($this->verificationSid)
                ->verifications
                ->create($request->phone, $request->channel);

            return response()->json([
                'success' => true,
                'message' => 'OTP sent successfully',
                'status' => $verification->status
            ]);
        } catch (TwilioException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send OTP: ' . $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send OTP: ' . $e->getMessage()
            ], 500);
        }
    }

    public function verify(Request $request)
    {
        try {
            $request->validate([
                'phone' => ['required', 'string', 'regex:/^\+966\d{9}$/'],
                'code' => 'required|string|size:6'
            ]);

            $verification_check = $this->twilio->verify->v2
                ->services($this->verificationSid)
                ->verificationChecks
                ->create([
                    'to' => $request->phone,
                    'code' => $request->code
                ]);

            if ($verification_check->status === 'approved') {
                return response()->json([
                    'success' => true,
                    'message' => 'OTP verified successfully'
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Invalid OTP'
            ], 400);
        } catch (TwilioException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to verify OTP: ' . $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to verify OTP: ' . $e->getMessage()
            ], 500);
        }
    }
}

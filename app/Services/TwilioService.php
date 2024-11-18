<?php

namespace App\Services;

use Twilio\Rest\Client;

class TwilioService
{
    protected $client;
    protected $verificationSid;

    public function __construct()
    {
        $this->client = new Client(
            config('services.twilio.sid'),
            config('services.twilio.token'),
            null,
            null,
            new TwilioHttpClient()
        );
        $this->verificationSid = config('services.twilio.verification_sid');
    }

    public function sendVerificationCode($phoneNumber)
    {
        try {
            return $this->client->verify->v2
                ->services($this->verificationSid)
                ->verifications
                ->create($phoneNumber, 'sms');
        } catch (\Exception $e) {
            \Log::error('Failed to send verification code: ' . $e->getMessage());
            throw $e;
        }
    }

    public function verifyCode($phoneNumber, $code)
    {
        try {
            return $this->client->verify->v2
                ->services($this->verificationSid)
                ->verificationChecks
                ->create([
                    'to' => $phoneNumber,
                    'code' => $code
                ]);
        } catch (\Exception $e) {
            \Log::error('Failed to verify code: ' . $e->getMessage());
            throw $e;
        }
    }
} 
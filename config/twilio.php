<?php

return [
    'account_sid' => env('TWILIO_ACCOUNT_SID'),
    'auth_token' => env('TWILIO_AUTH_TOKEN'),
    'verification_sid' => env('TWILIO_VERIFICATION_SID'),
    'ssl_verify' => env('APP_ENV') === 'production',
    'debug' => env('APP_DEBUG', false),
];

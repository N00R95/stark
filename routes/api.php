<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\PropertyController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['api']], function () {
    // Public property routes - move these OUTSIDE the auth middleware
    Route::get('/properties', [PropertyController::class, 'index']);
    Route::get('/properties/{id}', [PropertyController::class, 'show']);

    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::post('/send-otp', [AuthController::class, 'getOTP']);
        Route::post('/verify-otp', [AuthController::class, 'verifyOTP']);
        Route::post('/register/verify-otp', [AuthController::class, 'registerVerifyOTP']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/user', [AuthController::class, 'user']);
        });
    });

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('properties/owner', [PropertyController::class, 'getOwnerProperties']);
        Route::post('properties/{id}/save', [PropertyController::class, 'toggleSave']);
    });
});

// Test route
Route::get('/test-twilio', function() {
    try {
        // Create client with SSL verification disabled
        $client = new \Twilio\Rest\Client(
            config('services.twilio.account_sid'),
            config('services.twilio.auth_token'),
            null,
            null,
            new \App\Services\TwilioHttpClient([
                'verify' => false // Disable SSL verification for development
            ])
        );

        $account = $client->account->fetch();

        return response()->json([
            'success' => true,
            'account_type' => $account->type,
            'account_status' => $account->status,
            'verification_sid_exists' => !empty(config('services.twilio.verification_sid')),
            'account_sid_prefix' => substr(config('services.twilio.account_sid'), 0, 4) . '...'
        ]);
    } catch (\Exception $e) {
        \Log::error('Twilio Test Error', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
            'type' => get_class($e)
        ], 500);
    }
});


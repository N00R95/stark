<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        'api/*',
        'sanctum/csrf-cookie',
    ];

    protected function tokensMatch($request)
    {
        $token = $this->getTokenFromRequest($request);
        $sessionToken = $request->session()->token();

        \Log::debug('CSRF Token Check', [
            'token' => substr($token, 0, 10) . '...',
            'sessionToken' => substr($sessionToken, 0, 10) . '...',
            'match' => hash_equals($sessionToken, $token)
        ]);

        return parent::tokensMatch($request);
    }
}

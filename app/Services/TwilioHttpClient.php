<?php

namespace App\Services;

use Twilio\Http\Client;
use Twilio\Http\Response;
use Twilio\Exceptions\ConfigurationException;
use GuzzleHttp\Client as GuzzleClient;

class TwilioHttpClient implements Client
{
    protected $guzzle;

    public function __construct()
    {
        $this->guzzle = new GuzzleClient([
            'verify' => false,
            'timeout' => 60,
            'connect_timeout' => 60,
            'http_errors' => true,
            'defaults' => [
                'verify' => false
            ],
            'config' => [
                'curl' => [
                    CURLOPT_SSL_VERIFYHOST => 0,
                    CURLOPT_SSL_VERIFYPEER => 0,
                ]
            ]
        ]);
    }

    public function request(
        string $method,
        string $url,
        array $params = [],
        array $data = [],
        array $headers = [],
        ?string $user = null,
        ?string $password = null,
        ?int $timeout = null
    ): Response {
        try {
            \Log::debug('Twilio Request', [
                'method' => $method,
                'url' => $url,
                'auth' => [
                    'user' => $user ? substr($user, 0, 4) . '...' : null,
                    'password' => $password ? 'exists' : 'missing'
                ]
            ]);

            $options = [
                'auth' => [$user, $password],
                'headers' => $headers,
                'query' => $params,
                'form_params' => $data,
                'verify' => false,
                'curl' => [
                    CURLOPT_SSL_VERIFYHOST => 0,
                    CURLOPT_SSL_VERIFYPEER => 0,
                ]
            ];

            $response = $this->guzzle->request($method, $url, $options);
            $body = $response->getBody()->getContents();

            return new Response(
                $response->getStatusCode(),
                $body,
                $response->getHeaders()
            );

        } catch (\Exception $e) {
            \Log::error('Twilio Request Failed', [
                'error' => $e->getMessage(),
                'url' => $url,
                'method' => $method
            ]);
            throw new ConfigurationException($e->getMessage());
        }
    }
}

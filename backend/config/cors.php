<?php

return [
      'paths' => ['api/*', 'register', 'login', 'logout', '*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://iskill-sigma.vercel.app'
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];

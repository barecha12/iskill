<?php
$host = 'ep-curly-morning-aqiyvzq7.c-8.us-east-1.aws.neon.tech';
$db   = 'neondb';
$user = 'neondb_owner';
$pass = 'npg_iwWz1tLkTdK8';
$port = 5432;
$endpoint = 'ep-curly-morning-aqiyvzq7';

$tests = [
    "Standard with prefix" => "pgsql:host=$host;dbname=$db;port=$port;sslmode=require",
    "Options in DSN" => "pgsql:host=$host;dbname=$db;port=$port;sslmode=require;options='endpoint=$endpoint'",
    "Options in DSN (no quotes)" => "pgsql:host=$host;dbname=$db;port=$port;sslmode=require;options=endpoint=$endpoint",
];

foreach ($tests as $name => $dsn) {
    echo "Testing $name: $dsn\n";
    try {
        $u = ($name === "Standard with prefix") ? "$endpoint$user" : $user;
        // Wait, prefix is endpoint$user
        if ($name === "Standard with prefix") $u = "$endpoint\$$user";
        
        $pdo = new PDO($dsn, $u, $pass);
        echo "✅ SUCCESS!\n\n";
        break;
    } catch (PDOException $e) {
        echo "❌ FAILED: " . $e->getMessage() . "\n\n";
    }
}

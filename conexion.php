<?php
    $serverName = "db_global"; 
    $connectionInfo = [
        "Database" => "curso_fullstack",
        "UID" => "sa",
        "PWD" => "TuPasswordFuerte123!",
        "CharacterSet" => "UTF-8"
    ];

    try{
        $dsn = "sqlsrv:Server=$serverName;Database=" . $connectionInfo['Database'] . ";TrustServerCertificate=1";
        $pdo = new PDO($dsn, $connectionInfo['UID'], $connectionInfo['PWD']);

        //Configurar el manejo de errores para que lance excepciones (muy util para las APIs)
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }catch(PDOException $e){
         if (strpos($_SERVER['REQUEST_URI'], '/api/') !== false) {
            header('Content-Type: application/json');
            die(json_encode(["error" => "Error de conexión a la DB: " . $e->getMessage()]));
         }
         die("❌ Error Crítico de Conexión: " . $e->getMessage());
    }
?>
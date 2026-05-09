<?php
// ============================================================
// ENDPOINT: Verificar Sesión (GET)
// ============================================================
// Este archivo le dice al frontend si hay una sesión activa.
// El dashboard.html y login.html lo consultan al cargar:
//   - Si hay sesión → el dashboard muestra los datos
//   - Si NO hay sesión → redirige al login

session_start();
header('Content-Type: application/json');

// isset() verifica si la variable existe y no es null
if (isset($_SESSION['usuario'])) {
    echo json_encode([
        "loggedIn" => true,
        "usuario" => $_SESSION['usuario'],
        "nombre" => $_SESSION['nombre']
    ]);
} else {
    echo json_encode([
        "loggedIn" => false
    ]);
}
?>

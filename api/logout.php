<?php
// ============================================================
// ENDPOINT: Logout (GET)
// ============================================================
// Destruye la sesión del usuario.
//
// ¿Qué hace session_destroy()?
// ─────────────────────────────
// Elimina TODOS los datos de la sesión en el servidor.
// Es como quitarle la pulsera al usuario en el parque de diversiones.
//
// Después de esto, $_SESSION queda vacío y cualquier petición
// a check_session.php o get_estudiantes.php devolverá "no autorizado".

session_start();
header('Content-Type: application/json');

// Limpiar todas las variables de sesión
$_SESSION = [];

// Destruir la sesión en el servidor
session_destroy();

echo json_encode([
    "success" => true,
    "message" => "Sesión cerrada correctamente"
]);
?>

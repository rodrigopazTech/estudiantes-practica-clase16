<?php
// ============================================================
// ENDPOINT: Obtener Estudiantes (GET) — PROTEGIDO CON SESIÓN
// ============================================================
// Este es el mismo endpoint de la práctica anterior, pero ahora
// verifica que el usuario tenga una sesión activa antes de dar los datos.
//
// Sin esta protección, cualquiera podría escribir la URL en el navegador
// y ver todos los estudiantes sin haberse logueado.

// PASO 1: Iniciar/retomar la sesión
// Esto DEBE ir antes de cualquier verificación de $_SESSION
session_start();

header('Content-Type: application/json');

// PASO 2: Verificar que hay una sesión activa
// ─────────────────────────────────────────────
// Si $_SESSION['usuario'] NO existe, significa que:
//   - El usuario nunca se logueó, o
//   - La sesión expiró, o
//   - Hicieron logout
//
// Código 401 = "Unauthorized" (No autorizado)
// Le dice al frontend: "No sé quién eres, identifícate primero"
if (!isset($_SESSION['usuario'])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "error" => "Debes iniciar sesión para acceder a estos datos"
    ]);
    exit;
}

// PASO 3: Si llegamos aquí, el usuario SÍ está autenticado
// Procedemos a consultar la base de datos normalmente
require_once '../conexion.php';

try {
    $query = "SELECT id as Numero_Alumno, nombre as Nombre, email as Correo, FORMAT(fecha_registro, 'dd/MM/yyyy HH:mm') as fecha FROM estudiantes ORDER BY id DESC";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $estudiantes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($estudiantes);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error al consultar la base de datos: " . $e->getMessage()
    ]);
}
?>

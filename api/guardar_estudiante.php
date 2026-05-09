<?php
// ============================================================
// ENDPOINT: Guardar Estudiante (POST) — PROTEGIDO CON SESIÓN
// ============================================================

session_start();
header('Content-Type: application/json');

// Verificar sesión activa
if (!isset($_SESSION['usuario'])) {
    http_response_code(401);
    echo json_encode(["error" => "Debes iniciar sesión para guardar datos"]);
    exit;
}

// Verificar que sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Solo se permiten peticiones POST"]);
    exit;
}

$nombre = $_POST['nombre'] ?? '';
$email = $_POST['email'] ?? '';

if (empty($nombre) || empty($email)) {
    http_response_code(400);
    echo json_encode(["error" => "El nombre y el email son obligatorios"]);
    exit;
}

require_once '../conexion.php';

try {
    $query = "INSERT INTO estudiantes (nombre, email) VALUES (:nombre, :email)";
    $stmt = $pdo->prepare($query);
    
    $stmt->execute([
        ':nombre' => $nombre,
        ':email'  => $email
    ]);
    
    echo json_encode([
        "success" => true,
        "message" => "Estudiante guardado correctamente"
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    $errorMessage = "Error al guardar el estudiante.";
    
    if ($e->getCode() == '23000') {
        $errorMessage = "Este email ya se encuentra registrado.";
    }

    echo json_encode([
        "success" => false,
        "error" => $errorMessage,
        "debug" => $e->getMessage()
    ]);
}
?>

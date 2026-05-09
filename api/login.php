<?php
// ============================================================
// ENDPOINT: Login (POST)
// ============================================================
// Este archivo recibe usuario y contraseña, valida las credenciales,
// y si son correctas, crea una SESIÓN en el servidor.
//
// ¿Qué es session_start()?
// ────────────────────────
// Inicia el sistema de sesiones de PHP. DEBE ser lo PRIMERO que se ejecuta
// (antes de cualquier echo, header, o HTML).
//
// Lo que hace internamente:
//   1. Busca si el navegador envió una cookie llamada PHPSESSID
//   2. Si la encuentra → retoma esa sesión existente
//   3. Si NO la encuentra → crea una sesión NUEVA con un ID único
//   4. En ambos casos, llena $_SESSION con los datos guardados

session_start();
header('Content-Type: application/json');

// Solo aceptamos peticiones POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Solo se permiten peticiones POST"]);
    exit;
}

// Extraer datos del formulario
$usuario = $_POST['usuario'] ?? '';
$password = $_POST['password'] ?? '';

// Validar que no estén vacíos
if (empty($usuario) || empty($password)) {
    http_response_code(400);
    echo json_encode(["error" => "El usuario y la contraseña son obligatorios"]);
    exit;
}

// ────────────────────────────────────────────────────────────
// CREDENCIALES HARDCODEADAS (solo para práctica en clase)
// ────────────────────────────────────────────────────────────
// En un sistema REAL, las credenciales estarían en la base de datos
// y la contraseña se verificaría con password_verify() contra un hash.
//
// Ejemplo de cómo sería en producción:
//   $query = "SELECT id, nombre, password_hash FROM usuarios WHERE usuario = :usuario";
//   $stmt = $pdo->prepare($query);
//   $stmt->execute([':usuario' => $usuario]);
//   $user = $stmt->fetch(PDO::FETCH_ASSOC);
//   if ($user && password_verify($password, $user['password_hash'])) { ... }
$usuarios_validos = [
    'profesor' => ['password' => 'clase14', 'nombre' => 'Prof. Rodrigo Paz'],
    'alumno'   => ['password' => 'fullstack', 'nombre' => 'Estudiante Demo']
];

// Verificar credenciales
if (!isset($usuarios_validos[$usuario]) || $usuarios_validos[$usuario]['password'] !== $password) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "error" => "Usuario o contraseña incorrectos"
    ]);
    exit;
}

// ────────────────────────────────────────────────────────────
// LOGIN EXITOSO: Guardar datos en la sesión
// ────────────────────────────────────────────────────────────
// $_SESSION es un array superglobal que PERSISTE entre peticiones.
// Todo lo que guardemos aquí estará disponible en CUALQUIER otro
// archivo PHP que haga session_start(), mientras la sesión esté activa.
//
// Diferencia clave:
//   $_POST → datos de UNA sola petición (se pierden al terminar)
//   $_SESSION → datos que SOBREVIVEN entre múltiples peticiones
$_SESSION['usuario'] = $usuario;
$_SESSION['nombre'] = $usuarios_validos[$usuario]['nombre'];

echo json_encode([
    "success" => true,
    "message" => "Login exitoso",
    "nombre" => $_SESSION['nombre']
]);
?>

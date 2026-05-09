# 🎓 Guía del Profesor: Autenticación con Sesiones PHP

## Objetivo de esta práctica
Que los alumnos entiendan cómo funciona la autenticación básica en una aplicación web Full Stack,
conectando un formulario de login (HTML + JS) con un backend PHP que usa sesiones.

---

## Estructura de archivos

```
practica_login/
├── GUIA_PROFESOR.md          ← Este archivo (solo para ti)
├── conexion.php              ← Conexión a la BD (misma de siempre)
├── index.html                ← Formulario de login
├── dashboard.html            ← Página protegida (tabla de estudiantes)
├── js/
│   ├── login.js              ← Lógica del formulario de login
│   └── dashboard.js          ← Lógica de la tabla (con verificación de sesión)
└── api/
    ├── login.php             ← ⭐ NUEVO: Endpoint que crea la sesión
    ├── logout.php            ← ⭐ NUEVO: Endpoint que destruye la sesión
    ├── check_session.php     ← ⭐ NUEVO: Verifica si hay sesión activa
    └── get_estudiantes.php   ← MODIFICADO: Ahora verifica sesión antes de dar datos
```

---

## Orden sugerido para explicar en clase

### PASO 1: ¿Qué es una sesión? (5 min teóricos)

**Analogía:** Una sesión es como una **pulsera de acceso** en un parque de diversiones.
- Cuando compras tu boleto (login), te ponen una pulsera con un código único.
- Cada vez que quieres subirte a un juego (hacer un request), muestras la pulsera.
- El parque (servidor) revisa tu pulsera y ve quién eres sin pedirte el boleto de nuevo.
- Cuando sales del parque (logout o cierras el navegador), la pulsera se desactiva.

**Puntos técnicos clave:**
- PHP guarda la sesión en el SERVIDOR (no en el navegador)
- El navegador solo guarda un **cookie** con el ID de sesión (`PHPSESSID`)
- `session_start()` es lo primero que debe ejecutarse en CADA archivo PHP que use sesiones
- `$_SESSION` es un array superglobal que persiste entre peticiones

### PASO 2: Mostrar login.php (10 min)

**Archivo clave:** `api/login.php`

Conceptos a explicar:
1. **`session_start()`** — Inicia o retoma la sesión. DEBE ir antes de cualquier output.
2. **Validación de credenciales** — En esta práctica usamos credenciales hardcodeadas para simplicidad.
   - Explicar que en producción se usaría `password_hash()` y `password_verify()` con la BD.
3. **`$_SESSION['variable']`** — Cómo guardar datos en la sesión.
4. **Diferencia entre `$_POST` y `$_SESSION`**:
   - `$_POST` → datos que llegan en UNA petición y se pierden
   - `$_SESSION` → datos que PERSISTEN entre múltiples peticiones

**Pregunta para los alumnos:** _"¿Qué pasa si alguien abre directamente 
`api/get_estudiantes.php` en el navegador sin loguearse?"_

### PASO 3: Proteger el endpoint (10 min)

**Archivo clave:** `api/get_estudiantes.php`

Mostrar cómo se agrega la verificación de sesión:
```php
session_start();
if (!isset($_SESSION['usuario'])) {
    http_response_code(401); // No autorizado
    echo json_encode(["error" => "Debes iniciar sesión"]);
    exit;
}
```

Conceptos a explicar:
1. **Código HTTP 401 (Unauthorized)** — "Sé que me estás hablando, pero no sé QUIÉN eres"
2. **Código HTTP 403 (Forbidden)** — "Sé quién eres, pero NO tienes permiso" (para futuro)
3. **`isset()`** — Verifica si la variable existe y no es null
4. **`exit`** — Detiene la ejecución. Sin esto, el código seguiría y daría los datos.

### PASO 4: El flujo completo (10 min - demostración en vivo)

Hacer la demo en el navegador con DevTools abierto (pestaña Network):

1. Abrir `index.html` → Aparece el formulario de login
2. Intentar ir directo a `dashboard.html` → El JS detecta que no hay sesión y redirige
3. Hacer login con credenciales correctas → Se crea la sesión, redirige al dashboard
4. Ver los estudiantes cargados en la tabla
5. Hacer logout → Se destruye la sesión, regresa al login

**En DevTools mostrar:**
- La cookie `PHPSESSID` que se creó automáticamente (Application → Cookies)
- Las peticiones a `check_session.php` y `get_estudiantes.php` (Network tab)
- El código 401 cuando no hay sesión vs 200 cuando sí hay

### PASO 5: Ejercicio para los alumnos (10 min)

Pedirles que:
1. Cambien las credenciales hardcodeadas por otras
2. Agreguen un campo más al login (ej: un "rol")
3. Muestren el nombre del usuario en el dashboard
4. **(Bonus)** Conecten el login a la tabla `usuarios` de la BD real

---

## Credenciales de prueba (hardcodeadas)

| Usuario   | Contraseña |
|-----------|------------|
| `profesor`  | `clase14`    |
| `alumno`    | `fullstack`  |

---

## Código HTTP relevantes para esta práctica

| Código | Nombre | Cuándo usarlo |
|--------|--------|---------------|
| 200 | OK | Login exitoso, datos obtenidos correctamente |
| 400 | Bad Request | Faltan campos en el formulario |
| 401 | Unauthorized | No hay sesión activa (no se ha logueado) |
| 405 | Method Not Allowed | Intentaron GET en un endpoint que solo acepta POST |
| 500 | Internal Server Error | Error de BD u otro error del servidor |

---

## Diagrama del flujo

```
┌─────────────┐     POST /api/login.php      ┌─────────────┐
│             │  ──────────────────────────►  │             │
│  index.html │  { usuario, password }        │  login.php  │
│  (Login)    │  ◄──────────────────────────  │  (PHP)      │
│             │  { success: true }            │             │
└─────────────┘  + Cookie PHPSESSID           └──────┬──────┘
      │                                              │
      │ Redirige a dashboard.html                    │ session_start()
      ▼                                              │ $_SESSION['usuario'] = '...'
┌─────────────┐     GET /api/check_session    ┌──────┴──────┐
│             │  ──────────────────────────►  │             │
│ dashboard   │  Cookie: PHPSESSID=abc123     │ check_      │
│   .html     │  ◄──────────────────────────  │ session.php │
│             │  { loggedIn: true }           │             │
└──────┬──────┘                               └─────────────┘
       │
       │  GET /api/get_estudiantes.php
       │  Cookie: PHPSESSID=abc123
       ▼
┌─────────────┐
│ get_        │  → session_start()
│ estudiantes │  → ¿isset($_SESSION['usuario'])? 
│ .php        │     ✅ Sí → Devuelve JSON con datos
│             │     ❌ No → 401 Unauthorized
└─────────────┘
```

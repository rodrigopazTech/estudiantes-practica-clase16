/**
 * ============================================================
 * dashboard.js — Lógica del Dashboard (página protegida)
 * ============================================================
 * Este archivo:
 * 1. Verifica que haya una sesión activa (si no, redirige al login)
 * 2. Muestra el nombre del usuario en la barra de navegación
 * 3. Carga y muestra los estudiantes desde la API protegida
 * 4. Permite guardar nuevos estudiantes
 * 5. Maneja el cierre de sesión (logout)
 */

document.addEventListener('DOMContentLoaded', () => {

    // ─────────────────────────────────────────────────────────
    // PASO 1: Verificar sesión activa
    // ─────────────────────────────────────────────────────────
    // Antes de mostrar cualquier dato, preguntamos al servidor
    // si el usuario tiene una sesión activa.
    // Si NO la tiene, lo mandamos de regreso al login.
    fetch('api/check_session.php')
        .then(res => res.json())
        .then(data => {
            if (!data.loggedIn) {
                // No hay sesión → redirigir al login
                window.location.href = 'index.html';
                return;
            }
            // Sí hay sesión → mostrar el nombre del usuario
            document.getElementById('nombre_usuario').textContent = data.nombre;
            // Cargar los estudiantes
            cargarEstudiantes();
        })
        .catch(() => {
            window.location.href = 'index.html';
        });

    // ─────────────────────────────────────────────────────────
    // PASO 2: Escuchar el formulario de registro
    // ─────────────────────────────────────────────────────────
    const form = document.getElementById('form_estudiante');
    form.addEventListener('submit', guardarEstudiante);

    // ─────────────────────────────────────────────────────────
    // PASO 3: Botón de logout
    // ─────────────────────────────────────────────────────────
    document.getElementById('btn_logout').addEventListener('click', async () => {
        try {
            await fetch('api/logout.php');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    });
});

// ─────────────────────────────────────────────────────────────
// FUNCIÓN: Cargar estudiantes desde la API protegida
// ─────────────────────────────────────────────────────────────
// Ahora get_estudiantes.php verifica la sesión.
// Si no hay sesión, devuelve 401 en vez de los datos.
async function cargarEstudiantes() {
    const tbody = document.getElementById('lista-estudiantes');
    const emptyState = document.getElementById('no-data');

    try {
        const response = await fetch('api/get_estudiantes.php');

        // Si el servidor responde 401, significa que la sesión expiró
        if (response.status === 401) {
            alert('Tu sesión ha expirado. Inicia sesión de nuevo.');
            window.location.href = 'index.html';
            return;
        }

        if (!response.ok) throw new Error('Error en la respuesta del servidor');

        const estudiantes = await response.json();

        tbody.innerHTML = '';

        if (estudiantes.length === 0) {
            emptyState.classList.remove('d-none');
            return;
        }

        emptyState.classList.add('d-none');

        // Las propiedades corresponden a los alias del SQL:
        //   SELECT id as Numero_Alumno, nombre as Nombre, email as Correo, ... as fecha
        estudiantes.forEach(est => {
            const fila = `
                <tr>
                    <td><span class="badge bg-secondary">#${est.Numero_Alumno}</span></td>
                    <td class="fw-bold">${est.Nombre}</td>
                    <td>${est.Correo}</td>
                    <td class="text-muted small">${est.fecha}</td>
                </tr>
            `;
            tbody.innerHTML += fila;
        });

    } catch (error) {
        console.error('❌ Error al cargar:', error);
        tbody.innerHTML = `<tr><td colspan="4" class="text-danger text-center">Error al cargar datos</td></tr>`;
    }
}

// ─────────────────────────────────────────────────────────────
// FUNCIÓN: Guardar un estudiante vía POST
// ─────────────────────────────────────────────────────────────
async function guardarEstudiante(e) {
    e.preventDefault();

    const form = e.target;
    const btnText = document.getElementById('btn_text');
    const spinner = document.getElementById('spinner_form');

    btnText.style.display = 'none';
    spinner.style.display = 'inline-block';

    const formData = new FormData(form);

    try {
        const response = await fetch('api/guardar_estudiante.php', {
            method: 'POST',
            body: formData
        });

        // Verificar si la sesión expiró
        if (response.status === 401) {
            alert('Tu sesión ha expirado. Inicia sesión de nuevo.');
            window.location.href = 'index.html';
            return;
        }

        const resultado = await response.json();

        if (resultado.success) {
            alert('✅ Éxito: ' + resultado.message);
            form.reset();
            cargarEstudiantes();
        } else {
            alert('❌ Error: ' + resultado.error);
        }

    } catch (error) {
        console.error('❌ Error en la petición:', error);
        alert('Hubo un problema al conectar con el servidor.');
    } finally {
        btnText.style.display = 'inline';
        spinner.style.display = 'none';
    }
}

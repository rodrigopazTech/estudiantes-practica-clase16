/**
 * ============================================================
 * login.js — Lógica del formulario de Login
 * ============================================================
 * Este archivo envía las credenciales al servidor (api/login.php)
 * y redirige al dashboard si el login es exitoso.
 */

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('form_login');
    const btnText = document.getElementById('btn_text');
    const spinner = document.getElementById('spinner');
    const errorMsg = document.getElementById('error_msg');
    const errorText = document.getElementById('error_text');

    // ─────────────────────────────────────────────────────────
    // Verificar si ya hay una sesión activa
    // ─────────────────────────────────────────────────────────
    // Si el usuario ya está logueado y vuelve al login,
    // lo redirigimos automáticamente al dashboard.
    fetch('api/check_session.php')
        .then(res => res.json())
        .then(data => {
            if (data.loggedIn) {
                window.location.href = 'dashboard.html';
            }
        })
        .catch(() => {}); // Si falla, simplemente mostramos el login

    // ─────────────────────────────────────────────────────────
    // Manejar el envío del formulario
    // ─────────────────────────────────────────────────────────
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Ocultar error previo
        errorMsg.style.display = 'none';

        // Mostrar spinner
        btnText.style.display = 'none';
        spinner.style.display = 'inline-block';

        // Recoger los datos del formulario
        const formData = new FormData(form);

        try {
            // Enviamos las credenciales al servidor por POST
            const response = await fetch('api/login.php', {
                method: 'POST',
                body: formData
            });

            const resultado = await response.json();

            if (resultado.success) {
                // Login exitoso → redirigir al dashboard
                window.location.href = 'dashboard.html';
            } else {
                // Login fallido → mostrar el error
                errorText.textContent = resultado.error;
                errorMsg.style.display = 'block';
            }

        } catch (error) {
            console.error('❌ Error en la petición:', error);
            errorText.textContent = 'Error al conectar con el servidor.';
            errorMsg.style.display = 'block';
        } finally {
            // Restaurar el botón
            btnText.style.display = 'inline';
            spinner.style.display = 'none';
        }
    });
});

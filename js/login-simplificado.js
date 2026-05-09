/**
 * login-simplificado.js
 * Lógica esencial para autenticar al usuario.
 */
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form_login');
    const errorMsg = document.getElementById('error_msg');
    const errorText = document.getElementById('error_text');

    // 1. Verificar si ya existe una sesión (evita re-logueo)
    fetch('api/check_session.php')
        .then(res => res.json())
        .then(data => {
            if (data.loggedIn) window.location.href = 'dashboard-simplificado.html';
        });

    // 2. Procesar el formulario de Login
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMsg.style.display = 'none';

        const formData = new FormData(form);

        try {
            const response = await fetch('api/login.php', {
                method: 'POST',
                body: formData
            });

            const res = await response.json();

            if (res.success) {
                // Si el servidor dice "OK", vamos al dashboard
                window.location.href = 'dashboard-simplificado.html';
            } else {
                // Si no, mostramos el error que nos envió PHP
                errorText.textContent = res.error;
                errorMsg.style.display = 'block';
            }
        } catch (error) {
            errorText.textContent = "Error de conexión con el servidor";
            errorMsg.style.display = 'block';
        }
    });
});

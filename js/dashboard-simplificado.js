/**
 * dashboard-simplificado.js
 * Gestión de estudiantes con protección de sesión.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Validación de entrada: ¿Tienes permiso para estar aquí?
    fetch('api/check_session.php')
        .then(res => res.json())
        .then(data => {
            if (!data.loggedIn) {
                window.location.href = 'index-simplificado.html';
                return;
            }
            document.getElementById('nombre_usuario').textContent = data.nombre;
            cargarEstudiantes();
        });

    // 2. Escuchar el formulario de registro
    document.getElementById('form_estudiante').addEventListener('submit', guardarEstudiante);

    // 3. Botón de Logout
    document.getElementById('btn_logout').addEventListener('click', async () => {
        await fetch('api/logout.php');
        window.location.href = 'index-simplificado.html';
    });
});

// Función para obtener los datos de la API protegida
async function cargarEstudiantes() {
    const tbody = document.getElementById('lista-estudiantes');
    const emptyState = document.getElementById('no-data');

    try {
        const response = await fetch('api/get_estudiantes.php');
        
        // Si el servidor responde 401, la sesión expiró o es inválida
        if (response.status === 401) {
            window.location.href = 'index-simplificado.html';
            return;
        }

        const estudiantes = await response.json();
        tbody.innerHTML = '';

        if (estudiantes.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        estudiantes.forEach(est => {
            tbody.innerHTML += `
                <tr>
                    <td>${est.Numero_Alumno}</td>
                    <td>${est.Nombre}</td>
                    <td>${est.Correo}</td>
                    <td>${est.fecha}</td>
                </tr>
            `;
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="4">Error al conectar</td></tr>';
    }
}

// Función para enviar un nuevo estudiante
async function guardarEstudiante(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
        const response = await fetch('api/guardar_estudiante.php', {
            method: 'POST',
            body: formData
        });

        if (response.status === 401) {
            window.location.href = 'index-simplificado.html';
            return;
        }

        const res = await response.json();
        if (res.success) {
            alert("Estudiante guardado");
            e.target.reset();
            cargarEstudiantes();
        } else {
            alert("Error: " + res.error);
        }
    } catch (error) {
        alert("Error en la red");
    }
}

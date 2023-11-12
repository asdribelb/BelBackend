
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    try {
        const response = await fetch("/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token);

            if (data.token) {
                if (data.user.rol === 'admin') {
                    // Redireccionar a la página de administrador
                } else if (data.user.rol === 'usuario') {
                    window.location.href = '/current';
                }
            } else {
                console.error("Token no recibido en la respuesta");
            }
        } else {
            console.error("Error en el inicio de sesión:", response.statusText);
        }
    } catch (error) {
        console.error("Error de red:", error);
    }
});

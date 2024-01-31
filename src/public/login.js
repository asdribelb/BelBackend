document.addEventListener("DOMContentLoaded", function () {
  const forgotPasswordButton = document.getElementById("forgotPasswordButton");
  const lblRecuperacion = document.getElementById("lblRecuperacion");

  forgotPasswordButton.addEventListener("click", async function (event) {
      event.preventDefault();

      const emailElement = document.getElementById("email");

      if (emailElement) {
          const email = emailElement.value;

          try {
              const responsePass = await fetch("/forgot-password", {
                  method: "POST",
                  body: JSON.stringify({ email }),
                  headers: {
                      "Content-Type": "application/json",
                  },
              });

              if (responsePass.ok) {
                  const result = await responsePass.text();
                  lblRecuperacion.textContent = result;
              } else {
                  const result = await responsePass.text();
                  lblRecuperacion.textContent = result;
              }
          } catch (error) {
              console.error("Error en la solicitud de restablecimiento de contraseña:", error);
              // Podrías agregar código para mostrar un mensaje de error al usuario en la interfaz.
          }
      } else {
          console.error("Elemento de email no encontrado");
          // Puedes agregar código adicional si es necesario, como mostrar un mensaje de error.
      }
  });

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailElement = document.getElementById("email");
      const passwordElement = document.getElementById("password");

      if (emailElement && passwordElement) {
          const email = emailElement.value;
          const password = passwordElement.value;

          try {
              const response = await fetch("/login", {
                  method: "POST",
                  body: JSON.stringify({ email, password }),
                  headers: {
                      "Content-Type": "application/json",
                  },
              });

              if (response.ok) {
                  const data = await response.json();
                  localStorage.setItem("token", data.token);

                  if (data.token && data.user.rol === 'admin') {
                      window.location.href = '/admin';
                  } else if (data.token && data.user.rol === 'usuario') {
                      window.location.href = '/current';
                  } else if (data.token && data.user.rol === 'premium') {
                      window.location.href = `/current-plus?token=${encodeURIComponent(data.token)}`;
                  }
              } else {
                  console.error("Error en el inicio de sesión");
              }
          } catch (error) {
              console.error("Error en la solicitud de inicio de sesión:", error);
              // Puedes agregar código para mostrar un mensaje de error al usuario en la interfaz.
          }
      } else {
          console.error("Elementos de email y/o password no encontrados");
          // Puedes agregar código adicional si es necesario, como mostrar un mensaje de error.
      }
  });
});
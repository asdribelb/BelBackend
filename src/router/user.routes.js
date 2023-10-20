import express from "express";
import UserManager from "../controllers/UserManager.js";
import { Router } from "express";

const userRouter = Router();
const user = new UserManager();

// Ruta para registrar un nuevo usuario
userRouter.post("/register", (req, res) => {
    try {
        // Obtiene los datos del nuevo usuario del cuerpo de la solicitud
        let newUser = req.body;

        // Llama al método addUser para agregar el nuevo usuario
        user.addUser(newUser);

        // Redirige al usuario a la página de inicio de sesión (login)
        res.redirect("/login");
    } catch (error) {
        res.status(500).send("Error al registrar el usuario: " + error.message);
    }
});

// Ruta para iniciar sesión
userRouter.post("/login", async (req, res) => {
    try {
        // Obtiene el correo electrónico y la contraseña del cuerpo de la solicitud
        let email = req.body.email;
        const data = await user.validateUser(email);

        // Compara la contraseña proporcionada con la contraseña almacenada en la base de datos
        if (data.password === req.body.password) {
            if (data.rol === 'admin') {
                // Si el usuario es un administrador, se establecen variables de sesión
                req.session.emailUsuario = email;
                req.session.nomUsuario = data.first_name;
                req.session.apeUsuario = data.last_name;
                req.session.rolUsuario = data.rol;
                res.redirect("/profile");
            } else {
                // Si el usuario no es un administrador, se establecen variables de sesión y se redirige a la página de productos
                req.session.emailUsuario = email;
                req.session.rolUsuario = data.rol;
                res.redirect("/products");
            }
        } else {
            // Si la contraseña no coincide, se redirige de nuevo a la página de inicio de sesión
            res.redirect("/login");
        }
    } catch (error) {
        res.status(500).send("Error al iniciar sesión: " + error.message);
    }
});

// Ruta para cerrar sesión
userRouter.get("/logout", async (req, res) => {
    // Cierra la sesión del usuario y redirige a la página de inicio de sesión
    req.session.destroy((error) => {
        if (error) {
            return res.json({ status: 'Logout Error', body: error });
        }
        res.redirect('/login');
    });
});

export default userRouter;

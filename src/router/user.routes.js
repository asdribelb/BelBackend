import UserManager from "../controllers/UserManager.js";
import { Router } from "express";
import passport from "passport";

const userRouter = Router();
const user = new UserManager();

// Registro de usuarios
userRouter.post("/register", passport.authenticate("register", { failureRedirect: "/failregister" }), async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, rol } = req.body;

        // Comprobar si faltan datos
        if (!first_name || !last_name || !email || !age) return res.status(400).send({ status: 400, error: 'Faltan datos' });

        // Redirigir al usuario a la página de inicio de sesión después de un registro exitoso
        res.redirect("/login");
    } catch (error) {
        res.status(500).send("Error al acceder al registrar: " + error.message);
    }
});

// Página para manejar el fallo del registro
userRouter.get("/failregister", async (req, res) => {
    console.log("Failed Strategy");
    res.send({ error: "Failed" });
});

// Inicio de sesión de usuarios
userRouter.post("/login", passport.authenticate("login", { failureRedirect: "/faillogin" }), async (req, res) => {
    try {
        if (!req.user) return res.status(400).send({ status: "error", error: "Credenciales inválidas" });

        if (req.user.rol === 'admin') {
            // Establecer las variables de sesión y redirigir al perfil de administrador
            req.session.emailUsuario = req.user.email;
            req.session.nomUsuario = req.user.first_name;
            req.session.apeUsuario = req.user.last_name;
            req.session.rolUsuario = req.user.rol;
            res.redirect("/profile");
        } else {
            // Establecer las variables de sesión y redirigir a la página de productos
            req.session.emailUsuario = req.user.email;
            req.session.rolUsuario = req.user.rol;
            res.redirect("/products");
        }
    } catch (error) {
        res.status(500).send("Error al acceder al perfil: " + error.message);
    }
});

// Página para manejar el fallo del inicio de sesión
userRouter.get("/faillogin", async (req, res) => {
    res.send({ error: "Failed Login" });
});

// Cierre de sesión de usuarios
userRouter.get("/logout", async (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.json({ status: 'Logout Error', body: error });
        }
        res.redirect('../../login');
    });
});

// Inicio de sesión con GitHub
userRouter.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { });

// Callback de GitHub para manejar la respuesta de autenticación
userRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
    // Almacenar los datos del usuario en la sesión
    req.session.user = req.user;
    req.session.emailUsuario = req.session.user.email
    req.session.rolUsuario = req.session.user.rol
    res.redirect("/products");    
})


export default userRouter;

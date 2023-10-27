import express from "express";
import { engine } from "express-handlebars";
import * as path from "path"
import __dirname from "./utils.js";
import mongoose from "mongoose"
import prodRouter from "./router/product.routes.js"
import cartRouter from "./router/cart.routes.js"
import ProductManager from "./controllers/ProductManager.js"
import CartManager from "./controllers/CartManager.js"
import userRouter from "./router/user.routes.js"
import MongoStore from "connect-mongo"
import session from 'express-session'
import FileStore from 'session-file-store'
import passport from "passport"
import initializePassword from "./config/passport.config.js"

const app = express();
const PORT = 8080;
const fileStorage = FileStore(session)
const product = new ProductManager()
const cart = new CartManager()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.listen(PORT, () => {
    console.log(`Servidor Express Puerto ${PORT}`)
})


//Mongoose
mongoose.connect("mongodb+srv://asdribelb:LIaLTms1Lcgdfohq@abellorin.mity2xr.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
        console.log("Conectado a la base de datos")
    })
    .catch(error => {
        console.error("Error al conectarse a la base de datos, error" + error)
    })


//Mongo Atlas
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://asdribelb:LIaLTms1Lcgdfohq@abellorin.mity2xr.mongodb.net/?retryWrites=true&w=majority",
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true }, ttl: 3600
    }),
    secret: "ClaveSecreta",
    resave: false,
    saveUninitialized: false,
}))

//Passport//
initializePassword()
app.use(passport.initialize())
app.use(passport.session())

// Rutas para manejar productos, carritos y sesiones de usuario
app.use("/api/products", prodRouter)
app.use("/api/carts", cartRouter)
app.use("/api/sessions", userRouter)

//Handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

//static
app.use(express.static(__dirname + "/public"));

// Ruta para mostrar productos en la vista
app.get("/products", async (req, res) => {
    if (!req.session.emailUsuario) {
        return res.redirect("/login")
    }
    let allProducts = await product.getProducts()
    allProducts = allProducts.map(product => product.toJSON());
    res.render("viewProducts", {
        title: "Productos",
        products: allProducts,
        email: req.session.emailUsuario,
        rol: req.session.rolUsuario,
    });
})

// Ruta para mostrar el carrito
app.get("/carts/:cid", async (req, res) => {
    let id = req.params.cid
    let allCarts = await cart.getCartWithProducts(id)
    res.render("viewCart", {
        title: "Carro",
        carts: allCarts
    });
})

// Ruta para el inicio de sesión
app.get("/login", async (req, res) => {
    res.render("login", {
        title: "Login",
    });

})

// Ruta para el registro de usuarios
app.get("/register", async (req, res) => {
    res.render("register", {
        title: "Register",
    });
})

// Ruta para el perfil de usuario
app.get("/profile", async (req, res) => {
    if (!req.session.emailUsuario) {
        return res.redirect("/login")
    }
    res.render("profile", {
        title: "Profile Admin",
        first_name: req.session.nomUsuario,
        last_name: req.session.apeUsuario,
        email: req.session.emailUsuario,
        rol: req.session.rolUsuario,

    });
})


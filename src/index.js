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

app.use("/api/products", prodRouter)
app.use("/api/carts", cartRouter)
app.use("/api/sessions", userRouter)

//Handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

//static
app.use(express.static(__dirname + "/public"));

app.get("/products", async (req, res) => {
    if (!req.session.emailUsuario) {
        return res.redirect("/login")
    }
    let allProducts = await product.getProducts()
    allProducts = allProducts.map(product => product.toJSON());
    res.render("viewProducts", {
        title: "Vista Productos",
        products: allProducts,
        email: req.session.emailUsuario,
        rol: req.session.rolUsuario,
        algo: req.session.algo,
    });
})


app.get("/carts/:cid", async (req, res) => {
    let id = req.params.cid
    let allCarts = await cart.getCartWithProducts(id)
    res.render("viewCart", {
        title: "Vista Carro",
        carts: allCarts
    });
})

//Ingreso Login http://localhost:8080/login
app.get("/login", async (req, res) => {
    res.render("login", {
        title: "Login",
    });

})
//Ingreso Register http://localhost:8080/register
app.get("/register", async (req, res) => {
    res.render("register", {
        title: "Register",
    });
})
//Ingreso Profile http://localhost:8080/profile
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
import express from "express";
import { engine } from "express-handlebars";
import * as path from "path"
import __dirname from "./utils.js";
import connectDB from './config/db.js';
import userRouter from "./router/user.routes.js"
import mongoose from 'mongoose'
import passport from "passport"
import session from 'express-session'
import sessionConfig from './config/session.js';
import initializePassword from "./config/passport.config.js"
import prodRouter from "./router/product.routes.js"
import cartRouter from "./router/cart.routes.js"


// Configuración de .env
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Conectar a la base de datos MongoDB
connectDB();

// Configuración de la sesión
app.use(session(sessionConfig));

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


export default app;


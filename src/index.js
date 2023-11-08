import express from "express"
import mongoose from "mongoose"
import passport from "passport"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt as ExtractJwt } from 'passport-jwt';
import * as path from "path"
import __dirname, { authorization, passportCall } from "./utils.js"
import initializePassport from "./config/passport.config.js"

const app = express()

const users = [
    { id: 1, email: "ejemplo@hotmail.com", password: "123456", role: "user" }
]

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "Secret-key"
}

passport.use(
    new JwtStrategy(jwtOptions, (jwt_payload, done) => {
        const user = users.find((user) => user.email === jwt_payload.email)
        if (!user) {
            return done(null, false, { message: "Usuario no encontrado" })
        }
        return done(null, user)
    })
)


//Mongo Atlas
mongoose.connect("mongodb+srv://asdribelb:LIaLTms1Lcgdfohq@abellorin.mity2xr.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
        console.log("Conectado con Mongo Atlas")
    })
    .catch(error => {
        console.error("Error al conectarse a la base de datos, error" + error)
    })

//Passport//
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());

app.post("/login", (req, res) => {
    const { email, password } = req.body
    const user = users.find((user) => user.email === email)
    if (!user || user.password !== password) {
        return res.status(401).json({ message: "Error de autenticacion" })
    }
    const token = jwt.sign({ email, password, role: "user" }, "Secret-key", { expiresIn: "24h" })
    res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 })
    console.log(token)
    res.json({ token })
})
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: app.get('views') });
});
app.get('/current', passportCall('jwt'), authorization('user'), (req, res) => {
    res.send(req.user)
})

app.listen(8080, () => {
    console.log("Servidor corriendo en puerto 8080")
})
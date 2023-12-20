import express from "express";
import { engine } from "express-handlebars";
import * as path from "path"
import mongoose from 'mongoose'
import config from './config/config.js'
import passport from "passport"
import cookieParser from "cookie-parser"
import initializePassword from "./config/passport.config.js"
import cartsRouter from './router/carts.router.js'
import productsRouter from './router/products.router.js'
import usersRouter from './router/users.router.js'
import ticketsRouter from './router/tickets.router.js'
import UserMongo from "./dao/mongo/users.mongo.js"
import ProdMongo from "./dao/mongo/products.mongo.js"
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt as ExtractJwt } from 'passport-jwt';
import {Server} from "socket.io"
import __dirname, { authorization, passportCall, transport } from "./utils.js"
import {generateAndSetToken} from "./jwt/token.js"
import UserDTO from './dao/DTOs/user.dto.js'
import session from "express-session";
import MongoStore from "connect-mongo";
import http from 'http';


// Configuración de .env
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 8080;
const server = http.createServer(app)
const io = new Server(server)

const users = new UserMongo()
const products = new ProdMongo()

mongoose.connect(config.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

server.listen(PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`)
  });

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

io.on('connection', (socket) => {
    console.log('Cliente conectado');
  
    io.emit('conexion-establecida', 'Conexión exitosa con el servidor de Socket');
    io.on('disconnect', () => {
      console.log('Cliente desconectado');
    });
  });

    io.on("newEmail", async({email, comment}) => {
        let result = await transport.sendMail({
            from:'Chat Correo <asdribelb@gmail.com>',
            to:email,
            subject:'Mensaje con Socket',
            html:`
            <div>
                <h1>${comment}</h1>
            </div>
            `,
            attachments:[]
        })
        socket.emit("success", "Correo enviado correctamente");
    });

    io.emit("test","mensaje desde servidor a cliente, se valida en consola de navegador")

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "Secret-key"
}

passport.use(
    new JwtStrategy(jwtOptions, (jwt_payload, done)=>{
        const user = users.findJWT((user) =>user.email ===jwt_payload.email)
        if(!user)
        {
            return done(null, false, {message:"Usuario no encontrado"})
        }
        return done(null, user)
    })
)


//Passport//
initializePassword()
app.use(passport.initialize())

// Rutas para manejar productos, carritos y sesiones de usuario
app.use("/carts", cartsRouter)
app.use("/products", productsRouter)
app.use("/users", usersRouter)
app.use("/tickets", ticketsRouter)

//Handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

//static
app.use(express.static(__dirname + "/public"));

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const emailToFind = email;
    const user = await users.findEmail({ email: emailToFind });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Error de autenticación" });
    }
    const token = generateAndSetToken(res, email, password);
    const userDTO = new UserDTO(user);
    const prodAll = await products.get()
    res.json({ token, user: userDTO, prodAll});
  });

app.post("/api/register", async(req,res)=>{
    const {first_name, last_name, email,age, password, rol} = req.body
    const emailToFind = email
    const exists = await users.findEmail({ email: emailToFind })
    if(exists) return res.status(400).send({status:"error", error: "Usuario ya existe"})
    const newUser = {
        first_name,
        last_name,
        email,
        age,
        password,
        rol
    };
    users.addUser(newUser)
    const token = generateAndSetToken(res, email, password) 
    res.send({token}) 
})
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: app.get('views') });
});
app.get('/register', (req, res) => {
    res.sendFile('register.html', { root: app.get('views') });
});
app.get('/current',passportCall('jwt', { session: false }), authorization('user'),(req,res) =>{
    authorization('user')(req, res,async() => {      
        const prodAll = await products.get();
        res.render('home', { products: prodAll });
    });
})
app.get('/admin',passportCall('jwt'), authorization('user'),(req,res) =>{
    authorization('user')(req, res,async() => {    
        const prodAll = await products.get();
        res.render('admin', { products: prodAll });
    });
})


export default app;


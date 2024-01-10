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
import __dirname, { authorization, passportCall, transport } from "./utils.js"
import { createHash, isValidPassword } from './utils.js'
import {
    generateAndSetToken, generateAndSetTokenEmail,
    validateTokenResetPass, getEmailFromToken, getEmailFromTokenLogin
} from "./jwt/token.js"
import UserDTO from './dao/DTOs/user.dto.js'
import compression from 'express-compression'
import { nanoid } from 'nanoid'
import session from "express-session";
import MongoStore from "connect-mongo";
import { Server } from "socket.io"
import { createServer } from "http";
import loggerMiddleware from "./loggerMiddleware.js";

//Configuración de .env
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = 8080;

const users = new UserMongo()
const products = new ProdMongo()

try {
    await mongoose.connect(config.mongo_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB');
} catch (error) {
    console.error('Error de conexión a MongoDB:', error.message);
}

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "Secret-key"
}

passport.use(
    new JwtStrategy(jwtOptions, (jwt_payload, done) => {
        const user = users.findJWT((user) => user.email === jwt_payload.email)
        if (!user) {
            return done(null, false, { message: "Usuario no encontrado" })
        }
        return done(null, user)
    })
)

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

// Iniciar el servidor después de todas las configuraciones
httpServer.listen(PORT, () => {
    console.log(`Servidor Express Puerto: ${PORT}`);
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
initializePassword()
app.use(passport.initialize())
app.use(compression());
app.use(cookieParser());
app.use(loggerMiddleware);

// Rutas para manejar productos, carritos y sesiones de usuario
app.use("/carts", cartsRouter);
app.use("/products", productsRouter);
app.use("/users", usersRouter);
app.use("/tickets", ticketsRouter);

//Handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

//static
app.use(express.static(__dirname + "/public"));


io.on("connection", (socket) => {
    console.log(`Cliente conectado`)

    socket.emit('conexion-establecida', 'Conexión exitosa con el servidor de Socket');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });


    socket.on("newProd", (newProduct) => {
        let validUserPremium = users.getUserRoleByEmail(newProduct.owner)
        if (validUserPremium == 'premium') {
            products.addProduct(newProduct)
            io.emit("success", "Producto Agregado Correctamente");
        } else {
            io.emit("errorUserPremium", "Producto no fue agregado porque owner no es usuario premium");
        }

    });
    socket.on("updProd", ({ id, newProduct }) => {
        products.updateProduct(id, newProduct)
        io.emit("success", "Producto Actualizado Correctamente");
    });
    socket.on("delProd", (id) => {
        products.deleteProduct(id)
        io.emit("success", "Producto Eliminado Correctamente");
    });

    socket.on("delProdPremium", ({ id, owner, email }) => {
        console.log(owner)
        console.log(email)
        if (owner == email) {
            products.deleteProduct(id)
            io.emit("success", "Producto Eliminado Correctamente");
        } else {
            io.emit("errorDelPremium", "Error al eliminar el producto porque no pertenece a usuario Premium");
        }
    });
    socket.on("notMatchPass", () => {
        ior.emit("warning", "Las contraseñas son distintas, reintente");
    });

    socket.on("validActualPass", async ({ password1, password2, email }) => {
        const emailToFind = email;
        const user = await users.findEmail({ email: emailToFind });
        const passActual = users.getPasswordByEmail(emailToFind)
        const validSamePass = isValidPassword(user, password1)

        if (validSamePass) {
            io.emit("samePass", "No se puede ingresar la última contraseña valida, reintente");
        } else {
            const hashedPassword = await createHash(password1);
            const updatePassword = await users.updatePassword(email, hashedPassword)
            if (updatePassword) {
                io.emit("passChange", "La contraseña fue cambiada correctamente");
            }
            else {
                io.emit("errorPassChange", "Error al cambiar la contraseña");
            }
        }
    });

    socket.on("newEmail", async ({ email, comment }) => {
        let result = await transport.sendMail({
            from: 'Chat Correo <asdribelb@gmail.com>',
            to: email,
            subject: 'Mensaje con Socket',
            html: `
        <div>
            <h1>${comment}</h1>
        </div>
        `,
            attachments: []
        })
        io.emit("success", "Correo enviado correctamente");
    });

    socket.emit("test", "mensaje desde servidor a cliente, se valida en consola de navegador")
});

//Vistas

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
    res.json({ token, user: userDTO, prodAll });
});

app.post("/api/register", async (req, res) => {
    const { first_name, last_name, email, age, password, rol } = req.body
    const emailToFind = email
    const exists = await users.findEmail({ email: emailToFind })
    if (exists) {
        req.logger.warn("Intento de registro con un correo electrónico ya existente: " + emailToFind);
        return res.send({ status: "error", error: "Usuario ya existe" });
    }

    const hashedPassword = await createHash(password);
    const newUser = {
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword,
        rol
    };

    try {
        users.addUser(newUser);
        const token = generateAndSetToken(res, email, password);
        res.send({ token });

        // Log de éxito
        req.logger.info("Registro exitoso para el usuario: " + emailToFind);
    } catch (error) {
        req.logger.error("Error al intentar registrar al usuario: " + error.message);
        console.error("Error al intentar registrar al usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
})

app.get('/', (req, res) => {
    req.logger.info("Se inicia página de Inicio de Login");
    res.sendFile('index.html', { root: app.get('views') });
});

app.get('/register', (req, res) => {
    req.logger.info("Se inicia página de Registro de Usuarios");
    res.sendFile('register.html', { root: app.get('views') });
});

app.get('/current', passportCall('jwt', { session: false }), authorization('user'), (req, res) => {
    req.logger.info("Se inicia página de Usuario");
    authorization('user')(req, res, async () => {
        const prodAll = await products.get();
        res.render('home', { products: prodAll });
    });
})

app.get('/admin', passportCall('jwt'), authorization('user'), (req, res) => {
    req.logger.info("Se inicia página de Administrador");
    authorization('user')(req, res, async () => {
        const prodAll = await products.get();
        res.render('admin', { products: prodAll });
    });
})

//Cambio de Password

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const emailToFind = email;
    const userExists = await users.findEmail({ email: emailToFind });
    if (!userExists) {
        req.logger.error("Error al reestablecer contraseña usuario " + email + " no existe")
        console.error("Error al reestablecer contraseña usuario " + email + " no existe")
        res.json("Error al reestablecer contraseña usuario " + email + " no existe");
        return res.status(401).json({ message: "Error al reestablecer contraseña" });
    }
    // Crear y firmar el token JWT con una expiración de 1 hora
    const token = generateAndSetTokenEmail(email)

    // Configurar el enlace de restablecimiento de contraseña
    const resetLink = `http://localhost:8080/reset-password?token=${token}`;

    let result = transport.sendMail({
        from: '<asdribelb@gmail.com>',
        to: email,
        subject: 'Restablecer contraseña',
        html: `Haz clic en el siguiente enlace para restablecer tu contraseña: <a href="${resetLink}">Restablecer contraseña</a>`,
        attachments: []
    })
    if (result) {
        req.logger.info("Se envia correo para reestablecer contraseña a correo" + emailToFind);
        res.json("Correo para reestablecer contraseña fue enviado correctamente a " + email);
    }
    else {
        req.logger.error("Error al enviar correo para reestablecer contraseña");
        console.error("Error al intentar reestablecer contraseña");
        res.json("Error al intentar reestablecer contraseña");
    }
});
app.get('/reset-password', async (req, res) => {
    const { token } = req.query;
    const validate = validateTokenResetPass(token)
    const emailToken = getEmailFromToken(token)
    if (validate) {
        res.render('resetPassword', { token, email: emailToken });
    }
    else {
        res.sendFile('index.html', { root: app.get('views') });
    }
});

//Mocking

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
app.get("/mockingproducts", async (req, res) => {

    const products = [];

    for (let i = 0; i < 50; i++) {
        const product = {
            id: nanoid(),
            description: `Product ${i + 1}`,
            image: 'https://apple.com/image.jpg',
            price: getRandomNumber(1, 1000),
            stock: getRandomNumber(1, 100),
            category: `Category ${i % 5 + 1}`,
            availability: 'in_stock'
        };

        products.push(product);
    }

    res.send(products);
})

export default app;

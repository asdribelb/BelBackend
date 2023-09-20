import express from "express";
import { createServer } from "http";
import ProductRo from "./router/product.routes.js";
import CartRouter from "./router/carts.routes.js";
import { engine } from "express-handlebars";
import * as path from "path"
import __dirname from "./utils.js";
import ProductManager from "./controllers/ProductManager.js";
import handlebars from "express-handlebars"
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = 8080;

httpServer.listen(PORT, () => {
    console.log(`Servidor Express Puerto: ${PORT}`);
});

const product = new ProductManager();


//Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars")
app.use(express.static(__dirname + "/public"));
app.use("/", viewsRouter);

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado")
    socket.on("mensaje", (data) => {
        console.log(data);
    })
})

app.get("/", async (req, res) => {
    let allProducts = await product.getProducts()
    res.render("home", {
        title: "Express Avanzado | Handlebars",
        products: allProducts
    })
})

app.get("/:id", async (req, res) => {
    let prod = await product.getProductsById(req.params.id)
    res.render("prod", {
        title: "Express Avanzado | Handlebars",
        products: prod
    })
})

app.use("/api/products", ProductRo)
app.use("/api/cart", CartRouter)




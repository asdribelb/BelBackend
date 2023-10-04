import express from "express";
import { createServer } from "http";
import ProductRo from "./router/product.routes.js";
import CartRouter from "./router/carts.routes.js";
import { engine } from "express-handlebars";
import * as path from "path"
import __dirname from "./utils.js";
import ProductManager from "./controllers/ProductManager.js";
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

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//Handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

app.use("/", viewsRouter)

//static
app.use(express.static(__dirname + "/public"));

app.get("/realtimeproducts", (req, res)=> {
    res.render("realTimeProducts")
})


io.on("connection", (socket) => {
    console.log(`Usuario ${socket.id}`)

    socket.on("newProd", (newProduct) => {
        product.addProducts(newProduct)
        io.emit("success", "Producto Agregado Correctamente");
    });
})


app.get("/", async (req, res) => {
    let allProducts = await product.getProducts()
    res.render("home", {
        title: "Express Avanzado / Handlebars",
        products: allProducts
    })
})

app.get("/:id", async (req, res) => {
    let id = parseInt(req.params.id)
    let prod = await product.getProductsById(id)
    res.render("prod", {
        title: "Express Avanzado / Handlebars",
        products: prod
    })
})

app.use("/api/products", ProductRo)
app.use("/api/cart", CartRouter)




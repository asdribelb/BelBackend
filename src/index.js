import express from "express";
import ProductRo from "./router/product.routes.js";
import CartRouter from "./router/carts.routes.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/products", ProductRo)
app.use("/api/cart", CartRouter)

app.listen(PORT, () => {
    console.log(`Servidor Express Puerto ${PORT}`);
});

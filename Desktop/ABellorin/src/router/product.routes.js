import {Router} from "express"
import ProductManager from "../controllers/ProductManager.js";

const ProductRo = Router()
const product = new ProductManager();



ProductRo.get("/", async (req, res) => {
    res.send(await product.getProducts())
});

ProductRo.get("/:id", async (req, res) => {
    let id = req.params.id
    res.send(await product.getProductsById(id))
});

ProductRo.post("/", async (req, res) => {
    let newProduct = req.body
    res.send(await product.addProducts(newProduct))
});

ProductRo.put("/:id", async (req,res) => {
    let id = req.params.id
let updateProducts = req.body;
res.send(await product.updateProducts(id, updateProducts))

});

ProductRo.delete("/:id", async (req,res) => {
    let id = req.params.id
    res.send(await product.deleteProducts(id))
});

export default ProductRo
import { Router } from "express";
import ProductDTO from "../dao/DTOs/product.dto.js";
import { productService } from "../repositories/index.js";
import Products from "../dao/mongo/products.mongo.js"

const router = Router()

const productMongo = new Products()

router.get("/", async (req, res) => {
    let result = await productMongo.get()
    res.send({ status: "success", payload: result })
})

router.post("/", async (req, res) => {
    let { description, image, price, stock, category, availability } = req.body
    let prod = new ProductDTO({ description, image, price, stock, category, availability })
    let result = await productService.createProduct(prod)
})

export default Router

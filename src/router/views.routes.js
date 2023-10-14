import { Router } from "express"
import ProductManager from "../controllers/ProductManager.js"
import CartManager from "../controllers/CartManager.js"

const prodRouter = Router()
const product = new ProductManager()
const cart = new CartManager() 
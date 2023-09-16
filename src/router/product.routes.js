import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";
import ValidationError from "./ValidationError.js"

const ProductRo = Router();
const product = new ProductManager();

ProductRo.get("/", async (req, res) => {
  try {
    const products = await product.getProducts();
    res.status(200).send(products);
  } catch (error) {
    // Maneja el error y devuelve un código de estado HTTP 500.
    res.status(500).send("Error interno del servidor");
  }
});

ProductRo.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const productById = await product.getProductsById(id);
    if (!productById) {
      // Si el producto no se encontró, devuelve un código de estado 404.
      res.status(404).send("Producto no encontrado2");
    } else {
      res.status(200).send(productById);
    }
  } catch (error) {
    // Maneja el error y devuelve un código de estado HTTP 500.
    res.status(500).send("Error interno del servidor");
  }
});

ProductRo.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    const result = await product.addProducts(newProduct);
    res.status(200).send(result);
  } catch (error) {
    // Maneja el error y devuelve un código de estado HTTP 400 o 500 según corresponda.
    if (error instanceof ValidationError) {
        console.error("Error de validación:", error.message);
      res.status(400).send("Error de validación");
    } else {
        console.error("Error interno del servidor:", error.message);
      res.status(500).send("Error interno del servidor");
    }
  }
});

ProductRo.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateProducts = req.body;
    const result = await product.updateProducts(id, updateProducts);
    res.status(200).send(result);
  } catch (error) {
    // Maneja el error y devuelve un código de estado HTTP 500.
    res.status(500).send("Error interno del servidor");
  }
});

ProductRo.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await product.deleteProducts(id);
    res.status(200).send(result);
  } catch (error) {
    // Maneja el error y devuelve un código de estado HTTP 500.
    res.status(500).send("Error interno del servidor");
  }
});

export default ProductRo;

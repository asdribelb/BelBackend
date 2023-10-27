import { Router } from "express"
import CartManager from "../controllers/CartManager.js"
import { cartsModel } from "../models/carts.model.js";

const cartRouter = Router()
const carts = new CartManager()

// Obtener todos los carritos 
cartRouter.get("/", async (req, res) => {
    try {
      const carts = await cartsModel.find();
      res.json({ result: "success", payload: carts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ result: "error", error: "Error al obtener carritos" });
    }
  });
  
  // Crear un nuevo carrito
  cartRouter.post("/", async (req, res) => {
    const { description, quantity, total } = req.body;
    if (!description || !quantity || !total) {
      res.status(400).json({ result: "error", error: "Faltan parámetros en el cuerpo" });
    } else {
      const result = await cartsModel.create({ description, quantity, total });
      res.status(201).json({ result: "success", payload: result });
    }
  });
  
  // Actualizar un carrito por su ID
  cartRouter.put("/:id_cart", async (req, res) => {
    const { id_cart } = req.params;
    const cartsToReplace = req.body;
    if (!cartsToReplace.description || !cartsToReplace.quantity || !cartsToReplace.total) {
      res.status(400).json({ result: "error", error: "Faltan parámetros en el cuerpo" });
    } else {
      const result = await cartsModel.updateOne({ _id: id_cart }, cartsToReplace);
      res.json({ result: "success", payload: result });
    }
  });
  
  // Eliminar un carrito por su ID
  cartRouter.delete("/:id_cart", async (req, res) => {
    const { id_cart } = req.params;
    const result = await cartsModel.deleteOne({ _id: id_cart });
    res.json({ result: "success", payload: result });
  });
  
  // Rutas relacionadas con productos en carritos
  
  // Agregar un producto a un carrito específico
  cartRouter.post("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const result = await carts.addProductInCart(cartId, prodId);
    res.json(result);
  });
  
  // Eliminar un producto de un carrito específico
  cartRouter.delete("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const result = await carts.removeProductFromCart(cartId, prodId);
    res.json(result);
  });
  
  // Actualizar un producto en un carrito específico
  cartRouter.put("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const newProduct = req.body;
    const result = await carts.updateProductInCart(cartId, prodId, newProduct);
    res.json(result);
  });
  
  // Eliminar todos los productos de un carrito específico
  cartRouter.delete("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const result = await carts.removeAllProductsFromCart(cartId);
    res.json(result);
  });
  
  // Ruta para obtener detalles del carrito con productos
  cartRouter.get("/population/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const result = await carts.getCartWithProducts(cartId);
    res.json(result);
  });

export default cartRouter



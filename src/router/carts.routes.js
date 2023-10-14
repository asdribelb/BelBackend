import { Router } from "express";
import CartManager from "../controllers/CartManager.js";

const CartRouter = Router();
const carts = new CartManager();

CartRouter.post("/", async (req, res) => {
    try {
      const result = await carts.addCarts();
      res.status(200).json({ message: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  CartRouter.get('/', async (req, res) => {
    try {
      const cartList = await carts.readCarts();
      res.status(200).json(cartList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  CartRouter.get('/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const cartsById = await carts.getCartsById(id);
      if (cartsById === "Carrito No Encontrado") {
        res.status(404).json({ error: "Carrito No Encontrado" });
      } else {
        res.status(200).json(cartsById);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  CartRouter.post('/:carid/products/:pid', async (req, res) => {
    try {
      const cartId = req.params.carid;
      const productId = req.params.pid;
      const result = await carts.addProductInCart(cartId, productId);
      if (result === "Carrito No Encontrado" || result === "Producto No Encontrado") {
        res.status(404).json({ error: result });
      } else {
        res.status(200).json({ message: result });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  export default CartRouter;

  

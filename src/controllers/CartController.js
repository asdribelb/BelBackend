
import express from "express";
import CartManager from "../controllers/CartManager.js";

const router = express.Router();
const cartManager = new CartManager();

router.post("/add", async (req, res) => {
  try {
    // Lógica para agregar un carrito...
    const result = await cartManager.addCarts();
    res.status(200).json({ status: "success", message: result });
  } catch (error) {
    console.error("Error al agregar el carrito:", error);
    res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
});


export default router;
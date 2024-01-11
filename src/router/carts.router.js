import { Router } from "express"
import CartDTO from "../dao/DTOs/cart.dto.js";
import TicketDTO from "../dao/DTOs/ticket.dto.js";
import { ticketService, cartService } from "../repositories/index.js";
import Carts from "../dao/mongo/carts.mongo.js";

const router = Router()
const cartMongo = new Carts()

router.get("/", async (req, res) => {
  let result = await cartMongo.get()
  res.send({ status: "success", payload: result })
})

router.post("/", async (req, res) => {
  let { products } = req.body
    const correo = req.body.correo;
    let rolUser = userService.getRolUser(products.owner)
    if(rolUser == 'premium' && correo == products.owner)
    {
        console.log("Un usuario premium NO puede agregar a su carrito un producto que le pertenece")
    }else{
        let cart = new CartDTO({ products })
        let result = await cartService.createCart(cart)
    }
    
    if(result){
        req.logger.info('Se crea carrito correctamente correctamente');
    }else{
        req.logger.error("Error al crear carritos");
    }
})

router.post("/:cid/purchase", async (req, res) => {
  try {
      let id_cart = req.params.cid;
  
      const productos = req.body.productos;
      const correo = req.body.correo;
      console.log(correo)
      let cart = cartService.validateCart(id_cart)
      if (!cart) {
          return { error: "No se encontró el carrito con el ID proporcionado" };
      }
      let validaStock = cartService.validateStock({productos})

      if (validaStock) {
          let totalAmount = await cartService.getAmount({productos})
          const ticketFormat = new TicketDTO({amount:totalAmount, purchaser:correo});
          const result = await ticketService.createTicket(ticketFormat);
      } else {
          console.log("No hay suficiente stock para realizar la compra");
      }
  } catch (error) {
      console.error("Error al procesar la compra:", error);
      return res.status(500).json({ error: "Error interno al procesar la compra" });
  }
})

export default router



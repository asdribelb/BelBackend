import { Router } from "express";
import TicketDTO from "../dao/DTOs/ticket.dto.js";
import { ticketService } from "../repositories/index.js";
import Tickets from "../dao/mongo/tickets.mongo.js"

const router = Router()

const ticketMongo = new Tickets()

router.get("/", async (req, res) => {
    req.logger.info('Se cargan tickets');
    let result = await ticketMongo.get()
    res.send({ status: "success", payload: result })
})

router.post("/", async (req, res) => {
    let { amount, purchaser } = req.body
    let tick = new TicketDTO({ amount, purchaser })
    let result = await ticketService.createTicket(tick)
    if(result){
        req.logger.info('Se crea ticket correctamente');
    }else{
        req.logger.error("Error al crear ticket");
    }
})

export default Router;
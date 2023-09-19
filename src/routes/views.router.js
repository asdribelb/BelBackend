import express from "express";

const router = express.Router();

router.get('/realTimeProducts', (req,res) => {
    res.render("realTimeProducts"); 
})

export default router;
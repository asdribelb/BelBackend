import { Router } from 'express' 
import { productsModel } from '../models/products.model.js'

const router = Router();


router.get('/', async (req, res) => { 
    try {
        let products = await productsModel.find();
        res.send({ result: "success", payload: products });
    } catch (error) {
        console.log(error);
    }
});

router.post('/', async (req, res) => {
    let { description, price, category } = req.body;
    if (!description || !price || !category ) {
        res.send({ status: "error", error: "Missing body params" });
    }
    let result = await productsModel.create({ description, price, category });
    res.send({ result: "success", payload: result });
});

router.put('/:id_prod', async (req, res) => {
    let { id_prod } = req.params;

    let productsToReplace = req.body;
    if (!productsToReplace.description || !productsToReplace.price || !productsToReplace.category) {
        res.send({ status: "error", error: "Missing body params" });
    }
    let result = await productsModel.updateOne({ _id: id_prod }, productsToReplace);
    res.send({ result: "success", payload: result });
});


router.delete('/:id_prod', async (req, res) => {
    let { id_prod } = req.params;
    let result = await productsModel.deleteOne({ _id: id_prod });
    res.send({ result: "success", payload: result });
});

export default router

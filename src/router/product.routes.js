import { Router } from "express"
import mongoose from "mongoose"
import ProductManager from "../controllers/ProductManager.js"
import { productsModel } from "../models/products.model.js";

const prodRouter = Router()
const product = new ProductManager()

// Actualizar un producto mediante una solicitud PUT
prodRouter.put("/:id", async (req, res) => {
    const id = req.params.id;
    const updProd = req.body;
    const result = await product.updateProduct(id, updProd);
    res.send(result);
});


// Obtener detalles de un producto por su ID mediante una solicitud GET
prodRouter.get("/:id", async (req, res) => {
    try {
        const prodId = req.params.id;
        const productDetails = await product.getProductById(prodId);
        res.render("viewDetails", { product: productDetails });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});


// Listar todos los productos mediante una solicitud GET
prodRouter.get("/", async (req, res) => {
    try {
        const products = await productsModel.find();
        res.json({ result: "success", payload: products });
    } catch (error) {
        console.error('Error al listar los productos:', error);
        res.status(500).json({ error: 'Error al listar los productos' });
    }
});


// Ingresar un producto mediante una solicitud POST
prodRouter.post("/", async (req, res) => {
    if (!req.body) {
        res.status(400).json({ status: "error", error: "Los datos no se enviaron en la solicitud" });
    } else {
        const { description, price, stock, category, availability } = req.body;

        if (!description || !price || !stock || !category || !availability) {
            res.status(400).json({ status: "error", error: "Faltan datos" });
        } else {
            const newProduct = { description, price, stock, category, availability };
            const result = await productsModel.create(newProduct);
            res.status(201).json({ result: "success", payload: result });
        }
    }
});


// Listar productos con límite mediante una solicitud GET
prodRouter.get("/limit/:limit", async (req, res) => {
    const limit = parseInt(req.params.limit) || 10;
    const result = await product.getProductsByLimit(limit);
    res.json(result);
});



// Listar productos por página mediante una solicitud GET
prodRouter.get("/page/:page", async (req, res) => {
    const page = parseInt(req.params.page) || 1;
    const productsPerPage = 1;
    const result = await product.getProductsByPage(page, productsPerPage);
    res.json(result);
});


// Listar productos por búsqueda mediante una solicitud GET
prodRouter.get("/buscar/query", async (req, res) => {
    const query = req.query.q;
    const result = await product.getProductsByQuery(query);
    res.json(result);
});

// Listar productos por orden ascendente o descendente mediante una solicitud GET
prodRouter.get("/ordenar/sort", async (req, res) => {
    const sortOrder = req.query.sort === "desc" ? -1 : 1;
    const result = await product.getProductsBySort(sortOrder);
    res.json(result);
});


prodRouter.get("/", async (req, res) => {
    let sortOrder = req.query.sortOrder; 
    let category = req.query.category; 
    let availability = req.query.availability; 
    if(sortOrder === undefined){
        sortOrder = "asc"
    }
    if(category === undefined){
        category = ""
    }
    if(availability === undefined){
        availability = ""
    }
    res.send(await product.getProductsMaster(null,null,category,availability, sortOrder))
})


// Eliminar un producto por su ID mediante una solicitud DELETE
prodRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const result = await product.delProducts(id);
    res.json(result);
});

// Agregar un producto mediante una solicitud POST
prodRouter.post("/add", async (req, res) => {
    const newProduct = req.body;
    const result = await product.addProduct(newProduct);
    res.status(201).json(result);
});


export default prodRouter

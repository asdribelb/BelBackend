import { Router } from "express"
import mongoose from "mongoose"
import ProductManager from "../controllers/ProductManager.js"

const prodRouter = Router()
const product = new ProductManager()

//Se actualizan los productos http://localhost:8080/api/products/ con put, se envian todos los datos sin el ID
prodRouter.put("/:id", async (req,res) => {
    let id = req.params.id
    let updProd = req.body
    res.send(await product.updateProduct(id, updProd))
})

//Se llaman todos productos por el id http://localhost:8080/api/products/idproducto con GET
prodRouter.get("/:id", async (req, res) => {
    try{
        const prodId = req.params.id;
        const productDetails = await product.getProductById(prodId);
        res.render("viewDetails", { product: productDetails });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    } 
});



//Se llaman todos productos con limit con http://localhost:8080/api/products/limit/numeroLimit con GET
prodRouter.get("/limit/:limit", async (req, res) => { 
    let limit = parseInt(req.params.limit)
    if (isNaN(limit) || limit <= 0) {
        limit = 10;
    }    
    res.send(await product.getProductsByLimit(limit))
})

//Se llaman todos los productos por page con http://localhost:8080/api/products/page/numeroPage con GET
prodRouter.get("/page/:page", async (req, res) => { 
    let page = parseInt(req.params.page)
    if (isNaN(page) || page <= 0) {
        page = 1;
    }
    const productsPerPage = 1;   
    res.send(await product.getProductsByPage(page, productsPerPage))
})

//Se llaman todos los productos por query con http://localhost:8080/api/products/buscar/query?q=nombreProducto con get
prodRouter.get("/buscar/query", async (req, res) => { 
    const query = req.query.q  
    res.send(await product.getProductsByQuery(query))
})

//Se llaman todos los productos por sort con http://localhost:8080/api/products/ordenar/sort?sort=desc y
//http://localhost:8080/api/products/ordenar/sort/sort?sort=asc  con GET en orden ascendente y descendente
prodRouter.get("/ordenar/sort", async (req, res) => { 
        let sortOrder = 0;
        if (req.query.sort) {
     
        if (req.query.sort === "desc") {
          sortOrder = -1; 
        }else if(req.query.sort === "asc"){
            sortOrder = 1; 
        }
      }
    res.send(await product.getProductsBySort(sortOrder))
})


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


//Se eliminan los productos por id http://localhost:8080/api/products/idproducto con DELETE
prodRouter.delete("/:id", async (req, res) => {
    let id = req.params.id
    res.send(await product.delProducts(id))
})

//Se agregan los productos generando un json
prodRouter.post("/", async (req, res) => {
    let newProduct = req.body
    res.send(await product.addProduct(newProduct))
})

export default prodRouter

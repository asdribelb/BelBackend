import { promises as fs } from "fs";


class ProductManager {
    constructor() {
        this.patch = "./productos.txt"
        this.products = []
    }

    static id = 0

    addProduct = async (title, description, price, image, code, stock) => {

        ProductManager.id++
        const nuevoArticulo = {
            title,
            description,
            price,
            image,
            code,
            stock,
            id: ProductManager.id
        };

        this.products.push(nuevoArticulo)

        await fs.writeFile(this.patch, JSON.stringify(this.products));
    };

    readProducts = async () => {
        let respuesta = await fs.readFile(this.patch, "utf-8")
        return JSON.parse(respuesta)
    };

    getProducts = async () => {
        let respuesta2 = await this.readProducts()
        return console.log(respuesta2)
    }

    getProductById = async (id) => {
        let respuesta3 = await this.readProducts()
        if (!respuesta3.find(product => product.id === id)) {
            console.log("Producto No Encontrado")
        } else {
            console.log(respuesta3.find(product => product.id === id))
        }
    };

    deleteProductsById = async (id) => {
        let respuesta3 = await this.readProducts()
        let productFilter = respuesta3.filter(products => products.id != id)

        console.log(productFilter)
        await fs.writeFile(this.patch, JSON.stringify(productFilter));
        console.log("Producto Eliminado")
    };

    updateProducts = async ({ id, ...producto }) => {
        await this.deleteProductsById(id);
        let producto1Id = await this.readProducts()
        let ProductsModificados = [{ ...producto, id }, ...producto1Id];
        await fs.writeFile(this.patch, JSON.stringify(ProductsModificados));
    };
}

const productos = new ProductManager();

productos.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen1", "abc123", 25);
productos.addProduct("producto prueba2", "Este es un producto prueba2", 300, "Sin imagen2", "abc124,26");
productos.addProduct("producto prueba3", "Este es un producto prueba3", 400, "Sin imagen3", "abc1245", 27);

//productos.getProducts()

//Busqueda de producto por ID
productos.getProductById(4);

//Eliminar Productos por ID
productos.deleteProductsById(2)

productos.updateProducts({
    title: 'producto prueba3',
    description: 'Este es un producto prueba3',
    price: 4500,
    code: 'abc1245',
    stock: 27,
    id: 3,
});
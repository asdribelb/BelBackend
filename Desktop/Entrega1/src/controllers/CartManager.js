import { promises as fs } from 'fs';
import { nanoid } from "nanoid";
import ProductManager from './ProductManager.js';

const productT = new ProductManager

class CartManager {
    constructor() {
        this.path = "./src/models/carts.json";
    }

    readCarts = async () => {
        let carts = await fs.readFile(this.path, "utf-8")
        return JSON.parse(carts);
    }

    writeCarts = async (carts) => {
        await fs.writeFile(this.path, JSON.stringify(carts));
    }

    existe = async (id) => {
        let Carts = await this.readCarts();
        return Carts.find(cart => cart.id === id)
    }

    addCarts = async () => {
        let cartsOld = await this.readCarts()
        let id = nanoid()
        let cartsConcat = [{ id: id, products: [] }, ...cartsOld]
        await this.writeCarts(cartsConcat)
        return "Carrito Agregado"
    }

    getCartsById = async (id) => {
        let cartsById = await this.existe(id)
        if (!cartsById) return "Carrito No Encontrado"
        return cartsById
    };

    addProductInCart = async (cartId, productId) => {
        let cartsById = await this.existe(cartId)
        if (!cartsById) return "Carrito No Encontrado"
        let productById = await productT.existe(productId)
        if (!cartsById) return "Producto No Encontrado"

        let cartsAll = await this.readCarts()
        let cartFilter = cartsAll.filter((cart) => cart.id != cartId);

        if (cartsById.products.some(prod => prod.id === productId)) {
            let moreProductInCart = cartsById.products.find(prod => prod.id === productId)
            moreProductInCart.cantidad++;
            console.log(moreProductInCart.cantidad);
            let cartsConcat = [cartById, ...cartFilter];
            await this.writeCarts(cartsConcat);
            return "El producto adicional se ha agregado al Carrito";
        }

        cartById.products.push({ id: productById.id, cantidad: 1 })
        let cartsConcat = [cartById, ...cartFilter]
        await this.writeCarts(cartsConcat);
        return "El producto se ha agregado al Carrito"
    }


}

export default CartManager
import fs from 'fs';
import path from 'path';

const cartsFilePath = path.join(__dirname, '../models/carts/carts.json');

class CartDao {
  static getAllCarts() {
    const cartsData = fs.readFileSync(cartsFilePath, 'utf-8');
    return JSON.parse(cartsData);
  }

  static getCartById(cartId) {
    const carts = this.getAllCarts();
    return carts.find(cart => cart.id === cartId);
  }

  static createCart(cart) {
    const carts = this.getAllCarts();
    const newCart = { id: generateCartId(), ...cart };
    carts.push(newCart);
    this.writeCartsToFile(carts);
    return newCart;
  }

  static updateCart(cartId, updatedCart) {
    const carts = this.getAllCarts();
    const index = carts.findIndex(cart => cart.id === cartId);
    if (index !== -1) {
      carts[index] = { ...carts[index], ...updatedCart };
      this.writeCartsToFile(carts);
      return carts[index];
    }
    return null; // Cart not found
  }

  static deleteCart(cartId) {
    const carts = this.getAllCarts();
    const filteredCarts = carts.filter(cart => cart.id !== cartId);
    if (filteredCarts.length < carts.length) {
      this.writeCartsToFile(filteredCarts);
      return true; // Deletion successful
    }
    return false; // Cart not found
  }

  static writeCartsToFile(carts) {
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2), 'utf-8');
  }
}

function generateCartId() {

  return Math.random().toString(36).substr(2, 9);
}

export default CartDao;
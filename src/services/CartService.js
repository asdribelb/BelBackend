import CartDao from '../DAO/CartDao';

class CartService {
  static getAllCarts() {
    return CartDao.getAllCarts();
  }

  static getCartById(cartId) {
    return CartDao.getCartById(cartId);
  }

  static createCart(cart) {
    return CartDao.createCart(cart);
  }

  static updateCart(cartId, updatedCart) {
    return CartDao.updateCart(cartId, updatedCart);
  }

  static deleteCart(cartId) {
    return CartDao.deleteCart(cartId);
  }
}

export default CartService;
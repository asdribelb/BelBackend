import ProductDao from '../DAO/ProductDao';

class ProductService {
  static getAllProducts() {
    return ProductDao.getAllProducts();
  }

  static getProductById(productId) {
    return ProductDao.getProductById(productId);
  }

  static createProduct(product) {
    return ProductDao.createProduct(product);
  }

  static updateProduct(productId, updatedProduct) {
    return ProductDao.updateProduct(productId, updatedProduct);
  }

  static deleteProduct(productId) {
    return ProductDao.deleteProduct(productId);
  }
}

export default ProductService;
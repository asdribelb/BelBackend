import ProductManager from '../controllers/ProductManager.js';

const productManager = new ProductManager();

const ProductController = {
  getAllProducts: async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
  },

  getProductById: async (req, res) => {
    const productId = req.params.id;
    const product = await productManager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  },

  createProduct: async (req, res) => {
    const productData = req.body;

    const result = await productManager.addProducts(productData);

    if (result === 'Producto Agregado') {
      res.status(201).json({ message: 'Producto agregado correctamente' });
    } else {
      res.status(500).json({ error: 'Error al agregar el producto' });
    }
  },

  updateProductById: async (req, res) => {
    const productId = req.params.id;
    const productData = req.body;

    const result = await productManager.updateProducts(productId, productData);

    if (result === 'Producto Actualizado') {
      res.json({ message: 'Producto actualizado correctamente' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  },

  deleteProductById: async (req, res) => {
    const productId = req.params.id;
    const result = await productManager.deleteProducts(productId);

    if (result === 'Producto eliminado') {
      res.json({ message: 'Producto eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  },
};

export default ProductController;
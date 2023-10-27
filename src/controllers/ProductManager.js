import {promises as fs} from 'fs'
import {nanoid} from "nanoid"
import { productsModel } from '../models/products.model.js'

class ProductManager extends productsModel
{
    constructor() {
        super();
    }
    
      // Agrega un nuevo producto
      async addProduct(productData) {
          try {
            await productsModel.create(productData);
            return 'Producto agregado';
          } catch (error) {
            console.error('Error al agregar el producto:', error);
            return 'Error al agregar el producto';
          }
        }
    
      async updateProduct(id, productData) {
        try {
          const product = await ProductManager.findById(id);
    
          if (!product) {
            return 'Producto no encontrado';
          }
    
          product.set(productData);
    
          await product.save();
          return 'Producto actualizado';
        } catch (error) {
          console.error('Error al actualizar el producto:', error);
          return 'Error al actualizar el producto';
        }
      }
    
      // Obtiene los productos
      async getProducts() {
        try {
          const products = await ProductManager.find({});
          return products;
        } catch (error) {
          console.error('Error al obtener los productos:', error);
          return [];
        }
      }
    
      // Obtiene un producto por ID
      async getProductById(id) 
      {
        try {
          const product = await ProductManager.findById(id).lean();
    
          if (!product) {
            return 'Producto no encontrado';
          }
    
          return product;
        } catch (error) {
          console.error('Error al obtener el producto:', error);
          return 'Error al obtener el producto';
        }
      }

      // Obtiene un producto por Limit
      async getProductsByLimit(limit) 
      {
        try {
          console.log(limit)
          const products = await ProductManager.find().limit(limit);
          if (products.length < limit) {
            limit = products.length;
          }
      
          return products;
        } catch (error) {
          throw error;
        }
      }
      // Obtiene un producto por Page
      async getProductsByPage(page, productsPerPage) 
      {
        if (page <= 0) {
          page = 1;
        }
        try {
          const products = await ProductManager.find()
            .skip((page - 1) * productsPerPage) 
            .limit(productsPerPage); 
      
          return products;
        } catch (error) {
          throw error;
        }
      }
      // Obtiene un producto por Query
      async getProductsByQuery(query) 
      {
        console.log(query)
        try {
          const products = await productsModel.find({
            description: { $regex: query, $options: 'i' }
          });
          console.log(products)
          return products;
        } catch (error) {
          throw error;
        }
      }

      async getProductsBySort(sortOrder) 
      {
        try {
          const products = await productsModel
          .find({})
          .sort({ price: sortOrder }); 
      
          return products;
        } catch (error) {
          throw error;
        }
      }



      //Busqueda con todo lo solicitado 
      async getProductsMaster(page = 1, limit = 10, category, availability, sortOrder) 
      {
        try
        {
          let filter = {};

          // Calcula el índice de inicio y fin para la paginación
          const startIndex = (page - 1) * limit;
          const endIndex = page * limit;

          const sortOptions = {};
          
          if (sortOrder === 'asc') {
            sortOptions.price = 1; 
          } else if (sortOrder === 'desc') {
            sortOptions.price = -1; 
          } else {
            throw new Error('El parámetro sortOrder debe ser "asc" o "desc".');
          }

          if (category != "") {
            filter.category = category;
          }
          if (availability != "") {
            filter.availability = availability;
          }

          const query = ProductManager.find(filter)
            .skip(startIndex)
            .limit(limit)
            .sort(sortOptions); ;
          const products = await query.exec();

        // Calcula el total de páginas y otros detalles de paginación
        const totalProducts = await ProductManager.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);
        const hasPrevPage = startIndex > 0;
        const hasNextPage = endIndex < totalProducts;
        const prevLink = hasPrevPage ? `/api/products?page=${page - 1}&limit=${limit}` : null;
        const nextLink = hasNextPage ? `/api/products?page=${page + 1}&limit=${limit}` : null;

    
        return {
          status: 'success',
          payload: products,
          totalPages: totalPages,
          prevPage: hasPrevPage ? page - 1 : null,
          nextPage: hasNextPage ? page + 1 : null,
          page: page,
          hasPrevPage: hasPrevPage,
          hasNextPage: hasNextPage,
          prevLink: prevLink,
          nextLink: nextLink,
        };
        } catch (error) {
          console.error('Error al obtener los productos:', error);
          return { status: 'error', payload: 'Error al obtener los productos' };
        }
      }
      
      // Elimina un producto por ID
      async deleteProduct(id) {
        try {
          const product = await ProductManager.findById(id);
    
          if (!product) {
            return 'Producto no encontrado';
          }
    
          await product.remove();
          return 'Producto eliminado';
        } catch (error) {
          console.error('Error al eliminar el producto:', error);
          return 'Error al eliminar el producto';
        }
      }
}
  
  export default ProductManager;

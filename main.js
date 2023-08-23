class ProductManager {
    constructor() {
        this.products = []
    }

    static id = 0

    addProduct(title, description, price, image, code, stock) {
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].code === code) {
                console.log(`El codigo ${code} esta repetido`);
                break;
            }
        }


        const nuevoArticulo = {
            title,
            description,
            price,
            image,
            code,
            stock
        }

        if (!Object.values(nuevoArticulo).includes(undefined)) {

            ProductManager.id++
            this.products.push({...nuevoArticulo, id:ProductManager.id,
            });
        }else{
            console.log("Todos los campos son obligatorios")
        }
    }

    getProduct() {
        return this.products;
    }

    existe(id) {
        return this.products.find((producto) => producto.id === id)
    }

    getProductById(id) {
        !this.existe(id) ? console.log("Not Found") : console.log(this.existe(id));
    }
}

const productos = new ProductManager
//Arreglo Vacio 1
console.log(productos.getProduct());

//Se agrega el producto
productos.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen1", "abc123", 25);
productos.addProduct("producto prueba2", "Este es un producto prueba2", 300, "Sin imagen2", "abc124");

//Arreglo con Producto 2
console.log(productos.getProduct());

//Validacion de Code Repetido
productos.addProduct("producto prueba2", "Este es un producto prueba2", 300, "Sin imagen2", "abc124", 27);

//Busqueda de producto por ID
productos.getProductById(2);

//Busqueda por ID no encontrado
productos.getProductById(4);
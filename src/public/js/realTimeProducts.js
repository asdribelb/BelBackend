const socket = io();
socket.emit("message", "Hola, me estoy comuncando desde un webSocket")

socket.on("productAdded", (product) => {
    // Crear un nuevo elemento HTML para el producto
    const newProductElement = document.createElement("div");
    newProductElement.innerHTML = `
            <h2>${product.name}</h2>
            <p>Precio: ${product.price}
            <p>Categoría: ${product.category}</p>
            <p>Descripción: ${product.description}</p>
    `;

       // Agregar el nuevo producto a la lista de productos
       const productsContainer = document.getElementById("productsContainer");
       productsContainer.appendChild(newProductElement);

   });

 







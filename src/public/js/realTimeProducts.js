const socket = io();

            document.getElementById('productForm').addEventListener('submit', (e) => {
                e.preventDefault();
                const nameInput = document.getElementById('producto');
                const name = nameInput.value;
                nameInput.value = '';

                const descriptionInput = document.getElementById('descripcion');
                const description = descriptionInput.value;
                descriptionInput.value = '';

                const priceInput = document.getElementById('precio');
                const price = priceInput.value;
                priceInput.value = '';

                const categoryInput = document.getElementById('categoria');
                const category = categoryInput.value;
                categoryInput.value = '';

                const newProduct = {
                    name: name,
                    description: description,
                    price: price,
                    category: category,
                };
                
                // Emitir un evento de WebSocket para enviar los datos del producto
                socket.emit("newProd", newProduct);
                
                // Agregar el nuevo producto a la lista de productos en tiempo real
                addToProductTable(newProduct);
            });

            socket.on("success", (data) => {
                Swal.fire({
                    icon: 'success',
                    name: data,
                    text: `Producto agregado a la lista`,
                    confirmButtonText: 'Aceptar',
                })
            });

        // Escuchar el evento "productAdded" y actualizar la tabla en tiempo real
        socket.on("productAdded", (product) => {
            addToProductTable(product);
        });

        function addToProductTable(product) {
            const productTable = document.getElementById('productTable');
            const newRow = productTable.insertRow();
            newRow.innerHTML = `
                <td>${product.name}</td>
                <td>${product.description}</td>
                <td>${product.price}</td>
                <td>${product.category}</td>
            `;
        }
           



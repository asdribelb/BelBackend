document.getElementById('file-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInputElement = document.getElementById('file');
    const file = fileInputElement.files[0]

    try {
        const formData = new FormData();
        formData.append('file', file); 

        const response = await fetch('/upload', {
            method: 'POST',
            body: formData, 
        });

        if (response.ok) {
            const responseData = await response.json();
            const successMessage = responseData.message;

            Swal.fire({
                icon: 'success',
                title: successMessage,
                text: `Imagen Cargada Correctamente`,
                confirmButtonText: 'Aceptar',
            });

            userInputElement.value = '';
            messageInputElement.value = '';
        } else {
            console.error('Error al enviar el mensaje');
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
});
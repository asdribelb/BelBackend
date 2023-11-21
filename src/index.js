import 'dotenv/config'
import app from './app.js';

// Inicia la aplicación
const PORT = 8080;
app.listen(PORT, () => console.log('Servidor conectado en puerto 8080'));
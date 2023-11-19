import 'dotenv/config'
import app from './app.js';

// Inicia la aplicación
const PORT = 8080;

app.listen(PORT, () => console.log('Listen puerto 8080'));
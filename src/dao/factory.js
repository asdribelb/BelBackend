import mongoose from "mongoose";
import config from '../config/config.js';

export let Carts = Object;
export let Products  = Object
export let Users  = Object;
export let Tickets  = Object;
switch (config.PERSISTENCE) {
    case "MONGO":
        try {
            const connection = await mongoose.connect(config.MONGO_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('Connected to MongoDB');
            // Devuelve la conexión para que pueda ser utilizada en otros lugares si es necesario
            Carts = connection.model('Carts', CartsMongoSchema);
            Products = connection.model('Products', ProductsMongoSchema);
            Users = connection.model('Users', UsersMongoSchema);
            Tickets = connection.model('Tickets', TicketsMongoSchema);
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            // Maneja el error de conexión de alguna manera apropiada
        }
        break;

    case "MEMORY":
        const { default: CartsMemory } = await import("./memory/carts.memory.js");
        const { default: ProductsMemory } = await import("./memory/products.memory.js");
        const { default: TicketsMemory } = await import("./memory/tickets.memory.js");
        const { default: UsersMemory } = await import("./memory/users.memory.js");
        Carts = CartsMemory;
        Products = ProductsMemory;
        Users = UsersMemory;
        Tickets = TicketsMemory;
        break;


    default:
        // Lógica para manejar otros casos si es necesario
        break;

}

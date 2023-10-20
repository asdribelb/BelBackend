import {promises as fs} from 'fs'
import {nanoid} from "nanoid"
import { usersModel } from '../models/users.model.js'

class UserManager extends usersModel {
    constructor() {
        super();
    }

    // Agrega un nuevo usuario
    async addUser(userData) {
        try {
            // Utiliza el modelo de usuarios para crear un nuevo usuario en la base de datos.
            await usersModel.create(userData);
            return 'Usuario agregado';
        } catch (error) {
            console.error('Error al agregar el usuario:', error);
            return 'Error al agregar el usuario';
        }
    }

    // Actualiza un usuario existente por ID
    async updateUser(id, userData) {
        try {
            // Busca el usuario por su ID
            const user = await UserManager.findById(id);

            if (!user) {
                return 'Usuario no encontrado';
            }

            // Actualiza los campos del usuario con los nuevos datos.
            user.set(userData);
            await user.save();
            return 'Usuario actualizado';
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            return 'Error al actualizar el usuario';
        }
    }

    // Obtiene todos los usuarios
    async getUsers() {
        try {
            // Obtiene la lista de todos los usuarios en la base de datos.
            const users = await UserManager.find({});
            return users;
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            return [];
        }
    }

    // Obtiene un usuario por su ID
    async getUserById(id) {
        try {
            // Busca un usuario por su ID y devuelve solo los datos en formato JSON.
            const user = await UserManager.findById(id).lean();

            if (!user) {
                return 'Usuario no encontrado';
            }
            return user;
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
            return 'Error al obtener el usuario';
        }
    }

    // Elimina un usuario por su ID
    async deleteUser(id) {
        try {
            // Busca un usuario por su ID y lo elimina de la base de datos.
            const user = await UserManager.findById(id);

            if (!user) {
                return 'Usuario no encontrado';
            }

            await user.remove();
            return 'Usuario eliminado';
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            return 'Error al eliminar el usuario';
        }
    }

    // Valida la existencia de un usuario por su email
    async validateUser(param) {
        try {
            // Busca un usuario por su dirección de correo electrónico (email).
            const user = await UserManager.findOne({ email: param });

            if (!user) {
                return 'Usuario no encontrado';
            }
            return user;
        } catch (error) {
            console.error('Error al validar usuario', error);
            return 'Error al obtener el usuario';
        }
    }
}

export default UserManager;

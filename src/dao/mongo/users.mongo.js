import usersModel from './models/users.model.js'

export default class Users {
    constructor() {

    }

    get = async () => {
        try
        {
            let users = await usersModel.find()
            return users
        }catch (error) {
            console.error('Error al obtener usuarios:', error);
            return 'Error obtener usuarios';
        }       
    }
    findEmail = async (param) => {
        try
        {
            const user = await usersModel.findOne(param)  
            return user
        }catch (error) {
            console.error('Error al buscar email:', error);
            return 'Error al buscar email de usuario';
        }   
        
    }
    addUser = async (userData) => {
        try
        {
            let userCreate = await usersModel.create(userData);
            return userCreate
        }catch(error){
            console.error('Error al crear usuario:', error);
            return 'Error al crear usuario';
        }      
    }
    findJWT = async (filterFunction) => {
        try
        {
            const user = await usersModel.find(filterFunction)
            return user
        }catch(error){
            console.error('Error al obtener filtro JWT:', error);
            return 'Error al obtener filtro JWT';
        }      
    }
}
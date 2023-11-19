import UserDao from '../DAO/UserDao';

class UserService {
  static getAllUsers() {
    return UserDao.getAllUsers();
  }

  static getUserById(userId) {
    return UserDao.getUserById(userId);
  }

  static createUser(user) {
    return UserDao.createUser(user);
  }

  static updateUser(userId, updatedUser) {
    return UserDao.updateUser(userId, updatedUser);
  }

  static deleteUser(userId) {
    return UserDao.deleteUser(userId);
  }
}

export default UserService;
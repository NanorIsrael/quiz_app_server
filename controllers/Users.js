const User = require('../models/user')

export class Users {
    constructor(email, firstname, lastname, password) {
        this.email = email,
        this.firstname = firstname,
        this.lastname = lastname
        this.password = password
    }

    getUser() {
        return {
            email: this.email,
            first_name: this.firstname,
            last_name: this.lastname,
            password: this.password
        }
    }

    addUser = async (user) => {
        return User.create(user)
    }

    getUserById(userId){
        return User.findById(userId)
    }
    
    updateUserById(userId){
        return User.findByIdAndUpdate(userId)
    }

    deleteUser(userId) {
        return User.findByIdAndDelete(userId)
    }

}


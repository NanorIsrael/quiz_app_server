const User = require('../models/user');
const bcrypt = require('bcrypt');

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

    async addUser(user) {
        return User.create(user)
    }

    async getUserById(userId) {
        return User.findById(userId)
    }
    
    async getUserByEmail(email) {
        return User.findOne({email});
    }
    
    async updateUserById(userId) {
        return User.findByIdAndUpdate(userId)
    }

    async deleteUser(userId) {
        return User.findByIdAndDelete(userId)
    }

    async login(email, password) {
        const user = await this.getUserByEmail(email);
        if (!user) {
            throw new Error("User does not exist");
        }

        // console.log(user.password);
        // console.log(password);

        // Hash the password using bcrypt
        try {
            // Compare the password using bcrypt
            const isMatch = await bcrypt.compare(password, user.password);
            return true;
            
            // Now you can proceed with other login logic here
        } catch (err) {
            // Handle any error that might occur during password comparison
            throw new Error(`Oops! An error occurred while trying to compare the passwords: ${err.message}`);
        }
        return false;
    }
}


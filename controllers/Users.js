const User = require("../models/user");
const Auth = require("../models/auth");
const bcrypt = require("bcrypt");
const { generateAuthTokens } = require("./../services/tokenService");

class UserDataSource {
  constructor(
    email = null,
    username = null,
    password = null,
  ) {
    (this.email = email),
      (this.username = username),
    this.password = password;
  }

  getUser() {
    return {
      email: this.email,
      username: this.username,
      password: this.password,
    };
  }

  async addUser(user) {
    try {
      const ensureUserExits = await this.getUserByEmail(user.email);
      if (ensureUserExits) {
        return {
          errors: {
            error: "email already taken, try login with your password.",
          },
        };
      }
      
      return await User.create(user);
    } catch (error) {
      return {
        errors: {
          error: error.message,
        },
      };
    }
  }

  async getUserById(userId) {
    return User.findById(userId);
  }

  async getUserByEmail(email) {
    return User.findOne({ email });
  }

  async updateUserById(userId) {
    return User.findByIdAndUpdate(userId);
  }

  async deleteUser(userId) {
    return User.findByIdAndDelete(userId);
  }

  async login(email, password) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      return {
        errors: {
          email: "email does not exist",
        },
      };
    }

    // Hash the password using bcrypt
    try {
      // Compare the password using bcrypt
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const tokens = await generateAuthTokens(user._id);
        return tokens;
      }

      // Now you can proceed with other login logic here
    } catch (err) {
      // Handle any error that might occur during password comparison
      throw new Error(
        `Oops! An error occurred while trying to compare the passwords: ${err.message}`,
      );
    }
    return {
      errors: {
        password: "email and password does not match",
      },
    };
  }

  async logout(userId) {
    return await Auth.deleteMany({ userId });
  }
}

module.exports = UserDataSource;

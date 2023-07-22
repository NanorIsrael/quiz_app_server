const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Pre middleware to hash the password before saving the user
userSchema.pre("save", async function (next) {
  const user = this;

  // Check if the password is modified or it's a new user
  if (!user.isModified("password")) {
    return next();
  }
  const hashedPassword = await bcrypt.hash(
    user.password,
    Number(process.env.BCRYPT_ITERATIONS_COST),
  );
  if (hashedPassword) {
    user.password = hashedPassword;
  }
  next();
});

const Users = mongoose.model("Users", userSchema);
module.exports = Users;

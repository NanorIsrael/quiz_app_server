const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuthSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    expires: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  },
);
const Auth = mongoose.model("Auth", AuthSchema);
module.exports = Auth;

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" }
  },
  { collection: "Users" } // 👈 Force collection name to be "Users"
);

module.exports = mongoose.model("User", UserSchema);

// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     address: { type: String, required: true },
//     phone: { type: String, required: true },
//     role: { type: String, enum: ["customer", "admin"], default: "customer" }
//   },
//   { collection: "Users" } // 👈 Force collection name to be "Users"
// );

// module.exports = mongoose.model("User", UserSchema);

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true ,unique: true  }, // keep as-is
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    
    // New optional fields

    firstname: { type: String },
    lastname: { type: String },
    address: { type: String,  },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    pincode: { type: String }
  },
  { collection: "Users" }
);

module.exports = mongoose.model("User", UserSchema);



// const mongoose = require("mongoose");

// const AddressSchema = new mongoose.Schema({
//   orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
//   addressLine1: { type: String, required: true },
//   addressLine2: { type: String },
//   city: { type: String, required: true },
//   state: { type: String, required: true },
//   postalCode: { type: String, required: true },
//   country: { type: String, required: true },
// },
// { collection: "Address" } // 👈 Force collection name to be "Address"
// );

// module.exports = mongoose.model("Address", AddressSchema);


const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
}, 
{ collection: "Address" });

module.exports = mongoose.model("Address", AddressSchema);

// const mongoose = require("mongoose");

// const contactUsSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//       trim: true,
//       minlength: [3, "Name must be at least 3 characters long"],
//       maxlength: [50, "Name cannot exceed 50 characters"],
//     },
//     emailId: {
//       type: String,
//       required: [true, "Email ID is required"],
//       lowercase: true, // Converts email to lowercase before saving
//       trim: true,
//       match: [
//         /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
//         "Please enter a valid email address",
//       ],
//     },
//     message: {
//       type: String,
//       required: [true, "Message is required"],
//       trim: true,
//       minlength: [10, "Message must be at least 10 characters long"],
//       maxlength: [500, "Message cannot exceed 500 characters"],
//     },
//   },
//   { timestamps: true }
// );

// const ContactUs = mongoose.model("ContactUs", contactUsSchema);

// module.exports = ContactUs;

const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    emailId: {
      type: String,
      required: [true, "Email ID is required"],
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        "Please enter a valid email address",
      ],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters long"],
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    action: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const ContactUs = mongoose.model("ContactUs", contactUsSchema);

module.exports = ContactUs;

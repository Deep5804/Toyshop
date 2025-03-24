const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema(
  {
    emailId: {
      type: String,
      required: [true, "Email ID is required"],
      unique: true, // Ensure unique email subscription
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        "Please enter a valid email address",
      ],
    },
  },
  { timestamps: true }
);

const Newsletter = mongoose.model("Newsletter", newsletterSchema);

module.exports = Newsletter;

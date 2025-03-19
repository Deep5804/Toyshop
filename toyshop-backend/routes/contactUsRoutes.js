const express = require("express");
const ContactUs = require("../models/ContactUs");

const router = express.Router();

// ✅ Submit a new contact form message
router.post("/", async (req, res) => {
  try {
    const { name, emailId, message } = req.body;

    // ✅ Check if all fields are provided
    if (!name || !emailId || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ Create and save the contact message (allows multiple messages per email)
    const newMessage = new ContactUs({ name, emailId, message });

    await newMessage.save();
    res.status(201).json({ message: "Message submitted successfully", contact: newMessage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all contact messages (Admin use)
router.get("/", async (req, res) => {
  try {
    const messages = await ContactUs.find().sort({ createdAt: -1 });

    if (messages.length === 0) {
      return res.status(404).json({ message: "No messages found." });
    }

    res.status(200).json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

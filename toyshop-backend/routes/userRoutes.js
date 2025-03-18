const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs"); //for password hashing

const router = express.Router();

// Create User (Signup)
router.post("/", async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, address, phone });
    await newUser.save();
    res.status(201).json({ message: "User created successfully", userId: newUser._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

  
// Get All Users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single User by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user by ID
router.put("/:id", async (req, res) => {
    try {
      const { name, email, address, phone, role } = req.body;
  
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { name, email, address, phone, role },
        { new: true } // Return the updated document
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.json({ message: "User updated successfully", updatedUser });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// Delete User
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Login User
// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Send user data to frontend (excluding password for security)
    res.json({
      message: `Welcome, ${user.name}!`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
      },
    });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;

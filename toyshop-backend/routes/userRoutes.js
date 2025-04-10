// const express = require("express");
// const User = require("../models/User"); // Assuming you have a User model
// const bcrypt = require("bcryptjs"); // For password hashing
// const jwt = require("jsonwebtoken"); // For JWT authentication
// const router = express.Router();

// // Secret key for JWT (should be stored in .env for production)
// const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

// // Middleware to verify JWT token
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   console.log("Auth Header:", authHeader);

//   const token = authHeader && authHeader.split(" ")[1];
//   console.log("Extracted Token:", token);

//   if (!token) {
//     console.log("No token provided");
//     return res.status(401).json({ error: "Access denied, no token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, SECRET_KEY);
//     console.log("Decoded Token:", decoded);
//     req.user = decoded; // Ensure this is set correctly
//     next();
//   } catch (error) {
//     console.log("Token verification failed:", error.message);
//     return res.status(403).json({ error: "Invalid or expired token" });
//   }
// };


// // Create User (Signup)
// router.post("/", async (req, res) => {
//   try {
//     const { name, email, password, address, phone } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "Email already exists" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       address,
//       phone,
//     });
//     await newUser.save();

//     res.status(201).json({
//       message: "User created successfully",
//       userId: newUser._id,
//     });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Login User
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ error: "User not found" });
//     }

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ error: "Invalid password" });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user._id, email: user.email, name: user.name },
//       SECRET_KEY,
//       { expiresIn: "1h" } // Token expires in 1 hour
//     );

//     // Send response with token and user data (excluding password)
//     res.json({
//       message: `Welcome, ${user.name}!`,
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         address: user.address,
//         phone: user.phone,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // Get All Users (Optional, typically for admin use - protect if needed)
// router.get("/", async (req, res) => {
//   try {
//     const users = await User.find().select("-password"); // Exclude passwords
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get Single User by ID (Protected route)
// router.get("/add/:id", authenticateToken, async (req, res) => {
//   try {
//     // Ensure the user can only access their own data
//     if (req.user.id !== req.params.id) {
//       console.log("hello9876")
//       return res.status(403).json({ error: "Unauthorized access" });
//     }

//     const user = await User.findById(req.params.id).select("-password");
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get User Profile (Protected route using token)
// router.get("/profile", authenticateToken, async (req, res) => {
//   console.log("hello1234")
//   console.log("Profile route accessed - User:", req.user);
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) {
//       console.log("User not found for ID:", req.user.id);
//       return res.status(404).json({ error: "User not found" });
//     }
//     console.log("User found:", user);
//     res.json(user);
//   } catch (err) {
//     console.log("Profile error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Update User by ID (Protected route)
// router.put("/:id", authenticateToken, async (req, res) => {
//   try {
//     const { name, email, address, phone, password } = req.body;

//     // Ensure the user can only update their own data
//     if (req.user.id !== req.params.id) {
//       return res.status(403).json({ error: "Unauthorized access" });
//     }

//     const updateData = { name, email, address, phone };
//     if (password) {
//       updateData.password = await bcrypt.hash(password, 10); // Hash new password if provided
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true } // Return updated document
//     ).select("-password");

//     if (!updatedUser) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.json({ message: "User updated successfully", updatedUser });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Delete User by ID (Protected route)
// router.delete("/:id", authenticateToken, async (req, res) => {
//   try {
//     // Ensure the user can only delete their own account
//     if (req.user.id !== req.params.id) {
//       return res.status(403).json({ error: "Unauthorized access" });
//     }

//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.json({ message: "User deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const User = require("../models/User"); // Assuming you have a User model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("Auth Header:", authHeader);

  const token = authHeader && authHeader.split(" ")[1];
  console.log("Extracted Token:", token);

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Decoded Token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Token verification failed:", error.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Create User (Signup)
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      address,
      phone,
      firstname,
      lastname,
      city,
      state,
      country,
      pincode,
    } = req.body;

    // Check if user email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Check if username already exists
    const existingName = await User.findOne({ name });
    if (existingName) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      address,
      phone,
      firstname,
      lastname,
      city,
      state,
      country,
      pincode,
    });
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      userId: newUser._id,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      message: `Welcome, ${user.name}!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
        firstname: user.firstname,
        lastname: user.lastname,
        city: user.city,
        state: user.state,
        country: user.country,
        pincode: user.pincode,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get All Users (Optional)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single User by ID (Protected route)
router.get("/add/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User Profile (Protected route using token)
router.get("/profile", authenticateToken, async (req, res) => {
  console.log("hello1234");
  console.log("Profile route accessed - User:", req.user);
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      console.log("User not found for ID:", req.user.id);
      return res.status(404).json({ error: "User not found" });
    }
    console.log("User found:", user);
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      firstname: user.firstname,
      lastname: user.lastname,
      city: user.city,
      state: user.state,
      country: user.country,
      pincode: user.pincode,
    });
  } catch (err) {
    console.log("Profile error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update User by ID (Protected route)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { name, email, address, phone, password } = req.body;

    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const updateData = { name, email, address, phone };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User updated successfully", updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete User by ID (Protected route)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

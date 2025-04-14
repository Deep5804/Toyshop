// const express = require("express");
// const router = express.Router();
// const Address = require("../models/Address");

// // ✅ Create a new address
// router.post("/add", async (req, res) => {
//   try {
//     const { userId, addressLine1, addressLine2, city, state, postalCode, country } = req.body;

//     const newAddress = new Address({
//       userId,
//       addressLine1,
//       addressLine2,
//       city,
//       state,
//       postalCode,
//       country,
//     });

//     await newAddress.save();
//     res.status(201).json({ message: "Address saved successfully!", address: newAddress });
//   } catch (error) {
//     res.status(500).json({ message: "Error saving address", error });
//   }
// });

// // ✅ Get all addresses
// router.get("/", async (req, res) => {
//   try {
//     const addresses = await Address.find().populate("userId", "name email"); // Populate user details
//     res.json(addresses);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching addresses", error });
//   }
// });

// // ✅ Get an address by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const address = await Address.findById(req.params.id).populate("userId", "name email");
//     if (!address) return res.status(404).json({ message: "Address not found" });

//     res.json(address);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching address", error });
//   }
// });

// // ✅ Update an address
// router.put("/update/:id", async (req, res) => {
//   try {
//     const updatedAddress = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedAddress) return res.status(404).json({ message: "Address not found" });

//     res.json({ message: "Address updated successfully!", address: updatedAddress });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating address", error });
//   }
// });

// // ✅ Delete an address
// router.delete("/delete/:id", async (req, res) => {
//   try {
//     const deletedAddress = await Address.findByIdAndDelete(req.params.id);
//     if (!deletedAddress) return res.status(404).json({ message: "Address not found" });

//     res.json({ message: "Address deleted successfully!" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting address", error });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Address = require("../models/Address");

// ✅ Create a new address
router.post("/add", async (req, res) => {
  try {
    const { orderId, addressLine1, addressLine2, city, state, postalCode, country } = req.body;

    const newAddress = new Address({
      orderId,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
    });

    await newAddress.save();
    res.status(201).json({ message: "Address saved successfully!", address: newAddress });
  } catch (error) {
    res.status(500).json({ message: "Error saving address", error });
  }
});

// ✅ Get all addresses
router.get("/", async (req, res) => {
  try {
    const addresses = await Address.find().populate("orderId"); // Populate order details
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching addresses", error });
  }
});

// ✅ Get an address by ID
router.get("/:id", async (req, res) => {
  try {
    const address = await Address.findById(req.params.id).populate("orderId");
    if (!address) return res.status(404).json({ message: "Address not found" });

    res.json(address);
  } catch (error) {
    res.status(500).json({ message: "Error fetching address", error });
  }
});
// 🔹 Get address by orderId
// 🔹 Get address by orderId
router.get("/order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    // Validate that orderId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid Order ID format" });
    }

    // Fetch address related to the orderId
    const address = await Address.find({ orderId })
      .populate("orderId");  // Ensure that 'orderId' references the Order model

    if (address.length === 0) {
      return res.status(404).json({ message: "No address found for this order" });
    }

    res.status(200).json(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({ message: "Error fetching address by orderId", error });
  }
});
// ✅ Update an address
router.put("/update/:id", async (req, res) => {
  try {
    const updatedAddress = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAddress) return res.status(404).json({ message: "Address not found" });

    res.json({ message: "Address updated successfully!", address: updatedAddress });
  } catch (error) {
    res.status(500).json({ message: "Error updating address", error });
  }
});

// ✅ Delete an address
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedAddress = await Address.findByIdAndDelete(req.params.id);
    if (!deletedAddress) return res.status(404).json({ message: "Address not found" });

    res.json({ message: "Address deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting address", error });
  }
});

module.exports = router;

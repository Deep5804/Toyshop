const express = require("express");
const router = express.Router();
const Address = require("../models/Address");

// ✅ Create a new address
router.post("/add", async (req, res) => {
  try {
    const { userId, addressLine1, addressLine2, city, state, postalCode, country } = req.body;

    const newAddress = new Address({
      userId,
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
    const addresses = await Address.find().populate("userId", "name email"); // Populate user details
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching addresses", error });
  }
});

// ✅ Get an address by ID
router.get("/:id", async (req, res) => {
  try {
    const address = await Address.findById(req.params.id).populate("userId", "name email");
    if (!address) return res.status(404).json({ message: "Address not found" });

    res.json(address);
  } catch (error) {
    res.status(500).json({ message: "Error fetching address", error });
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

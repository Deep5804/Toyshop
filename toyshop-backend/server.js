// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");

// dotenv.config(); // Load environment variables

// const app = express();
// app.use(cors());
// app.use(express.json()); // Middleware to parse JSON data

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB Atlas Connected ✅"))
//   .catch((err) => console.error("MongoDB Connection Error:", err));

// app.get("/", (req, res) => {
//   res.send("Toy Shop API is Running 🚀");
// });


// const userRoutes = require("./routes/userRoutes");


// app.use("/api/users", userRoutes);


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));

// module.exports = app;



// 



const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const serverless = require("serverless-http"); // For Vercel Deployment

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON data

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("Toy Shop API is Running 🚀");
});

// Routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const addressRoutes = require("./routes/addressRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes"); 


// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes); 


// Set Port
const PORT = process.env.PORT || 5000;

// Start Server (Only in Local Mode)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`✅ Server is live on port ${PORT} 🚀`);
  });
}

// Export for Vercel (Serverless)
module.exports = app;
module.exports.handler = serverless(app);

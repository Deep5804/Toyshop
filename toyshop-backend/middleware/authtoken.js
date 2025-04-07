import authenticateToken from "../middleware/authtoken.js"; // ✅ Ensure .js extension is included

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key"; 

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

export default authenticateToken; // ✅ Ensure this is a default export

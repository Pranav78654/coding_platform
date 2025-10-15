import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protect = async (req, res, next) => {
  let token;

  // 1. Read the token from the httpOnly cookie
  token = req.cookies.token;

  if (token) {
    try {
      // 2. Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get the user from the token's ID (payload)
      //    and attach the user object to the request.
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next(); // Proceed to the next step (the controller function)

    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

const isTA = (req, res, next) => {
  // This function can remain the same as it runs after 'protect'
  if (req.user && req.user.role === "ta") {
    next();
  } else {
    res.status(403).json({ message: "Access Denied: Requires TA role" });
  }
};

export { protect, isTA };


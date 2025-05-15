import jwt from "jsonwebtoken";
import User from './../Models/user.model.js';

export const userSecurityMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Token" });
    }

    // ! decode token
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

    // ! find user via token
    const user = await User.findById(decodeToken.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Token" });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Admin access required" });
    }
  };
  
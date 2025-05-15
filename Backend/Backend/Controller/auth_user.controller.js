import User from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import { generate_jwt_token } from "../Services/generate_jwt.service.js";

export const register_Controller = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    //? find existing user
    const userData = await User.findOne({ email });
    if (userData) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Add a strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generate_jwt_token(createdUser?.id);

    // ! sending token into cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, //! 30 days expire date
    });

    res
      .status(200)
      .json({ success: true, message: "Registration Successfully" });
  } catch (error) {
    console.log("Register controller error: ", error);

    //? Send a response with status 400 in case of error
    res.status(500).json({ success: false, message: error.message });
  }
};

// ! login controller
export const login_adminController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const userEmailMatch = await User.findOne({ email });

    if (!userEmailMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }
    if (userEmailMatch.role === "user") {
      return res
        .status(400)
        .json({ success: false, message: "admin is required" });
    }
    const isMatch = await bcrypt.compare(password, userEmailMatch?.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const token = generate_jwt_token(userEmailMatch?.id);

    // ! sending token into cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, //! 30 days expire date
    });

    res.status(200).json({ success: true, message: "Login Successfully" });
  } catch (error) {
    //? Send a response with status 500 in case of error
    res.status(500).json({ success: false, message: error.message });
  }
};
// ! login controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const userEmailMatch = await User.findOne({ email });

    if (!userEmailMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, userEmailMatch?.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const token = generate_jwt_token(userEmailMatch?.id);

    // ! sending token into cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, //! 30 days expire date
    });

    res.status(200).json({ success: true, message: "Login Successfully" });
  } catch (error) {
    //? Send a response with status 500 in case of error
    res.status(500).json({ success: false, message: error.message });
  }
};

// ! logout controller

export const logoutController = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.status(200).json({ success: true, message: "Logout Successfully" });
  } catch (error) {
    //? Send a response with status 500 in case of error
    res.status(500).json({ success: false, message: error.message });
  }
};

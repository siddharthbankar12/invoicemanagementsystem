import User from "../models/user.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getNextSequence } from "../utils/getNextSequence.js";

export const Register = async (req, res) => {
  try {
    const { userName, email, role, password, loginUserRole } = req.body;

    if (!userName || !email || !role || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists." });
    }

    const rolePermissions = {
      "SUPER ADMIN": ["ADMIN"],
      ADMIN: ["UNIT MANAGER"],
      "UNIT MANAGER": ["USER"],
    };

    const allowedRoles = rolePermissions[loginUserRole] || [];

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: `You (${loginUserRole}) are not allowed to create a ${role}.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const rolePrefixMap = {
      ADMIN: "A",
      "UNIT MANAGER": "UM",
      USER: "U",
    };

    const prefix = rolePrefixMap[role];

    const sequence = await getNextSequence(role);
    const userID = `${prefix}${sequence}`;

    const newUser = new User({
      userID,
      userName,
      email,
      role,
      password: hashedPassword,
    });

    await newUser.save();

    return res
      .status(201)
      .json({ success: true, message: "Registered successfully." });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found. Please register." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password." });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECREATKEY
    );

    const userData = {
      id: user._id,
      userID: user.userID,
      userName: user.userName,
      email: user.email,
      role: user.role,
    };

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.json({ success: false });
    }

    const tokenData = jwt.verify(token, process.env.SECREATKEY);
    if (!tokenData) {
      return res.json({ success: false });
    }

    const isUserExists = await User.findById(tokenData.userId);
    if (!isUserExists) {
      return res.json({ success: false });
    }

    return res.json({
      success: true,
      userData: {
        user: {
          id: isUserExists._id,
          userName: isUserExists.userName,
          role: isUserExists.role,
          userID: isUserExists.userID,
        },
      },
    });
  } catch (error) {
    console.log(error, "error in get-current-user api call ..");
    return res.json({ success: false, message: error });
  }
};

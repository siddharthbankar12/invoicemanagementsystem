import User from "../models/user.schema.js";

export const GetAllUsers = async (req, res) => {
  try {
    const userList = await User.find();

    return res.status(200).json({
      success: true,
      message: "Fetched all users successfully",
      usersData: userList,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const UpdateUserRole = async (req, res) => {
  try {
    const { role, userId } = req.body;

    if (!role) {
      return res
        .status(400)
        .json({ success: false, message: "Role is required" });
    }

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const isUserExist = await User.findById(userId);

    if (!isUserExist) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    isUserExist.role = role;

    await isUserExist.save();

    return res.json({
      success: true,
      message: "user role updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const DeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const isUserExist = await User.findByIdAndDelete(userId);

    if (!isUserExist) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

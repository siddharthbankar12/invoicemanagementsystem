import User from "../models/user.schema.js";

export const GetAllUsers = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const isUserExist = await User.findById(userId);

    if (!isUserExist) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userList = await User.find();

    return res.status(200).json({
      success: true,
      message: "Fetched all users successfully",
      usersData: userList,
    });
  } catch (error) {
    console.error("GetAllUsers Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

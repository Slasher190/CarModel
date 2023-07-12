import ErrorHandler from "../middleware/error.js";
import User from "../models/userModel.js";
export const registerUser = async (req, res, next) => {
  try {
    const {
      user_email,
      user_id,
      user_location,
      password,
      user_info,
      vehicle_info,
    } = req.body;
    const user_ = req.body;
    const user = await User.getUserByEmail(user_email);
    if (user) {
      return next(new ErrorHandler("User Already Exists", 400));
    }
    await User.createUser({
      user_email,
      user_id,
      user_location,
      password,
      user_info,
      vehicle_info,
      created_at: new Date(),
    });
    res.status(200).json({
      success: true,
      user_,
    });
  } catch (error) {
    next(error);
  }
};

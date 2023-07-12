import ErrorHandler from "../middleware/error.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
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
    // const user_ = req.body;
    let user = await User.getUserByEmail(user_email);
    if (user) {
      return next(new ErrorHandler("User Already Exists", 400));
    }
    const hashPassowrd = await bcrypt.hash(password, 10);

    await User.createUser({
      user_email,
      user_id,
      user_location,
      password: hashPassowrd,
      user_info,
      vehicle_info,
      created_at: new Date(),
    });
    user = await User.getUserByEmail(user_email);
    console.log(user, " --- user");
    sendCookie(user, res, "Registered Successfully", 201);
  } catch (error) {
    next(error);
  }
};

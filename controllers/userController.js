import ErrorHandler from "../middleware/error.js";
import User from "../models/userModel.js";
import Cars from "../models/carsModel.js";
import Dealership from "../models/dealershipModel.js";

import bcrypt from "bcrypt";
import {
  sendCookie,
  generateResetPasswordToken,
  sendResetPasswordEmail,
  verifyResetPasswordToken,
} from "../utils/features.js";

export const registerUser = async (req, res, next) => {
  try {
    const { user_email, user_location, password, user_info, vehicle_info } =
      req.body;
    let user = await User.getUserByEmail(user_email);
    if (user) {
      return next(new ErrorHandler("User Already Exists", 400));
    }
    const hashPassowrd = await bcrypt.hash(password, 10);

    let newUser = {
      user_email,
      user_location,
      password: hashPassowrd,
      user_info,
      vehicle_info,
      created_at: new Date(),
      resetPasswordToken: null, // Initialize reset password token as null
    };

    await User.createUser(newUser);
    newUser = await User.getUserByEmail(user_email);
    delete newUser.password;
    sendCookie(newUser, res, "Registered Successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { user_email, password } = req.body;
    const user = await User.getUserByEmail(user_email);
    if (!user) return next(new ErrorHandler("User not found", 404));
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return next(new ErrorHandler("Invalid Username or Password", 400));
    delete user.password;
    sendCookie(user, res, "Logged In Successful", 200);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { user_email } = req.body;

    // Get the user by email
    const user = await User.getUserByEmail(user_email);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Generate the reset password token
    const resetToken = generateResetPasswordToken(user);

    // TODO: Send the reset token to the user (e.g., via email)
    await sendResetPasswordEmail(process.env.TO_EMAIL, resetToken);

    res.status(200).json({ message: "Password reset token sent successfully" });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Verify the reset password token
    const decodedToken = verifyResetPasswordToken(token);
    if (!decodedToken) {
      return next(new ErrorHandler("Invalid token", 400));
    }

    // Find the user by the decoded token (e.g., by resetPasswordToken field in the database)
    const user = await User.findOne({ resetPasswordToken: decodedToken });

    // Check if the user exists
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Set the new password and clear the reset password fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await User.update(user);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};

// /api/users/dealerships/{dealershipId}/cars
export const getCarsByDealershipId = async (req, res, next) => {
  try {
    const { dealershipId } = req.params;

    // Check if the dealership exists
    const dealership = await Dealership.findOne({ _id: dealershipId });
    if (!dealership) {
      return next(new ErrorHandler("Dealership not found", 404));
    }

    // Get the cars associated with the dealership
    const cars = await Cars.findByDealershipId(dealershipId);

    res.status(200).json({ success: true, cars });
  } catch (error) {
    next(error);
  }
};

export const getDealershipsByCarId = async (req, res, next) => {
  try {
    const { carId } = req.params;

    // Check if the car exists
    const car = await Cars.getCarById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    // Get the dealership by ID from the car model
    const dealershipId = car.dealershipId;
    const dealership = await Dealership.findOne(dealershipId);
    if (!dealership) {
      return next(new ErrorHandler("Dealership not found", 404));
    }

    res.status(200).json({ success: true, dealership });
  } catch (error) {
    next(error);
  }
};

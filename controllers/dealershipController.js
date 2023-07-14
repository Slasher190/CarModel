import ErrorHandler from "../middleware/error.js";
import Dealership from "../models/dealershipModel.js";
import Cars from "../models/carsModel.js";
import bcrypt from "bcrypt";
import {
  sendCookie,
  generateResetPasswordToken,
  sendResetPasswordEmail,
  verifyResetPasswordToken,
} from "../utils/features.js";

export const register = async (req, res, next) => {
  try {
    const { dealership_email, dealership_name, dealership_location, password } =
      req.body;
    let dealer = Dealership.getDealershipByEmail();
    if (dealer)
      return next(new ErrorHandler("The Dealer is already exist", 400));
    const hashed = bcrypt.hash(password, 10);
    let newDealer = {
      dealership_email,
      dealership_name,
      password: hashed,
      dealership_location,
      created_at: new Date(),
      resetPasswordToken: null,
    };
    await Dealership.createDealership(newDealer);
    newDealer = await Dealership.getDealershipByEmail(dealership_email);
    delete newDealer.password;
    sendCookie(newDealer, res, "New Dealer Registered", 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { dealership_email, password } = req.body;
    let dealer = await Dealership.getDealershipByEmail(dealership_email);
    if (!dealer) return next(new ErrorHandler("No Dealer Found", 404));
    const isMatch = await bcrypt.compare(password, dealer.password);
    if (!isMatch)
      return next(new ErrorHandler("Invalid Username or Password", 400));
    delete dealer.password;
    sendCookie(user, res, "Logged In Successful", 200);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { dealership_email } = req.body;

    // Get the user by email
    const dealer = await Dealership.getDealershipByEmail(dealership_email);
    if (!dealer) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Generate the reset password token
    const resetToken = generateResetPasswordToken(dealer);

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
    const dealer = await Dealership.findOne({
      resetPasswordToken: decodedToken,
    });

    // Check if the user exists
    if (!dealer) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Set the new password and clear the reset password fields
    dealer.password = password;
    dealer.resetPasswordToken = undefined;
    dealer.resetPasswordExpire = undefined;
    await Dealership.update(dealer);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};

export const getCarsByDealership = async (req, res, next) => {
  try {
    const { dealershipId } = req.body.dealershipId;

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

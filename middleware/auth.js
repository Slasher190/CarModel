import User from "../models/userModel.js";
import Dealership from "../models/dealershipModel.js";
import Jwt, { decode } from "jsonwebtoken";
import ErrorHandler from "./error.js";

export const isAuthenticatedUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return next(
        new ErrorHandler("Please Login to access this resource", 401)
      );
    }
    const decoded = Jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findOne({ _id: decoded._id });
    next();
  } catch (error) {
    next(error);
  }
};

export const isAuthenticatedDealer = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return next(
        new ErrorHandler("Please Login to access this resource", 401)
      );
    }
    const decoded = Jwt.verify(token, process.env.JWT_SECRET);
    req.dealer = await Dealership.findOne({ _id: decoded._id });
    req.body.dealershipId = decoded._id;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorizedDealer = (roles) => {};

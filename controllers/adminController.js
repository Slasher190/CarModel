import ErrorHandler from "../middleware/error";
import Admin from "../models/adminModel";

export const registerAdmin = async (req, res, next) => {
  try {
    const { admin_id, password } = req.body;
    const admin = Admin.find({ admin_id });
    if (admin) {
      return next(new ErrorHandler("Admin already exist"));
    }
    await Admin.createAdmin({ admin_id, password, created_at: new Date.now() });
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

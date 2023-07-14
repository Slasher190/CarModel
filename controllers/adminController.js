import ErrorHandler from "../middleware/error";
import Admin from "../models/adminModel";
import { sendCookie } from "../utils/features";

export const registerAdmin = async (req, res, next) => {
  try {
    const { admin_id, password } = req.body;
    const admin = Admin.find({admin_id});
    if (admin_id){
      return next(new ErrorHandler("Admin already exist"))
    }
    await Admin.createAdmin({ admin_id, password, created_at: new Date.now() });
    sendCookie()
  } catch (error) {}
};

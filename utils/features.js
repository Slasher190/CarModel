import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

export const sendCookie = (user, res, message, statusCode = 200) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  // console.log(token, "token");
  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: (process.env.COOKIE_EXPIRE || 15) * 60 * 60 * 1000,
      // sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
      // secure: process.env.NODE_ENV === "Development" ? false : true,
    })
    .json({
      success: true,
      message,
      token,
      user,
    });
};

export const getResetPasswordToken = () => {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Return the reset token
  return resetToken;
};

export const generateResetPasswordToken = (user) => {
  // Create the reset token
  const resetToken = getResetPasswordToken();

  // Generate the hashed reset token and expiration time
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpire =
    Date.now() + (process.env.RESET_PASSWORD_EXPIRE || 15) * 60 * 1000; // 15 minutes

  // Return the reset token
  return resetToken;
};

export const verifyResetPasswordToken = (token) => {
  try {
    // Verify the reset token
    const decoded = crypto.createHash("sha256").update(token).digest("hex");

    // Return the decoded token
    return decoded;
  } catch (error) {
    // Token verification failed
    return null;
  }
};

export const verifyToken = (req, res, next) => {
  // Get the token from the request header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded token to the request object for future use
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const transporter = nodemailer.createTransport({
  host: process.env.SMPT_HOST,
  port: process.env.SMPT_PORT,
  service: process.env.SMPT_SERVICE,
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const sendResetPasswordEmail = async (email = "", resetToken) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email || process.env.TO_EMAIL,
    subject: "Reset Password",
    text: `Please click on the following link to reset your password: ${resetToken}`,
  };

  await transporter.sendMail(mailOptions);
};

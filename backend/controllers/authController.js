import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import mailSender from "../utils/mailSender.js";
import { getOtp, removeOtp, isOtpExpired } from "../utils/otpStore.js";

const signup = async (req, res) => {
  try {
    const { name, email, password, role, otp } = req.body;

    if (!name || !email || !password || !role || !otp) {
      return res.status(403).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const storedOtpData = getOtp(email);
    if (!storedOtpData || isOtpExpired(email)) {
      removeOtp(email);
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ success: false, message: "Incorrect OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, role });

    removeOtp(email);

    const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET, { expiresIn: "1d"})

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
    })
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    return res.status(500).json({ success: false, message: "Signup failed", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    const isMatch = await bcrypt.compare(password,user.password);
    if (!user || !isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      message: "Login successful"
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log(req.body);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const subject = "Password Reset Request";
    const body = `
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `;

    await mailSender(email, subject, body);

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email!",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    console.log(error.message);
    res.status(500).json({ success: false, message: "Failed to send reset link", error: error.message });
  }
};

export default { signup, login, forgotPassword };

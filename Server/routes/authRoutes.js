const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { protect, workerOnly } = require("../middleware/authMiddleware");

const router = express.Router();

function createEmailTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
      });
    }

    if (!["client", "worker"].includes(role)) {
      return res.status(400).json({
        message: "Invalid account role.",
      });
    }

    const normalizedPhone = phone ? phone.trim().replace(/[\s()-]/g, "") : "";

    if (role === "worker" && !normalizedPhone) {
      return res.status(400).json({
        message: "Phone number is required for worker accounts.",
      });
    }

    if (normalizedPhone && !/^\+?[1-9]\d{6,14}$/.test(normalizedPhone)) {
      return res.status(400).json({
        message: "Please enter a valid phone number.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      message: "Account created successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    console.error("Registration error:", error.message);

    return res.status(500).json({
      message: "Unable to create account. Please try again.",
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Please provide email, password, and role.",
      });
    }

    if (!["client", "worker"].includes(role)) {
      return res.status(400).json({
        message: "Invalid account role.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (user.role !== role) {
      return res.status(403).json({
        message: `This account is registered as a ${user.role}. Please select the correct role.`,
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing from environment variables.");
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Unable to log in. Please try again.",
    });
  }
});

// FORGOT PASSWORD - SEND OTP
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        message: "Please enter your email address.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    const genericMessage =
      "If an account exists with this email, an OTP will be sent.";

    if (!user) {
      return res.status(200).json({
        message: genericMessage,
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    user.resetPasswordOTP = hashedOTP;
    user.resetPasswordOTPExpires = new Date(Date.now() + 5 * 60 * 1000);
    user.resetPasswordOTPAttempts = 0;

    await user.save();

    const transporter = createEmailTransporter();

    await transporter.sendMail({
      from: `"GiGHire" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your GiGHire Password Reset OTP",
      text: `Your GiGHire password reset OTP is ${otp}. It expires in 5 minutes. If you did not request this, ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px;">
          <h2 style="color: #4f46e5;">GiGHire Password Reset</h2>
          <p>Hello,</p>
          <p>Use the following OTP to reset your password:</p>
          <h1 style="letter-spacing: 8px; color: #4f46e5;">${otp}</h1>
          <p>This OTP expires in <strong>5 minutes</strong>.</p>
          <p>Never share this code with anyone.</p>
          <p>If you did not request this, you can safely ignore this email.</p>
          <p>Thanks,<br/>GiGHire Team</p>
        </div>
      `,
    });

    return res.status(200).json({
      message: genericMessage,
    });
  } catch (error) {
    console.error("Send OTP error:", error.message);

    return res.status(500).json({
      message: "Unable to send OTP. Please try again later.",
    });
  }
});

// VERIFY OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp || !/^\d{6}$/.test(String(otp))) {
      return res.status(400).json({
        message: "Please enter a valid 6-digit OTP.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select(
      "+resetPasswordOTP +resetPasswordOTPExpires +resetPasswordOTPAttempts",
    );

    if (!user || !user.resetPasswordOTP) {
      return res.status(400).json({
        message: "Invalid or expired OTP. Please request a new one.",
      });
    }

    if (
      !user.resetPasswordOTPExpires ||
      user.resetPasswordOTPExpires <= new Date()
    ) {
      user.resetPasswordOTP = undefined;
      user.resetPasswordOTPExpires = undefined;
      user.resetPasswordOTPAttempts = 0;
      await user.save();

      return res.status(400).json({
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (user.resetPasswordOTPAttempts >= 5) {
      user.resetPasswordOTP = undefined;
      user.resetPasswordOTPExpires = undefined;
      user.resetPasswordOTPAttempts = 0;
      await user.save();

      return res.status(429).json({
        message: "Too many incorrect attempts. Please request a new OTP.",
      });
    }

    const hashedOTP = crypto
      .createHash("sha256")
      .update(String(otp))
      .digest("hex");

    const otpMatches = crypto.timingSafeEqual(
      Buffer.from(hashedOTP, "hex"),
      Buffer.from(user.resetPasswordOTP, "hex"),
    );

    if (!otpMatches) {
      user.resetPasswordOTPAttempts += 1;
      await user.save();

      return res.status(400).json({
        message: "Incorrect OTP. Please try again.",
        attemptsRemaining: 5 - user.resetPasswordOTPAttempts,
      });
    }

    // Create a short-lived, single-use reset authorization.
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    user.resetPasswordOTPAttempts = 0;
    user.passwordResetAuthorization = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetAuthorizationExpires = new Date(
      Date.now() + 10 * 60 * 1000,
    );

    await user.save();

    return res.status(200).json({
      message: "OTP verified successfully.",
      resetToken,
    });
  } catch (error) {
    console.error("OTP verification error:", error.message);

    return res.status(500).json({
      message: "Unable to verify OTP. Please try again.",
    });
  }
});

// RESET PASSWORD - AFTER OTP VERIFICATION
router.post("/reset-password", async (req, res) => {
  try {
    const { resetToken, password } = req.body;

    if (!resetToken || !password) {
      return res.status(400).json({
        message: "Verification token and new password are required.",
      });
    }

    if (!/^[a-f0-9]{64}$/i.test(resetToken)) {
      return res.status(400).json({
        message:
          "Invalid or expired verification. Please verify your OTP again.",
      });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
      });
    }

    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      passwordResetAuthorization: hashedResetToken,
      passwordResetAuthorizationExpires: { $gt: new Date() },
    }).select("+passwordResetAuthorization +passwordResetAuthorizationExpires");

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid or expired verification. Please verify your OTP again.",
      });
    }

    user.password = await bcrypt.hash(password, 12);

    user.passwordResetAuthorization = undefined;
    user.passwordResetAuthorizationExpires = undefined;

    await user.save();

    return res.status(200).json({
      message:
        "Password reset successful. Please log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error.message);

    return res.status(500).json({
      message: "Unable to reset your password. Please try again.",
    });
  }
});

// UPDATE WORKER PROFILE
router.put("/profile", protect, workerOnly, async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return res.status(400).json({
        message: "Name, email and phone number are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim().replace(/[\s()-]/g, "");

    if (!/^\+?[1-9]\d{6,14}$/.test(normalizedPhone)) {
      return res.status(400).json({
        message: "Please enter a valid phone number.",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user.id },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "This email is already being used by another account.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: name.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!user) {
      return res.status(404).json({
        message: "User account not found.",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error.message);

    return res.status(500).json({
      message: "Unable to update profile. Please try again.",
    });
  }
});

module.exports = router;
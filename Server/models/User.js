const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: ["client", "worker"],
      required: true,
    },

    resetPasswordOTP: {
      type: String,
      select: false,
    },

    resetPasswordOTPExpires: {
      type: Date,
      select: false,
    },

    resetPasswordOTPAttempts: {
      type: Number,
      default: 0,
      select: false,
    },

    passwordResetAuthorization: {
      type: String,
      select: false,
    },

    passwordResetAuthorizationExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "admin",
    },
    profileImage: {
      type: String,
      default: "https://mathanmithun.neocities.org/androgynous-avatar-non-binary-queer-person_23-2151100270-_1_.jpg", // Default profile image
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpiresAt: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    verificationTokenExpiresAt: {
      type: Date,
      default: null,
    }
  },
  {
    timestamps: true,
  }
);

// Export the User model
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;

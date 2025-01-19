// controllers/auth.controller.js
const {
  handleError,
  sendSuccessResponse,
  multerErrorHandler,
} = require('../utils/responseUtils');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const {
  generateTokenAndSetCookie,
  createVerificationToken,
  createResetToken,
} = require('../utils/tokenUtils');
const userModel = require('../models/user.model');
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendDeleteAccountEmail,
} = require('../services/emailService');
const { uploadImage, deleteMedia } = require('../services/mediaService');
const formatTime = require('../utils/dateFormatter');

// User registration
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    // Validate request body
    if (!name || !email || !password) {
      return handleError(next, 'Missing required fields', 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return handleError(next, 'Invalid email format', 400);
    }

    // Check if user exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return handleError(next, 'User already exists', 409);
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create new user object
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    // Save the user
    const user = await newUser.save();

    // Generate verification token
    const verificationToken = createVerificationToken();
    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    // Send response
    sendSuccessResponse(
      res,
      'User registered successfully. Please verify your email.',
      {
        userId: user._id,
        email: user.email,
        verificationToken: user.verificationToken,
        verificationTokenExpiresAt: user.verificationTokenExpiresAt,
      },
      201
    );
  } catch (error) {
    handleError(
      next,
      `Registration failed. ${error.message}`,
      500,
      error.message
    );
  }
};

// User login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return handleError(next, 'Invalid credentials', 401);
    }

    // Check if password matches
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return handleError(next, 'Invalid credentials', 401);
    }

    if (!user.isVerified) {
      return handleError(next, 'Please verify your email to log in.', 401);
    }

    // Generate and set token in cookie
    generateTokenAndSetCookie(res, user._id);

    // Send response
    sendSuccessResponse(res, 'User logged in successfully', {
      userId: user._id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      isVerified: user.isVerified,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    });
  } catch (error) {
    handleError(next, `Login failed. ${error.message}`, 500, error.message);
  }
};

// Logout user
exports.logout = async (req, res, next) => {
  try {
    // Clear the token cookie by setting it to expire in the past
    // res.clearCookie('token');
    res.cookie('token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 0, // Clear the cookie immediately
    });
    sendSuccessResponse(res, 'User logged out successfully', {}, 200);
  } catch (error) {
    handleError(next, `Logout failed. ${error.message}`, 500, error.message);
  }
};

// Verify email
exports.verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.body;

    const user = await userModel.findOne({
      verificationToken,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return handleError(next, 'Invalid or expired verification token', 400);
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiresAt = null;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    sendSuccessResponse(res, 'Email verified successfully. Welcome', {
      email: user.email,
      isVerified: user.isVerified,
    });
  } catch (error) {
    handleError(
      next,
      `Email verification failed. ${error.message}`,
      500,
      error.message
    );
  }
};

// Resend verification email
exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return handleError(next, 'User not found', 404);
    }

    if (user.isVerified) {
      return handleError(next, 'User is already verified', 400);
    }
    const verificationToken = createVerificationToken();
    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    // Send verification email
    await sendVerificationEmail(email, verificationToken);
    sendSuccessResponse(res, 'Verification email resent successfully', {
      email: user.email,
      verificationToken: user.verificationToken,
      verificationTokenExpiresAt: user.verificationTokenExpiresAt,
    });
  } catch (error) {
    handleError(
      next,
      `Resend verification failed. ${error.message}`,
      500,
      error.message
    );
  }
};
// Request password reset
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return handleError(next, 'User with this email not found.', 404);
    }

    // Create password reset token
    const resetToken = createResetToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // Token expires in 1 hour
    await user.save();
    // Send password reset email
    await sendPasswordResetEmail(email, resetToken);

    sendSuccessResponse(
      res,
      'Password reset email sent successfully. Please check your inbox.',
      { email: user.email, resetToken },
      200
    );
  } catch (error) {
    handleError(
      next,
      `Password reset request failed. ${error.message}`,
      500,
      error.message
    );
  }
};
// Reset password
exports.resetPassword = async (req, res, next) => {
  try {
    const { resetToken } = req.params;

    const { newPassword } = req.body;

    const user = await userModel.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return handleError(
        next,
        'Invalid or expired reset token. Please request a new one.',
        400
      );
    }
    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user's password and reset token
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiresAt = null;
    await user.save();

    // Send password reset success email
    await sendResetSuccessEmail(user.email);

    sendSuccessResponse(res, 'Password reset successfully', {
      email: user.email,
      time: formatTime(),
    });
  } catch (error) {
    handleError(
      next,
      `Password reset failed. ${error.message}`,
      500,
      error.message
    );
  }
};

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    if (!currentPassword || !newPassword) {
      return handleError(
        next,
        'Current password and new password are required.',
        400
      );
    }

    if (currentPassword === newPassword) {
      return handleError(
        next,
        'New password cannot be the same as the current password.',
        400
      );
    }

    const isMatch = await comparePassword(currentPassword, user.password);

    if (!isMatch) {
      return handleError(next, 'Invalid current password', 401);
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;

    await user.save();
    sendSuccessResponse(res, 'Password changed successfully', {
      email: user.email,
    });
  } catch (error) {
    handleError(
      next,
      `Change password failed. ${error.message}`,
      500,
      error.message
    );
  }
};

// Get user profile
exports.profile = async (req, res, next) => {
  try {
    const user = req.user;

    sendSuccessResponse(res, 'User profile retrieved successfully', {
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
      role: user.role,
      isVerified: user.isVerified,
    });
  } catch (error) {
    handleError(
      next,
      `Profile retrieval failed. ${error.message}`,
      500,
      error.message
    );
  }
};

// Update profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phoneNumber } = req.body;
    const user = req.user;
    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    await user.save();
    sendSuccessResponse(res, 'Profile updated successfully', {
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
      role: user.role,
      isVerified: user.isVerified,
    });
  } catch (error) {
    handleError(
      next,
      `Profile update failed. ${error.message}`,
      500,
      error.message
    );
  }
};

// Update profile image
exports.updateProfileImage = async (req, res, next) => {
  try {
    const user = req.user;
    console.log('user: ', user);
    const file = req.file;
    console.log('file: ', file);

    if (!file) {
      return handleError(next, 'Please upload an image', 400);
    }

    const { buffer } = file;
    const uploadedImage = await uploadImage(buffer);

    if (user.profileImage && user.profileImage.includes('cloudinary')) {
      const publicId = user.profileImage.split('/').pop().split('.')[0];
      await deleteMedia(publicId);
    }
    user.profileImage = uploadedImage.secure_url;
    await user.save();

    sendSuccessResponse(res, 'Profile image updated successfully', {
      _id: user._id,
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.log('error: ', error);
    handleError(
      next,
      `Profile image update failed. ${error.message}`,
      500,
      error.message
    );
  }
};
// Delete user profile
exports.deleteProfile = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.profileImage && user.profileImage.includes('cloudinary')) {
      const publicId = user.profileImage.split('/').pop().split('.')[0];
      await deleteMedia(publicId);
    }

    await userModel.findByIdAndDelete(user._id);
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    await sendDeleteAccountEmail(user.email);

    sendSuccessResponse(res, 'User profile deleted successfully', {}, 200);
  } catch (error) {
    handleError(
      next,
      `Profile deletion failed. ${error.message}`,
      500,
      error.message
    );
  }
};

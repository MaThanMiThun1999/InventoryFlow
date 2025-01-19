// controllers/employee.controller.js
const { handleError, sendSuccessResponse } = require('../utils/responseUtils');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const userModel = require('../models/user.model');
const {
  sendWelcomeEmail,
  sendDeleteAccountEmail,
} = require('../services/emailService');
const { deleteMedia } = require('../services/mediaService');
const { uploadImage } = require('../services/mediaService');

// Create a new employee (Admin only)
exports.createEmployee = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber, role } = req.body;

    if (!name || !email || !password || !role) {
      return handleError(
        next,
        'Name, email, password and role are required.',
        400
      );
    }
    if (role !== 'admin' && role !== 'employee') {
      return handleError(
        next,
        "Invalid role type. use 'admin' or 'employee'",
        400
      );
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return handleError(next, 'User already exists', 409);
    }
    const hashedPassword = await hashPassword(password);

    const newEmployee = new userModel({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      isVerified: true,
      role,
    });

    const employee = await newEmployee.save();
    await sendWelcomeEmail(employee.email, employee.name);
    sendSuccessResponse(
      res,
      'Employee created successfully. They will receive a welcome email.',
      {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        phoneNumber: employee.phoneNumber,
        role: employee.role,
      },
      201
    );
  } catch (error) {
    handleError(
      next,
      `Employee creation failed. ${error.message}`,
      500,
      error.message
    );
  }
};

// Get all employees (Admin only)
exports.getAllEmployees = async (req, res, next) => {
  try {
    const employees = await userModel
      .find({ role: { $ne: 'admin' } })
      .sort({ createdAt: -1 });
    sendSuccessResponse(res, 'Employees retrieved successfully', { employees });
  } catch (error) {
    handleError(
      next,
      `Failed to retrieve employees. ${error.message}`,
      500,
      error.message
    );
  }
};

// Get a single employee by ID (Admin only)
exports.getEmployeeById = async (req, res, next) => {
  try {
    const employeeId = req.params.id;
    const employee = await userModel.findById(employeeId);
    if (!employee) {
      return handleError(next, 'Employee not found.', 404);
    }
    sendSuccessResponse(res, 'Employee retrieved successfully', { employee });
  } catch (error) {
    handleError(
      next,
      `Failed to retrieve employee with the given ID. ${error.message}`,
      500,
      error.message
    );
  }
};

// Update an employee by ID (Admin only)
exports.updateEmployee = async (req, res, next) => {
  try {
    const employeeId = req.params.id;
    const { name, email, phoneNumber, role, profileImage } = req.body;

    if (role && role !== 'admin' && role !== 'employee') {
      return handleError(
        next,
        "Invalid role type. use 'admin' or 'employee'",
        400
      );
    }

    const employee = await userModel.findById(employeeId);
    if (!employee) {
      return handleError(next, 'Employee not found.', 404);
    }
    if (name) employee.name = name;
    if (email) employee.email = email;
    if (phoneNumber) employee.phoneNumber = phoneNumber;
    if (role) employee.role = role;
    if (profileImage) employee.profileImage = profileImage;

    await employee.save();

    sendSuccessResponse(res, 'Employee updated successfully', {
      _id: employee._id,
      name: employee.name,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      role: employee.role,
      profileImage: employee.profileImage,
    });
  } catch (error) {
    handleError(
      next,
      `Employee update failed. ${error.message}`,
      500,
      error.message
    );
  }
};
// Update employee profile image
exports.updateEmployeeProfileImage = async (req, res, next) => {
  try {
    const employeeId = req.params.id;
    const file = req.file;

    const employee = await userModel.findById(employeeId);
    if (!employee) {
      return handleError(next, 'Employee not found.', 404);
    }

    if (!file) {
      return handleError(next, 'Please upload an image', 400);
    }

    const { buffer } = file;
    const uploadedImage = await uploadImage(buffer);

    if (employee.profileImage && employee.profileImage.includes('cloudinary')) {
      const publicId = employee.profileImage.split('/').pop().split('.')[0];
      await deleteMedia(publicId);
    }
    employee.profileImage = uploadedImage.secure_url;
    await employee.save();

    sendSuccessResponse(res, 'Employee profile image updated successfully', {
      _id: employee._id,
      profileImage: employee.profileImage,
    });
  } catch (error) {
    handleError(
      next,
      `Employee profile image update failed. ${error.message}`,
      500,
      error.message
    );
  }
};

// Delete an employee by ID (Admin only)
exports.deleteEmployee = async (req, res, next) => {
  try {
    const employeeId = req.params.id;
    const employee = await userModel.findById(employeeId);
    if (!employee) {
      return handleError(next, 'Employee not found.', 404);
    }
    if (employee.profileImage && employee.profileImage.includes('cloudinary')) {
      const publicId = employee.profileImage.split('/').pop().split('.')[0];
      await deleteMedia(publicId);
    }

    await userModel.findByIdAndDelete(employeeId);

    await sendDeleteAccountEmail(employee.email);

    sendSuccessResponse(res, 'Employee deleted successfully', {}, 200);
  } catch (error) {
    handleError(
      next,
      `Employee deletion failed. ${error.message}`,
      500,
      error.message
    );
  }
};

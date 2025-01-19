// routes/employee.routes.js
const express = require('express');
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  updateEmployeeProfileImage,
  deleteEmployee,
} = require('../controllers/employee.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');
const upload = require('../middlewares/multerMiddleware');
const { multerErrorHandler } = require('../utils/responseUtils');
const router = express.Router();

router.use(authMiddleware);
router.use(isAdmin);

router.post('/', createEmployee);
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.put(
  '/:id/update-profile-image',
  upload.single('profileImage'),
  multerErrorHandler,
  updateEmployeeProfileImage
);
router.delete('/:id', deleteEmployee);

module.exports = router;

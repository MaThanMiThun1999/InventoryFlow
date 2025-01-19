const express = require('express');
const {
  register,
  login,
  logout,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  profile,
  updateProfile,
  updateProfileImage,
  changePassword,
  deleteProfile,
} = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');
const upload = require('../middlewares/multerMiddleware');
const { multerErrorHandler } = require('../utils/responseUtils');
const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);

// Protected routes (user must be logged in)
router.use(authMiddleware);
router.get('/profile', profile);
router.put('/update-profile', updateProfile);
router.put(
  '/update-profile-image',
  upload.single('profileImage'),
  multerErrorHandler,
  updateProfileImage
);

router.put('/change-password', changePassword);
router.post('/logout', logout);
router.delete('/delete-profile', deleteProfile);

module.exports = router;

// routes/product.routes.js
const express = require('express');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  filterProducts,
} = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');
const upload = require('../middlewares/multerMiddleware');
const { multerErrorHandler } = require('../utils/responseUtils');
const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/search', searchProducts);
router.get('/filter', filterProducts);

// Admin only routes
router.use(authMiddleware);
router.use(isAdmin);
router.post('/', upload.array('images', 5), multerErrorHandler, createProduct);
router.put(
  '/:id',
  upload.array('images', 5),
  multerErrorHandler,
  updateProduct
);
router.delete('/:id', deleteProduct);

module.exports = router;

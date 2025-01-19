// controllers/product.controller.js
const {
  handleError,
  sendSuccessResponse,
  multerErrorHandler,
} = require('../utils/responseUtils');
const productModel = require('../models/product.model');
const { uploadImage, deleteMedia } = require('../services/mediaService');
const { SUPPORT_MAIL, LOW_STOCK_THRESHOLD } = require('../config/envConfig');
const userModel = require('../models/user.model');
const sendEmail = require('../config/nodemailer');

// Create a new product
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, stock, location } = req.body;
    const createdBy = req.userID; // From authMiddleware
    const images = req.files;
    const imageUrls = [];

    if (!name || !stock || !createdBy) {
      return handleError(next, 'Name, stock, createdBy are required', 400);
    }

    if (images && images.length > 0) {
      for (const image of images) {
        const { buffer } = image;
        const uploadedImage = await uploadImage(buffer);
        imageUrls.push(uploadedImage.secure_url);
      }
    }

    const newProduct = new productModel({
      name,
      description,
      stock: parseInt(stock),
      images: imageUrls,
      location: location ? JSON.parse(location) : undefined,
      createdBy: createdBy,
    });

    const product = await newProduct.save();
    sendSuccessResponse(
      res,
      'Product created successfully',
      {
        ...product._doc,
      },
      201
    );
  } catch (error) {
    handleError(
      next,
      `Product creation failed. ${error.message}`,
      500,
      error.message
    );
  }
};

// Get all products
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await productModel
      .find()
      .populate({ path: 'createdBy', select: 'name email role' })
      .sort({ createdAt: -1 }); // Sorting by creation date (latest first)
    sendSuccessResponse(res, 'Products retrieved successfully', { products });
  } catch (error) {
    handleError(
      next,
      `Failed to retrieve products. ${error.message}`,
      500,
      error.message
    );
  }
};

// Get a single product by ID
exports.getProductById = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await productModel
      .findById(productId)
      .populate({ path: 'createdBy', select: 'name email role' });

    if (!product) {
      return handleError(next, 'Product not found', 404);
    }

    sendSuccessResponse(res, 'Product retrieved successfully', { product });
  } catch (error) {
    handleError(
      next,
      `Failed to retrieve product with the given ID. ${error.message}`,
      500,
      error.message
    );
  }
};

// Update a product by ID
exports.updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { name, description, stock, status, location } = req.body;
    const images = req.files;
    const imageUrls = [];

    const product = await productModel.findById(productId);
    if (!product) {
      return handleError(next, 'Product not found', 404);
    }

    if (images && images.length > 0) {
      for (const image of images) {
        const { buffer } = image;
        const uploadedImage = await uploadImage(buffer);
        imageUrls.push(uploadedImage.secure_url);
      }
      // Delete previously uploaded images from Cloudinary
      if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          if (imageUrl && imageUrl.includes('cloudinary')) {
            const publicId = imageUrl.split('/').pop().split('.')[0];
            await deleteMedia(publicId);
          }
        }
      }
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.stock = stock !== undefined ? parseInt(stock) : product.stock;
    product.status = status || product.status;
    product.images = imageUrls.length > 0 ? imageUrls : product.images;
    product.location = location ? JSON.parse(location) : product.location;

    await product.save();

    sendSuccessResponse(res, 'Product updated successfully', {
      ...product._doc,
    });
  } catch (error) {
    handleError(
      next,
      `Product update failed. ${error.message}`,
      500,
      error.message
    );
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);

    if (!product) {
      return handleError(next, 'Product not found.', 404);
    }

    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        if (imageUrl && imageUrl.includes('cloudinary')) {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          await deleteMedia(publicId);
        }
      }
    }
    await productModel.findByIdAndDelete(productId);
    sendSuccessResponse(res, 'Product deleted successfully', {}, 200);
  } catch (error) {
    handleError(
      next,
      `Product deletion failed. ${error.message}`,
      500,
      error.message
    );
  }
};

// Search products by name, category, or SKU
exports.searchProducts = async (req, res, next) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    if (!query) {
      return handleError(next, 'Search query is required.', 400);
    }

    const searchRegex = new RegExp(query, 'i'); // 'i' for case-insensitive

    const products = await productModel
      .find({
        $or: [
          { name: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
        ],
      })
      .skip(skip)
      .limit(parseInt(limit))
      .populate({ path: 'createdBy', select: 'name email role' })
      .sort({ createdAt: -1 });
    if (!products || products.length === 0) {
      return handleError(
        next,
        `No products found with the search query: ${query}`,
        404
      );
    }
    const total = await productModel.countDocuments({
      $or: [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ],
    });

    sendSuccessResponse(
      res,
      'Products found',
      {
        products,
        page: parseInt(page),
        limit: parseInt(limit),
        total,
      },
      200
    );
  } catch (error) {
    handleError(
      next,
      `Product search failed. ${error.message}`,
      500,
      error.message
    );
  }
};
// Filter products based on stock levels
exports.filterProducts = async (req, res, next) => {
  try {
    const { stockLevel, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    if (
      !stockLevel ||
      (stockLevel !== 'in-stock' && stockLevel !== 'out-of-stock')
    ) {
      return handleError(
        next,
        'Invalid stock level. Use "in-stock" or "out-of-stock"',
        400
      );
    }
    const query =
      stockLevel === 'in-stock'
        ? { status: 'available', stock: { $gt: 0 } }
        : { status: 'out-of-stock' };
    const products = await productModel
      .find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .populate({ path: 'createdBy', select: 'name email role' })
      .sort({ createdAt: -1 });

    if (!products || products.length === 0) {
      return handleError(
        next,
        `No products found with the stock level: ${stockLevel}`,
        404
      );
    }

    const total = await productModel.countDocuments(query);

    sendSuccessResponse(res, 'Filtered products retrieved successfully', {
      products,
      page: parseInt(page),
      limit: parseInt(limit),
      total,
    });
  } catch (error) {
    handleError(
      next,
      `Product filtering failed. ${error.message}`,
      500,
      error.message
    );
  }
};

// Function to check and send low stock alerts
exports.checkAndSendLowStockAlerts = async () => {
  try {
    // Find products with stock below the threshold
    const threshold = LOW_STOCK_THRESHOLD;
    const lowStockProducts = await productModel
      .find({
        stock: { $lt: threshold },
        status: { $ne: 'out-of-stock' },
      })
      .populate({ path: 'createdBy', select: 'name email role' });

    if (lowStockProducts.length > 0) {
      const adminUsers = await userModel.find({ role: 'admin' });
      const adminEmails = adminUsers.map((admin) => admin.email);

      const productMessages = lowStockProducts.map(
        (product) =>
          `Product "${product.name}" is low in stock with only ${product.stock} items.`
      );
      for (const adminEmail of adminEmails) {
        const mailOptions = {
          to: adminEmail,
          subject: 'Low Stock Alert',
          text: `The following products are running low on stock:\n${productMessages.join(
            '\n'
          )}\n\n Please review your inventory. \n This notification was automatically sent from inventoryflow.\n Support email: ${SUPPORT_MAIL} `,
        };
        await sendEmail(mailOptions);
        console.log(`Low stock email sent to ${adminEmail}`);
      }

      for (const product of lowStockProducts) {
        product.status = 'out-of-stock';
        await product.save();
      }
    }
  } catch (error) {
    console.error('Error checking and sending low stock alerts:', error);
  }
};

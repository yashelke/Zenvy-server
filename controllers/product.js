import bufferGenerator from "../utils/bufferGenerator.js";
import TryCatch from "../utils/TryCatch.js";
import cloudinary from "cloudinary";
import { Product } from "../models/Product.js";

export const createProduct = TryCatch(async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "You're not an admin.",
    });

  const { title, about, category, price, stock } = req.body;

  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({
      message: "No files to upload.",
    });
  }

  const imageUploadPromises = files.map(async (file) => {
    const buffer = bufferGenerator(file);

    const result = await cloudinary.v2.uploader.upload(buffer.content);

    return {
      id: result.public_id,
      url: result.secure_url,
    };
  });

  const uploadedImage = await Promise.all(imageUploadPromises);

  const product = await Product.create({
    title,
    about,
    category,
    price,
    stock,
    images: uploadedImage,
  });

  res.status(201).json({
    message: "Product created successfully.",
    product,
  });
});

// search products via filtering

export const getAllProducts = TryCatch(async (req, res) => {
  const { search, category, page, sortByPrice } = req.query;

  const filter = {};

  if (search) {
    filter.title = {
      $regex: search,
      $options: "i",
    };
  }

  if (category) {
    filter.category = category;
  }

  //   max 8 products per page and pagination logic
  const limit = 8;
  const skip = (page - 1) * limit;

  let sortOption = { createdAt: -1 };

  if (sortByPrice) {
    if (sortByPrice === "lowToHigh") {
      sortOption = { price: 1 };
    } else if (sortByPrice === "highToLow") {
      sortOption = { price: -1 };
    }
  }

  const products = await Product.find(filter)
    .sort(sortOption)
    .limit(limit)
    .skip(skip);

  const categories = await Product.distinct("category");

  const newProduct = await Product.find().sort("-createdAt").limit(4);

  const countProduct = await Product.countDocuments();

  const totalPages = Math.ceil(countProduct / limit);

  res.json({
    products,
    categories,
    totalPages,
    newProduct,
  });
});

// controller to get a single product

export const getSingleProduct = TryCatch(async (req, res) => {
  const product = await Product.findById(req.params.id);

  // only 4 related products will be shown based on the category of the product

  const relatedProduct = await Product.find({
    category: product.category,
    // exclude the current product from the related products list
    _id: { $ne: product._id },
  }).limit(4);

  res.json({ product, relatedProduct });
});

// controller to update product by the admin only.

export const updateProduct = TryCatch(async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "You're not an admin.",
    });

  const { title, about, category, price, stock } = req.body;

  const updateFields = {};

  if (title) updateFields.title = title;
  if (about) updateFields.about = about;
  if (category) updateFields.category = category;
  if (price) updateFields.price = price;
  if (stock) updateFields.stock = stock;

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updateFields,
    { new: true, runValidators: true },
  );

  if (!updatedProduct) {
    return res.status(404).json({
      message: "Product not found.",
    });
  }

  res.status(200).json({
    message: "Product updated successfully.",
    updatedProduct,
  });
});

// controller to update the product images by the admin only.

export const updateProductImage = TryCatch(async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "You're not an admin.",
    });

  const { id } = req.params;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({
      message: "No files to upload.",
    });
  }

  const product = await Product.findById(id);

  //   firstly, we will find the product by id and then we will delete the old images from cloudinary and then we will upload the new images to cloudinary and then we will update the product with the new images.

  if (!product) {
    return res.status(404).json({
      message: "Product not found.",
    });
  }

  const oldImages = product.images || [];

  for (const img of oldImages) {
    if (img.id) {
      await cloudinary.v2.uploader.destroy(img.id);
    }
  }

  const imageUploadPromises = files.map(async (file) => {
    const buffer = bufferGenerator(file);

    const result = await cloudinary.v2.uploader.upload(buffer.content);

    return {
      id: result.public_id,
      url: result.secure_url,
    };
  });

  const uploadedImage = await Promise.all(imageUploadPromises);

  product.images = uploadedImage;

  await product.save();

  res.status(200).json({
    message: "Product images updated successfully.",
    product,
  });
  
});

// import bufferGenerator from "../utils/bufferGenerator.js";
// import TryCatch from "../utils/TryCatch.js";
// import cloudinary from "cloudinary";
// import { Product } from "../models/Product.js";

// export const createProduct = TryCatch(async (req, res) => {

//   // ✅ 1. Admin check
//   if (req.user.role !== "admin") {
//     return res.status(403).json({
//       message: "Access denied. Admins only.",
//     });
//   }

//   const { title, description, category } = req.body;

//   // ✅ 2. Convert numbers safely
//   const price = Number(req.body.price);
//   const stock = Number(req.body.stock);

//   // ✅ 3. Validate required fields
//   if (!title || !description || !category) {
//     return res.status(400).json({
//       message: "All fields (title, description, category) are required.",
//     });
//   }

//   if (isNaN(price) || isNaN(stock)) {
//     return res.status(400).json({
//       message: "Price and stock must be valid numbers.",
//     });
//   }

//   if (price <= 0 || stock < 0) {
//     return res.status(400).json({
//       message: "Price must be greater than 0 and stock cannot be negative.",
//     });
//   }

//   // ✅ 4. Validate files
//   const files = req.files;

//   if (!files || files.length === 0) {
//     return res.status(400).json({
//       message: "At least one product image is required.",
//     });
//   }

//   // ✅ 5. Upload images to Cloudinary
//   const imageUploadPromises = files.map(async (file) => {
//     const buffer = bufferGenerator(file);

//     const result = await cloudinary.v2.uploader.upload(
//       buffer.content,
//       { folder: "products" } // optional but cleaner
//     );

//     return {
//       id: result.public_id,
//       url: result.secure_url,
//     };
//   });

//   const uploadedImages = await Promise.all(imageUploadPromises);

//   // ✅ 6. Create product
//   const product = await Product.create({
//     title,
//     description,
//     category,
//     price,
//     stock,
//     images: uploadedImages,
//   });

//   // ✅ 7. Success response
//   res.status(201).json({
//     message: "Product created successfully.",
//     product,
//   });

// });

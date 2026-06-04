import { Favourite } from "../models/Favourite.js";
import { Product } from "../models/Product.js";
import TryCatch from "../utils/TryCatch.js";

// Add product to favourites
export const addToFavourites = TryCatch(async (req, res) => {
  const { productId } = req.body;

  // Validate if the product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      message: "Product not found.",
    });
  }

  // Check if it's already in favourites
  const existingFavourite = await Favourite.findOne({
    product: productId,
    user: req.user._id,
  });

  if (existingFavourite) {
    return res.status(400).json({
      message: "Product is already in your favourites.",
    });
  }

  const favourite = await Favourite.create({
    product: productId,
    user: req.user._id,
  });

  res.status(201).json({
    message: "Product added to favourites.",
    favourite,
  });
});

// Remove product from favourites
export const removeFromFavourites = TryCatch(async (req, res) => {
  const { id } = req.params; // Expects the Product ID or Favourite Document ID

  // Check and delete by product ID and current logged-in user
  const favourite = await Favourite.findOneAndDelete({
    product: id,
    user: req.user._id,
  });

  if (!favourite) {
    return res.status(404).json({
      message: "Favourite not found.",
    });
  }

  res.status(200).json({
    message: "Removed from favourites.",
  });
});

// Fetch all favourites for the authenticated user
export const fetchFavourites = TryCatch(async (req, res) => {
  // Populate the 'product' field to get full product details
  const favourites = await Favourite.find({ user: req.user._id }).populate("product");

  res.status(200).json({
    favourites: favourites.map(item => item.product), // Map to only return the product array
  });
});

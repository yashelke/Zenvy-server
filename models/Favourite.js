import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate favourites (one user can only favourite a specific product once)
favouriteSchema.index({ product: 1, user: 1 }, { unique: true });

export const Favourite = mongoose.model("Favourite", favouriteSchema);

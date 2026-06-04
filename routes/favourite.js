import express from "express";
import { addToFavourites, removeFromFavourites, fetchFavourites } from "../controllers/favourite.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

// Add a product to favourites
router.post("/favourite/add", isAuth, addToFavourites);

// Remove a product from favourites (using product ID)
router.delete("/favourite/remove/:id", isAuth, removeFromFavourites);

// Fetch all favourites of the logged-in user
router.get("/favourite/all", isAuth, fetchFavourites);

export default router;


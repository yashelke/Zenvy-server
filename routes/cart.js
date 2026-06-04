import express from 'express';
import { addToCart, fetchCart, removeFromCart, updateCart } from '../controllers/cart.js';
import { isAuth } from '../middlewares/isAuth.js';


const router = express.Router();

// route to add a product to the cart

router.post("/cart/add",isAuth, addToCart);

// route to remove a product from the cart
router.delete("/cart/remove/:id", isAuth, removeFromCart);


// route to update the cart

router.post("/cart/update", isAuth, updateCart );

// router to get the cart items of the user

router.get("/cart/all", isAuth, fetchCart);

export default router;
import express from "express";
import { createProduct, getAllProducts, getSingleProduct, updateProduct, updateProductImage } from "../controllers/product.js";
import { isAuth } from "../middlewares/isAuth.js";
import uploadFiles from "../middlewares/multer.js";

const router = express.Router();

// route to create a new product, with image upload functionality using multer middleware

router.post("/product/new",isAuth,uploadFiles, createProduct);

// get all Products route

router.get("/product/all", getAllProducts);

// get Single Product route

router.get("/product/:id", getSingleProduct);

// route to update a product

router.put("/product/:id", isAuth, updateProduct)

// route for product image updation

router.post("/product/:id", isAuth, uploadFiles, updateProductImage);


export default router;
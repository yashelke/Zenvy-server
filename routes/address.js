import express from "express";
import { addAddress,getAllAddress, getSingleAddress, deleteAddress } from "../controllers/address.js";
import { isAuth } from "../middlewares/isAuth.js";


const router = express.Router();


router.post("/address/new", isAuth, addAddress);

router.get("/address/all", isAuth, getAllAddress);

router.get("/address/:id", isAuth, getSingleAddress);

router.delete("/address/delete/:id", isAuth, deleteAddress);





export default router;
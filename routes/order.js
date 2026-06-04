import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { getAllOrders, getAllOrdersAdmin, getSingleOrder, getStats, newOrderCod, updateOrderStatus,  newOrderOnline, verifyPayment  } from "../controllers/order.js";


const router = express.Router();

router.post("/order/new/cod",isAuth, newOrderCod);

router.get("/order/all", isAuth, getAllOrders);

// admin route for ordersPage
router.get("/order/admin/all", isAuth, getAllOrdersAdmin);


router.get("/order/:id", isAuth, getSingleOrder);

router.post("/order/status/:id", isAuth, updateOrderStatus);


router.get("/stats", isAuth, getStats);

router.post("/order/new/online", isAuth, newOrderOnline);

router.post("/order/verify/payment", isAuth, verifyPayment);


export default router;
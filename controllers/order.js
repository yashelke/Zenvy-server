import { Order } from "../models/Order.js";
import TryCatch from "../utils/TryCatch.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import sendOrderConfirmation from "../utils/sendOrderConfirmation.js";
import { Cart } from "../models/Cart.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// contoller to place an order and send an email to the user with order details

export const newOrderCod = TryCatch(async (req, res) => {
  const { method, phone, address } = req.body;

  const cart = await Cart.find({ user: req.user._id }).populate({
    path: "product",
    select: "title price",
  });

  if (!cart.length) {
    return res.status(400).json({
      message: "Your Cart is empty!",
    });
  }

  let subTotal = 0;

  const validCart = cart.filter((i) => i.product != null);

  if (!validCart.length) {
    // Clean up stale cart items whose products have been deleted
    await Cart.deleteMany({ user: req.user._id });
    return res.status(400).json({
      message: "Your Cart is empty!",
    });
  }

  const items = validCart.map((i) => {
    const itemSubTotal = i.product.price * i.quantity;

    subTotal += itemSubTotal;

    return {
      product: i.product._id,
      name: i.product.title,
      price: i.product.price,
      quantity: i.quantity,
    };
  });

  const order = await Order.create({
    items,
    method,
    user: req.user._id,
    phone,
    address,
    subTotal,
  });

  for (let i of order.items) {
    await Product.findByIdAndUpdate(i.product, {
      $inc: { stock: -i.quantity, sold: i.quantity },
    });
  }

  await Cart.deleteMany({ user: req.user._id });

  await sendOrderConfirmation(
    req.user.email,
    "Order Confirmation",
    order._id,
    items,
    subTotal
  );

  return res.status(201).json({
    message: "Order Placed Successfully!",
    order,
  });
});


// controller to fetch the  all orders 

export const getAllOrders = TryCatch(async(req , res) =>
{

  const orders = await Order.find({user: req.user._id});

  // if there are no orders then return the response with empty orders array

  if(orders.length === 0)
  {
    res.status(404).json({
      message: "No Orders placed yet by this user.",
      orders: [],
    });
  }


  // show the orders in descending order of creation [LATEST ORDERS FIRST]
  res.json({
    orders: orders.reverse(),
  });


})


export const getAllOrdersAdmin = TryCatch(async(req , res) =>
{

  if(req.user.role !== "admin")
  {
    return res.status(403).json({
      message: "Access Denied. You're not an admin.",
    });
  }

  const orders = await Order.find().populate("user").sort({ createdAt: -1 });

  res.json({
    orders,
  });

});



// controller to fetch a single order 

export const getSingleOrder = TryCatch(async(req , res) =>
{
  const order = await Order.findById(req.params.id).populate("items.product").populate("user");


  res.json({
    order,
  });

});


// controller to update the order status by the admin

export const updateOrderStatus = TryCatch(async(req , res) =>
{

  if(req.user.role !== "admin")
  {
    return res.status(403).json({
      message: "Access Denied! You're not an admin.",
    });
  }

  const order = await Order.findById(req.params.id);


  const { status } = req.body;

  order.status = status;

  await order.save();

  res.json({
    message: "Order Status updated successfully!",
    order,
  });

});


// controller to display stats and it can be viewed only by the admin.


export const getStats = TryCatch(async(req , res) =>{

  if(req.user.role !== "admin" )
    {
      return res.status(403).json({
        message: "Access Denied! You're not an admin.",
      });

    }
 


  const cod = await Order.find({method:"cod"}).countDocuments();

  const online = await Order.find({method:"online"}).countDocuments();

  const products = await Product.find()

  const data = products.map((prod) =>{

  return({
    name:prod.title,
      sold:prod.sold,
  })

 
      

  });

  res.json({
    cod,
    online,
    data,
  });


})


export const newOrderOnline = TryCatch(async(req , res) =>{

  const {method, phone, address} = req.body;

  const cart = await Cart.find({user: req.user._id}).populate("product");

  if(!cart.length){
    return res.status(400).json({
      message: "Your Cart is empty!",
    });
  }

  const subTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const lineItems = cart.map((item) =>(
    {
      price_data:{
        currency: "inr",
      product_data:{
        name: item.product.title,
        images: [item.product.images[0].url],
      },
      unit_amount: Math.round(item.product.price * 100),

      },
      quantity: item.quantity,
    }
  ));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.Frontend_URL}/ordersuccess?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.Frontend_URL}/cart`,
    metadata:{
      userId: req.user._id.toString(),
      method,
      phone,
      address,
      subTotal: Math.round(subTotal).toString(),
    }
  });

  res.json({
    url: session.url,
  });

});



// controller to verify the payment 


// export const verifyPayment = aysnc(req , res) => {

//   const {session_id} = req.body;

//   try{

//     const session = await stripe.checkout.sessions.retrieve(session_id);

//     const {userId, method, phone, address, subTotal} = session.metadata;

//     const cart = await Cart.find({user: userId}).populate("product");

//     const items = cart.map((i) =>{
//       return {
//         product: i.product._id,
//         name: i.product.title,
//         price: i.product.price,
//         quantity: i.quantity,
//       }
//     })

//     if(cart.length === 0){
//       return res.status(400).json({
//         message: "Your Cart is empty!",
//       });
//     }

//     const existingOrder = await Order.findOne({paymentInfo: session_id});

//     if(!existingOrder){

//       const order = await Order.create({

//         items: cart.map((item) =>({

//           product: item.product._id,
//           quantity: item.quantity,

//         })),

//         method,
//         user: userId,
//         phone,
//         address,
//         subTotal,
//         paidAt: new Date(),
//         paymentInfo: session_id,

//       });
//       for (let i of order.items) {
//     await Product.findByIdAndUpdate(i.product, {
//       $inc: { stock: -i.quantity, sold: i.quantity },
//     });
//   }

//   await Cart.deleteMany({ user: req.user._id });

//   await sendOrderConfirmation(
//     req.user.email,
//     "Order Confirmation",
//     order._id,
//     items,
//     subTotal
//   );


//   return res.status(201).json({
//     success:true,
//     message: "Order Placed Successfully!",
//     order,
//   })




//     }

    

//   }
//   catch(error)
//   {
//     console.log("Error verifying payment: ", error);

//     res.status(500).json({
//       // success:false,
//       // message: "Failed to verify payment.",
//         message: error.message,

//     });
//   }
// }


export const verifyPayment = TryCatch(async (req, res) => {
  const { session_id } = req.body;

  if (!session_id) {
    return res.status(400).json({
      success: false,
      message: "Session ID is required",
    });
  }

  // 1. Get Stripe session
  const session = await stripe.checkout.sessions.retrieve(session_id);

  if (!session) {
    return res.status(400).json({
      success: false,
      message: "Invalid session",
    });
  }

  const { userId, method, phone, address, subTotal } = session.metadata;

  // 2. Get cart items
  const cart = await Cart.find({ user: userId }).populate("product");

  if (!cart || cart.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Your cart is empty!",
    });
  }

  // 3. Prevent duplicate orders
  const existingOrder = await Order.findOne({ paymentInfo: session_id });

  if (existingOrder) {
    return res.status(200).json({
      success: true,
      message: "Order already placed",
      order: existingOrder,
    });
  }

  // 4. Format items
  const items = cart.map((item) => ({
    product: item.product._id,
    name: item.product.title,
    price: item.product.price,
    quantity: item.quantity,
  }));

  // 5. Create order
  const order = await Order.create({
    items: items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    })),
    method,
    user: userId,
    phone,
    address,
    subTotal,
    paidAt: new Date(),
    paymentInfo: session_id,
  });

  // 6. Update product stock
  for (let i of order.items) {
    await Product.findByIdAndUpdate(i.product, {
      $inc: {
        stock: -i.quantity,
        sold: i.quantity,
      },
    });
  }

  // 7. Clear cart
  await Cart.deleteMany({ user: userId });

  // 8. Send confirmation email (make sure user exists)
  const user = await User.findById(userId);

  if (user) {
    try {
      console.log("Sending email to:", user.email);
      await sendOrderConfirmation(
        user.email,
        "Order Confirmation",
        order._id,
        items,
        subTotal
      );
      console.log("Email sent successfully to:", user.email);
    } catch (emailError) {
      console.log("Email sending failed:", emailError.message);
      // Continue with response even if email fails
    }
  } else {
    console.log("User not found with ID:", userId);
  }

  // 9. Response
  return res.status(201).json({
    success: true,
    message: "Order placed successfully!",
    order,
  });
});

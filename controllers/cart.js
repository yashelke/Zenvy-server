import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import TryCatch from "../utils/TryCatch.js";

export const addToCart = TryCatch(async (req, res) => {
  const { product } = req.body;

  // first check if the product is already in the cart with help of user id and product id
  const cart = await Cart.findOne({
    product: product,
    user: req.user._id,
  }).populate("product");

  if (cart) {
    // Product is already in the cart — check if we can add more
    if (cart.product.stock === cart.quantity) {
      return res.status(400).json({
        message: "Out of Stock!",
      });
    }

    cart.quantity = cart.quantity + 1;
    await cart.save();

    return res.status(200).json({
      message: "Product added to Cart.",
      cart,
    });
  } else {
    // Product is not in the cart yet — check stock before creating
    const cartProduct = await Product.findById(product);

    if (cartProduct.stock === 0) {
      return res.status(400).json({
        message: "Out of Stock",
      });
    }

    const newCart = await Cart.create({
      quantity: 1,
      product: product,
      user: req.user._id,
    });

    return res.status(200).json({
      message: "Product added to Cart.",
      cart: newCart,
    });
  }
});


// controller to remove a product from the cart


export const removeFromCart = TryCatch(async (req, res) => {
  const cart = await Cart.findById(req.params.id);

  if (!cart) {
    return res.status(404).json({
      message: "Cart item not found.",
    });
  }

  await cart.deleteOne();

  res.json({
    message: "Product removed from Cart.",
  });
});

// controller to update the cart

export const updateCart = TryCatch(async (req , res) => {

    const { action } = req.query;

    if(action === "inc") {

        const { id } = req.body;
        const cart = await Cart.findById(id).populate("product");

        if (!cart) return res.status(404).json({ message: "Cart item not found." });

        if(cart.quantity < cart.product.stock) {
            cart.quantity++;
            await cart.save();
    }else
    {
        return res.status(400).json({
            message:"Out of Stock!"
        });
    }
    res.json({
        message:"Cart Updated Successfully!",
        cart,
       
    });

}

    if(action === "dec") {

        const { id } = req.body;
        const cart = await Cart.findById(id).populate("product");

        if (!cart) return res.status(404).json({ message: "Cart item not found." });

        if(cart.quantity > 1) {
            cart.quantity--;
            await cart.save();
        }else
        {
            return res.json({
                message:"You have only 1 item in the cart.",
                cart,
            });
        }

        res.json({
            message:"Cart Updated Successfully!",
            cart,
        });
    }


});


// controller to fetch the cart of the user


export const fetchCart = TryCatch( async(req , res) =>{

  const cart = await Cart.find({user: req.user._id}).populate("product");

  const sumofQuantities = cart.reduce((total, item) => {
     return total + item.quantity;
  }, 0);


  // if the cart is empty then return the response with empty cart 
  if(cart.length === 0) {
    return res.json({
       message: "Your Cart is empty.",
       cart: [],
       subTotal: 0,
       sumofQuantities: 0,
    });
  }

  let subTotal = 0;

  cart.forEach((i) =>{
    const itemSubTotal = i.product.price * i.quantity;
    subTotal += itemSubTotal;
  })

  res.json({
    cart,
    subTotal,
    sumofQuantities,
  });

});
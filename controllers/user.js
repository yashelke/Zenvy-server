// controller for register a user

import TryCatch from "../utils/TryCatch.js";
import { OTP } from "../models/otp.js";
import sendOtp from "../utils/sendOtp.js";
// import {User } from "../models/user.js";
import { User } from "../models/User.js"; // ✅ named import
import jwt from "jsonwebtoken";

// export const loginUser = (req , res) =>
// {
//     try{

//     }
//     catch(error)
//     {
//         res.status(500).json({
//             message:error.message,
//         });
//     }
// }

export const loginUser = TryCatch(async (req, res) => {
  const { email } = req.body;

  const subject = "ECommerce App";

  const otp = Math.floor(Math.random() * 1000000);

  const prevOtp = await OTP.findOne({
    email,
  });

  if (prevOtp) {
    await prevOtp.deleteOne();
  }

  await sendOtp(email, subject, otp);

  await OTP.create({ email, otp });

  res.json({
    message: "OTP sent to your email successfully.",
  });
});

// controller for verifying Users - 
// first we check any otp exists with the email and otp then we check user exists or not 
// if user exists then we generate token and send response
//  if user not exists then we create user and generate token and send response

export const verifyUser = TryCatch(async (req, res) => {
  const { email, otp } = req.body;

  const haveOtp = await OTP.findOne({
    email,
    otp,
  });

  if (!haveOtp) {
    return res.status(400).json({
      message: "Invalid OTP. Please try again.",
    });
  }

  let user = await User.findOne({ email });

  if (user) {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC, {
      expiresIn: "15d",
    });

    await haveOtp.deleteOne();

    res.json({
      message: "User LoggedIn Successfully.",
      token,
      user,
    });
  } else {
    user = await User.create({ email });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC, {
      expiresIn: "15d",
    });

    await haveOtp.deleteOne();

    res.json({
      message: "User LoggedIn Successfully.",
      token,
      user,
    });
  }
});

// controller for fetching user profile - we will use middleware for this route to check authentication and then we will fetch user profile from req.user and send response

export const myProfile = TryCatch(async(req , res) =>
{
  const user = await User.findById(req.user._id);

  res.json({user});

});
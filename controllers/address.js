import { Address } from "../models/Address.js";
``;
import TryCatch from "../utils/TryCatch.js";

export const addAddress = TryCatch(async (req, res) => {
  const { address, phone } = req.body;

  await Address.create({
    address,
    phone,
    user: req.user._id,
  });

  res.status(200).json({
    message: "Address Created Successfully!",
  });
});

// controller to get all the addresses of a user

export const getAllAddress = TryCatch(async (req, res) => {
  const allAddress = await Address.find({ user: req.user._id });

  res.json({
    allAddress,
  });
});

// controller to get a single address of a user

export const getSingleAddress = TryCatch(async (req, res) => {
  const address = await Address.findById(req.params.id);

  // if(!address)
  // {
  //     return res.status(404).json({
  //         message:"Address not found!",
  //     });
  // }

  res.json({
    address,
  });
});

export const deleteAddress = TryCatch(async (req, res) => {

    const address = await Address.findOne({
        _id:req.params.id,
        user:req.user._id,

    })

    if(!address)
    {
        return res.status(404).json({
            message:"Address not found!",
        });
    }

    await address.deleteOne();
//   const address = await Address.findByIdAndDelete(req.params.id);


  res.json({
    message: "Address Deleted Successfully!",
  });


});

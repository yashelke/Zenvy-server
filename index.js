import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import addressRoutes from "./routes/address.js";
import orderRoutes from "./routes/order.js";
import cors from "cors";
// import axios from "axios";

import cloudinary from "cloudinary";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET ,
})

const app = express();



// const url = `https://zenvy-server-fwxd.onrender.com`;
// const interval = 30000;

// function reloadWebsite() {
//   axios
//     .get(url)
//     .then((response) => {
//       console.log("website reloaded");
//     })
//     .catch((error) => {
//       console.error(`Error : ${error.message}`);
//     });
// }

// setInterval(reloadWebsite, interval);

app.use(express.json());
app.use(cors());

app.use("/api",userRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);


// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

const port = process.env.PORT;

(async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
  });
})();

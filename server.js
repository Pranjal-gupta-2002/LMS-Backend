import app from "./app.js";
import { connectDB } from "./config/database.js";
import cloudinary from "cloudinary";
import razorpay from "razorpay";
import nodeCron from "node-cron";
import { Stats } from "./models/Stats.js";

connectDB();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const instance =  new razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });

nodeCron.schedule("0 0 0 1 * *",async()=>{
  try {
    await Stats.create();
  } catch (error) {
    console.log(error);
  }
})

const temp= async()=>{
  await Stats.create({});
}

temp();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

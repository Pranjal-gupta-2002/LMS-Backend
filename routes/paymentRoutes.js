import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { cancelSubscription, createSubscription, getRazorPayKey, paymentVerification } from "../controllers/paymentController.js";

const router = express.Router();

//Buy Subscription 
router.route("/subscribe").get(isAuthenticated,createSubscription);

//payment Verification
router.route("/paymentverification").post(isAuthenticated,paymentVerification);

// Get razor pay key
router.route("/razorpaykey").get(getRazorPayKey);

//cancel subcription
router.route("/subscribe/cancel").delete(isAuthenticated,cancelSubscription);

export default router;
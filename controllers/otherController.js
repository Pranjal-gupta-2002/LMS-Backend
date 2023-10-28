import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { sendEmail } from "../utils/sendEmail.js";
import { Stats } from "../models/Stats.js";

export const contact = catchAsyncError(async (req, res, next) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  const to = process.env.MY_MAIL;

  const subject = "Contact From SIH";
  const text = `I am ${name} and my email is ${email} and my message is ${message} `;

  await sendEmail({ email: email, subject: subject, text });

  res.status(200).json({
    success: true,
    message: "Your message has been sent",
  });
});

export const courseRequest = catchAsyncError(async (req, res, next) => {
  const { name, email, course } = req.body;

  const to = process.env.MY_MAIL;

  const subject = "Request for a CourseFrom SIH";
  const text = `I am ${name} and my email is ${email} and my course is ${course} `;

  await sendEmail({ email: email, subject: subject, text });

  res.status(200).json({
    success: true,
    message: "Your Request has been sent",
  });
});

export const getDashboardStats = catchAsyncError(async (req, res, next) => {
  const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(12);

  const statsData = [];

  for (let i = 0; i < stats.length; i++) {
    statsData.unshift(stats[i]);
  }

  const requiredSize = 12 - stats.length;

  for (let i = 0; i < requiredSize; i++) {
    statsData.unshift({
      users: 0,
      subscription: 0,
      views: 0,
    });
  }

  const usersCount = statsData[11].users;
  const subscriptionCount = statsData[11].subscription;
  const viewsCount = statsData[11].views;

  let usersPercentage = 0;
  let subscriptionPercentage = 0;
  let viewsPercentage = 0;

  let usersProfit = true;
  let subscriptionProfit = true;
  let viewsProfit = true;

  if(statsData[10].users===0) usersPercentage = usersCount * 100;
  if(statsData[10].views===0) viewsPercentage = viewsCount * 100;
  if(statsData[10].subscription===0) 
    subscriptionPercentage = subscriptionCount * 100;

    else{
      const difference = {
        users: statsData[11].users - statsData[10].users,
        subscription: statsData[11].subscription - statsData[10].subscription,
        views: statsData[11].views - statsData[10].views,
      }

      usersPercentage = (difference.users/statsData[10].users) * 100
      subscriptionPercentage = (difference.subscription/statsData[10].subscription) * 100
      viewsPercentage = (difference.views/statsData[10].views) * 100

      if(usersPercentage<0) usersProfit = false;
      if(subscriptionPercentage<0) subscriptionProfit = false;
      if(viewsPercentage<0) viewsProfit = false;
    
    } 
  
  res.status(200).json({
    success: true,
    stats: statsData,
    usersCount,
    subscriptionCount,
    viewsCount,
    subscriptionPercentage,
    usersPercentage,
    viewsPercentage,
    subscriptionProfit,
    usersProfit,
    viewsProfit,
  });
});

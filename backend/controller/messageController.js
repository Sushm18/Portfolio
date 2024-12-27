import { Message } from "../models/messageSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { sendEmail } from "../utils/sendEmail.js";

// export const sendMessage = catchAsyncErrors(async (req, res, next) => {
//   const { senderName, subject, message,email } = req.body;
//   console.log(req.body)
//   if (!senderName || !subject || !message ||   !email) {
//     return next(new ErrorHandler("Please Fill Full Form!", 400));
//   }
//   const data = await Message.create({ senderName, subject, message,email });
//   console.log(data)
//   res.status(201).json({
//     success: true,
//     message: "Message Sent",
//     email,
//     data,
//   });
// });

// const sendEmail = require("../utils/sendEmail"); // Adjust the path as needed

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { senderName, subject, message, email } = req.body;

  console.log(req.body);
  if (!senderName || !subject || !message || !email) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const data = await Message.create({ senderName, subject, message, email });
  console.log(data);

  // Send an email to the portfolio owner (you)
  try {
    await sendEmail({
      email: process.env.SMPT_MAIL, // Send to your email (set in .env)
      subject: `New Message from ${senderName}: ${subject}`,
      message: `You have received a new message from ${senderName} (${email}):\n\n"${message}"\n\nReply to: ${email}`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return next(new ErrorHandler("Failed to send email. Please try again.", 500));
  }

  res.status(201).json({
    success: true,
    message: "Message Sent, and Notification Email Delivered to Portfolio Owner",
    email,
    data,
  });
});


export const deleteMessage = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const message = await Message.findById(id);
  if (!message) {
    return next(new ErrorHandler("Message Already Deleted!", 400));
  }
  await message.deleteOne();
  res.status(201).json({
    success: true,
    message: "Message Deleted",
  });
});

export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const messages = await Message.find();
  res.status(201).json({
    success: true,
    messages,
  });
});

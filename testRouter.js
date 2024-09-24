const express = require("express");
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs');
const userModel = require("./userModel.js");
const { sendEmail } = require("./emailUtil.js");
const SECRET_KEY= process.env.SECRET_KEY;


const testRouter = express.Router();


testRouter.post("/register", async(req,res)=>{
  try{
    const { username, email, password } = req.body;
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      const hashedpassword = await bcrypt.hash(password, 10);
      const result = await userModel.create({
        username: username,
        email: email,
        password: hashedpassword,
      });
      const token = jwt.sign({ email: result.email, id: result._id }, SECRET_KEY);
      return res.status(201).json({ user: result, token: token });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  });

  testRouter.post("/login", async(req,res)=>{
    try{
      const { email, password } = req.body;
      const existingUser = await userModel.findOne({email: email});
      if (!existingUser) {
          return res.status(400).json({ error: "User doesn't exists" });
        }
        const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SECRET_KEY
    );
    res.status(200).json({ user: existingUser, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }});


  testRouter.post("/forgot-password", async(req,res)=>{
    try {
      const { email } = req.body;
      const existingUser = await userModel.findOne({ email: email });
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      // Generate a token for password reset
      const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, SECRET_KEY, { expiresIn: '15m' });
      const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
      // Send email
      const message = `You requested to reset your password. Click on the following link to reset your password: ${resetUrl}`;
      await sendEmail(existingUser.email, "Password Reset Request", message);
      res.status(200).json({ message: "Password reset link sent to email" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });

  testRouter.post("/reset-password", async(req,res)=>{
    try {
      const { token, newPassword } = req.body;
      const decoded = jwt.verify(token, SECRET_KEY);
      const user = await userModel.findOne({ _id: decoded.id });
      if (!user) {
        return res.status(400).json({ message: "Invalid token or user does not exist" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
module.exports = testRouter;
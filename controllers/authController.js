const User = require("../models/user.js");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { request } = require("http");
const { log } = require("console");

exports.register = async (request, reply) => {
  try {
    const { name, email, password } = request.body;
    if (!name || !email || !password) {
      return reply.code(401).send({ message: "All fields required" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save;

    reply.code(201).send({ message: "User Registered Successfully" });
  } catch (error) {
    reply.send(error);
  }
};

exports.login = async (request, reply) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return reply.code(400).send({ message: "All fields required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return reply.code(400).send({ message: "Don't have a account  " });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return reply.code(400).send({ message: "Password is incorrect" });
    }

    const token = request.server.jwt.sign({ id: user._id });
    reply.send({ token });
  } catch (error) {
    reply.send(error);
  }
};

exports.forgotPassword = async (request, reply) => {
  try {
    const { email } = request.body;
    if (!email) {
      return reply.code(400).send({ message: "All fields required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return reply.code(400).send({ message: "Don't have a account  " });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    const resetPasswordToken = resetToken;
    const resetPasswordExpiry = resetPasswordExpire;

    await user.save({ validateBeforeSave: false });

    const resetUrl = `http://localhost:${process.env.PORT}/api/auth/reset-password/${resetToken}`;

    reply.send({ resetUrl });
  } catch (error) {
    reply.send(error);
  }
};

exports.resetPassword = async (request, reply) => {
  try {
    const resetPassword = request.params.token;
    const { newPassword } = request.body;

    const user = new User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return reply
        .code(400)
        .send({ message: "Invalid or expired reset password token" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    reply.send({ message: "Password reset successfully" });
  } catch (error) {
    reply.send(error);
  }
};


exports.logout = async(request, reply) =>{
    try {
        
    } catch (error) {
    reply.send(error);
        
    }
}
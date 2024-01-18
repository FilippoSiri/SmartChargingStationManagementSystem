"use strict";
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ResetPasswordToken = require("../models/ResetPasswordToken");
const router = express.Router();
const { verifyToken, verifyTokenResetPassword } = require("../middleware/authMiddleware");
const nodeMailer = require("nodemailer");

//TODO: Check status code
router.post("/register", async (req, res) => {
    console.log(req.body);
    if(await User.getByEmail(req.body.email) !== null) {
        res.status(409).json({ message: "Email already registered" });
        return;
    }
    const newUser = new User(null, req.body.name, req.body.surname, req.body.email, req.body.password, 0, new Date(), false);
    const addedUser = await newUser.save();
    
    if (addedUser !== null) {
        const token = generateAccessToken({ userId: addedUser.id, isAdmin: addedUser.is_admin }, null);
        res.status(201).json({ token: token });
    } else {
        res.status(500).json({ message: "Error adding user" });
    }
});

router.post("/login", async (req, res) => {
    console.log(req.body);
    const user = await User.login(req.body.email, req.body.password);
    if (user !== null) {
        const token = generateAccessToken({
            userId: user.id,
            isAdmin: user.is_admin,
        }, null);
        res.json({ token: token });
    } else {
        res.status(401).json({ message: "Login failed" });
    }
});

router.get("/validateToken", verifyToken, async (req, res) => {
    res.json({ message: "Valid token" });
});

router.get("/resetPasswordToken", async (req, res) => {
    if(!req.body.email){
        res.status(400).json({ message: "Missing email" });
        return;
    }

    const transporter = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const token = generateAccessToken({
        email: req.body.email
    }, 900);;

    const resetPasswordToken = new ResetPasswordToken(null, req.body.email, token, new Date(), false);
    resetPasswordToken.save();

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: req.body.email,
        subject: 'Reset your password',
        text: `Hello, you can reset your password here: http://${process.env.API_BASE_URL}:${process.env.PORT}/auth/resetPasswordPage?token=${token}`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            res.status(500).json({ message: "Error sending email" });
        } else {
            res.json({ message: "Email sent" });
        }
    });
});

router.get("/resetPasswordPage", verifyTokenResetPassword, async (req, res) => {
    return res.render('resetPassword', { email: req.email, url: `http://${process.env.API_BASE_URL}:${process.env.PORT}/auth/resetPassword?token=${req.query.token}` });
});


router.post("/resetPassword", verifyTokenResetPassword, async (req, res) => {
    if(!req.body.email || !req.body.password){
        res.status(400).json({ message: "Missing email or password" });
        return;
    }

    var token = await ResetPasswordToken.getByToken(req.query.token);
    if(token === null || token.used){
        res.status(400).json({ message: "Invalid token" });
        return;
    }

    const user = await User.getByEmail(req.body.email);
    if (user !== null) {
        token.used = true;
        token.save();
        user.password = req.body.password;
        user.token_reset_time = new Date();
        const updatedUser = await user.save();
        if(updatedUser !== null){
            res.json({ message: "Password updated" });
        } else {
            res.status(500).json({ message: "Error updating password" });
        }
    } else {
        res.status(401).json({ message: "Email not registered" });
    }
});


//TODO: Check expiration
function generateAccessToken(data, expirationTime) {
    if(expirationTime !== null) 
        return jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: `${expirationTime}s` }); 
    return jwt.sign(data, process.env.JWT_SECRET_KEY);
}
module.exports = router;

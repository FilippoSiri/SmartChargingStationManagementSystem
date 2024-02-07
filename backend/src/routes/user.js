"use strict";
const express = require("express");
const User = require("../models/User");
const { verifyToken, verifyTokenAdmin } = require("../middleware/authMiddleware");
const router = express.Router();
const jwt = require("jsonwebtoken");


router.get("/all", async (req, res) => {
    const users = await User.getAll();
    res.json(users);
});


router.get("/", verifyToken, async (req, res) => {
    const user = await User.getById(req.userId);
    if (user !== null) {
        res.json(user);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

//TODO: Check status code
router.patch("/", verifyToken, async (req, res) => {
    const user = await User.getById(req.userId);
    if (user !== null) {
        if (req.body.name !== undefined) user.name = req.body.name;

        if (req.body.surname !== undefined) user.surname = req.body.surname;

        if (req.body.email !== undefined) user.email = req.body.email;

        if (req.body.password !== undefined) {
            user.password = req.body.password;
            user.token_reset_time = new Date();
        }

        const updatedUser = await user.save();
        if (updatedUser !== null) {
            if (req.body.password !== undefined) {
                const token = generateAccessToken({ userId: updatedUser.id, isAdmin: updatedUser.is_admin }, null);
                res.status(201).json({ token: token });
            } else
            res.status(201).json({ message: "User updated" });
        } else {
            res.status(500).json({ message: "Error updating user" });
        }
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

router.patch("/set_user_admin/:id", verifyTokenAdmin, async (req, res) => {
    const user = await User.getById(req.params.id);
    if (user !== null) {
        user.is_admin = req.body.is_admin;
        const updatedUser = await user.save();
        if (updatedUser !== null) {
            res.status(201).json(updatedUser);
        } else {
            res.status(500).json({ message: "Error updating user" });
        }
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

function generateAccessToken(data, expirationTime) {
    if(expirationTime !== null) 
        return jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: `${expirationTime}s` }); 
    return jwt.sign(data, process.env.JWT_SECRET_KEY);
}

module.exports = router;

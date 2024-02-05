"use strict";
const express = require("express");
const User = require("../models/User");
const { verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", async (req, res) => {
    const users = await User.getAll();
    res.json(users);
});

router.get("/getById/:id", async (req, res) => {
    const user = await User.getById(req.params.id);
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
            res.status(201).json(updatedUser);
        } else {
            res.status(500).json({ message: "Error updating user" });
        }
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

router.patch("/set_user_admin/:id", verifyToken, async (req, res) => {
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

module.exports = router;

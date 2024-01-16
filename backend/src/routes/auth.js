'use strict';
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
//TODO: Check status code
router.post('/register', async (req, res) => {
    console.log(req.body);
    const newUser = new User(null, req.body.name, req.body.surname, req.body.email, req.body.password, 0, new Date());
    const addedUser = await newUser.save();
    if (addedUser !== null) {
        const token = generateAccessToken({ userId: addedUser.id });
        res.status(201).json({token: token});
    } else {
        res.status(500).json({ message: 'Error adding user' });
    }
});

router.post('/login', async (req, res) => {
    console.log(req.body);
    const user = await User.login(req.body.email, req.body.password);
    if (user !== null) {
        const token = generateAccessToken({ userId: user.id });
        res.json({token: token});
    } else {
        res.status(401).json({ message: 'Login failed' });
    }
});

router.get('/validateToken', verifyToken, async (req, res) => {
    res.json({ message: 'Valid token' });
});
//TODO: Check expiration
function generateAccessToken(data) {
    return jwt.sign(data, process.env.JWT_SECRET_KEY);
    //return jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: '1800s' });
}
module.exports = router;

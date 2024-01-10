'use strict';
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const router = express.Router();
//TODO: Check status code
router.post('/register', async (req, res) => {
    const newUser = new User(null, req.body.name, req.body.surname, req.body.email, req.body.password, req.body.balance);
    const addedUser = await newUser.save();
    if (addedUser !== null) {
        res.status(201).json(addedUser);
    } else {
        res.status(500).json({ message: 'Error adding user' });
    }
});

router.post('/login', async (req, res) => {
    const user = await User.login(req.body.email, req.body.password);
    if (user !== null) {
        const token = jwt.sign({ userId: user.id }, 'your-secret-key', {
            expiresIn: '1h',
        });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Login failed' });
    }
});

module.exports = router;
//



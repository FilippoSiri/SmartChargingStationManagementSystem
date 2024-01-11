'use strict';
const express = require('express');
const User = require('../models/User'); 
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', async (req, res) => {
    const stations = await User.getAll();
    res.json(stations);
});

router.get('/getById/:id', async (req, res) => {
    const user = await User.getById(req.params.id);
    if (user !== null) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

//TODO: Check status code
router.patch('/', async (req, res) => {
    const user = await User.getById(req.body.id);
    if (user !== null) {
        user.name = req.body.name;
        user.surname = req.body.surname;
        user.email = req.body.email;
        user.password = req.body.password;
        user.balance = req.body.balance;
        const updatedUser = await user.save();
        if (updatedUser !== null) {
            res.status(201).json(updatedUser);
        } else {
            res.status(500).json({ message: 'Error updating user' });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});


// Protected route
router.get('/testVerify', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Protected route accessed ' + req.userId });
});

module.exports = router;
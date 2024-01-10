'use strict';
const express = require('express');
const User = require('../models/User'); 
const router = express.Router();

router.get('/', async (req, res) => {
    const stations = await User.getAll();
    res.json(stations);
});

router.get('/:id', async (req, res) => {
    const user = await User.getById(req.params.id);
    if (user !== null) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});
//TODO: Check status code
router.post('/', async (req, res) => {
    const newUser = new User(null, req.body.name, req.body.surname, req.body.email, req.body.passwordHash, req.body.balance);
    const addedUser = await newUser.save();
    if (addedUser !== null) {
        res.status(201).json(addedUser);
    } else {
        res.status(500).json({ message: 'Error adding user' });
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

module.exports = router;
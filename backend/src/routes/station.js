'use strict';
const express = require('express');
const Station = require('../models/station');
const router = express.Router();
  
router.get('/', async (req, res) => {
    const stations = await Station.getAll();
    res.json(stations);
});

router.get('/:id', async (req, res) => {
    const station = await Station.getById(req.params.id);
    if (station !== null) {
        res.json(station);
    } else {
        res.status(404).json({ message: 'Station not found' });
    }
});
//TODO: Check status code
router.post('/', async (req, res) => {
    const newStation = new Station(null, req.body.name, req.body.lat, req.body.lon, req.body.price, req.body.power, req.body.status);
    const addedStation = await newStation.save();
    if (addedStation !== null) {
        res.status(201).json(addedStation);
    } else {
        res.status(500).json({ message: 'Error adding station' });
    }
});
//TODO: Check status code
router.patch('/', async (req, res) => {
    const station = await Station.getById(req.body.id);
    if (station !== null) {
        station.name = req.body.name;
        station.lat = req.body.lat;
        station.lon = req.body.lon;
        station.price = req.body.price;
        station.power = req.body.power;
        station.status = req.body.status;
        const updatedStation = await station.save();
        if (updatedStation !== null) {
            res.status(201).json(updatedStation);
        } else {
            res.status(500).json({ message: 'Error updating station' });
        }
    } else {
        res.status(404).json({ message: 'Station not found' });
    }
});


module.exports = router;
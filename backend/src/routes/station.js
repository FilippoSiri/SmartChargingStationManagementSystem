'use strict';
const express = require('express');
//var stationModel = require('../models/station');
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

router.post('/', async (req, res) => {
    const newStation = new Station(req.body.name, req.body.lat, req.body.lon, req.body.price, req.body.power, req.body.status);
    const addedStation = await newStation.save();
    if (addedStation !== null) {
        res.status(201).json(addedStation);
    } else {
        res.status(500).json({ message: 'Error adding station' });
    }
});


module.exports = router;
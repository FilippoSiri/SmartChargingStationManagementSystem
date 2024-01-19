"use strict";
const express = require("express");
const Station = require("../models/Station");
const StationUsage = require("../models/StationUsage");
const {
    verifyToken,
    verifyTokenAdmin,
} = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", async (req, res) => {
    const stations = await Station.getAll();
    res.json(stations);
});

router.get("/:id", async (req, res) => {
    const station = await Station.getById(req.params.id);
    if (station !== null) {
        res.json(station);
    } else {
        res.status(404).json({ message: "Station not found" });
    }
});
//TODO: Check status code
router.post("/", async (req, res) => {
    const newStation = new Station(
        null,
        req.body.name,
        req.body.lat,
        req.body.lon,
        req.body.price,
        req.body.power,
        req.body.dismissed,
        req.body.last_heartbeat,
        req.body.notes,
        Station.STATUS.FREE
    );
    const addedStation = await newStation.save();
    if (addedStation !== null) {
        res.status(201).json(addedStation);
    } else {
        res.status(500).json({ message: "Error adding station" });
    }
});
//TODO: Check status code
router.patch("/", verifyTokenAdmin, async (req, res) => {
    const station = await Station.getById(req.body.id);
    console.log(station)
    if (station !== null) {
        if (req.body.name !== undefined)
            station.name = req.body.name;
        if (req.body.lat !== undefined)
            station.lat = req.body.lat;
        if (req.body.lon !== undefined)
            station.lon = req.body.lon;
        if (req.body.price !== undefined)
            station.price = req.body.price;
        if (req.body.power !== undefined)
            station.power = req.body.power;
        if (req.body.dismissed !== undefined)
            station.dismissed = req.body.dismissed;
        if (req.body.last_heartbeat !== undefined)
            station.last_heartbeat = req.body.last_heartbeat;
        if (req.body.notes !== undefined)
            station.notes = req.body.notes;
        console.log(station)
        const updatedStation = await station.save();
        if (updatedStation !== null) {
            res.status(201).json(updatedStation);
        } else {
            res.status(500).json({ message: "Error updating station" });
        }
    } else {
        res.status(404).json({ message: "Station not found" });
    }
});

router.post("/reserve/", verifyToken, async (req, res) => {
    const stationId = req.body.id;
    const userId = req.userId;

    const station = await Station.getById(stationId);
    if (station === null)
        return res.status(404).json({ message: "Station not found" });

    if (station.status !== Station.STATUS.FREE)
        return res.status(409).json({message: "Station is currently not available for reservation"});

    const stationUsage = new StationUsage();
    stationUsage.station_id = stationId;
    stationUsage.user_id = userId;
    stationUsage.reservation_time = new Date();
    stationUsage.price = station.price;

    const savedStationUsage = await stationUsage.save();

    if (savedStationUsage !== null) {
        res.status(201).json(savedStationUsage);
    } else {
        res.status(500).json({ message: "Error reserving station" });
    }
});

module.exports = router;

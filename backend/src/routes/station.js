"use strict";
const express = require("express");
const Station = require("../models/Station");
const StationUsage = require("../models/StationUsage");
const RPCStation = require("../utils/RPCStation");
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

router.get("/:id/last_usage", async (req, res) => {
    const stationUsage = await StationUsage.getLastUsageByStationId(req.params.id);
    res.json(stationUsage);
});

router.get("/:id/last_reservation", async (req, res) => {
    const stationUsage = await StationUsage.getLastReservationByStationId(req.params.id);
    res.json(stationUsage);
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
        req.body.description,
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
        if (req.body.description !== undefined)
            station.description = req.body.description;
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

router.post("/start_charging/", verifyToken, async (req, res) => {
    let savedStationUsage = null;
    const stationId = req.body.id;
    const userId = req.userId;

    const station = await Station.getById(stationId);
    if (station === null)
        return res.status(404).json({ message: "Station not found" });

    if (station.status === Station.STATUS.RESERVED) {
        const lastStationReservation = await StationUsage.getLastReservationByStationId(stationId);

        if (lastStationReservation.user_id != userId)
            return res.status(409).json({message: "Station is currently not available for charging"});

        lastStationReservation.start_time = new Date();
        lastStationReservation.end_time = null;

        savedStationUsage = await lastStationReservation.save();
    } else {
        const stationUsage = new StationUsage();
        stationUsage.station_id = stationId;
        stationUsage.user_id = userId;
        stationUsage.start_time = new Date();
        stationUsage.price = station.price;

        savedStationUsage = await stationUsage.save();
    }

    if (savedStationUsage !== null) {
        res.status(201).json(savedStationUsage);
    } else {
        res.status(500).json({ message: "Error starting charging" });
    }

});

router.post("/stop_charging/", verifyToken, async (req, res) => {
    const stationId = req.body.id;
    const userId = req.userId;

    const station = await Station.getById(stationId);
    if (station === null)
        return res.status(404).json({ message: "Station not found" });

    if (station.status !== Station.STATUS.USED)
        return res.status(409).json({message: "Station is currently not available for stopping charging"});

    const lastStationUsage = await StationUsage.getLastUsageByStationId(stationId);

    if (lastStationUsage.user_id != userId)
        return res.status(409).json({message: "You can't stop charging for another user"});

    lastStationUsage.end_time = new Date();

    const savedStationUsage = await lastStationUsage.save();

    if (savedStationUsage !== null) {
        res.status(201).json(savedStationUsage);
    } else {
        res.status(500).json({ message: "Error stopping charging" });
    }
});



module.exports = router;

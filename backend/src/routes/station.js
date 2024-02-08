"use strict";
const express = require("express");
const StationService = require("../services/StationService");
const {
    verifyToken,
    verifyTokenAdmin,
} = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", async (req, res) => {
    res.json(await StationService.getAll());
});

function getCorrectError(error) {
    switch (error.message) {
        case "Station not found":
            return res.status(404).json({ message: error.message });
        case "Station is currently not available for reservation":
        case "Station is currently not available for cancelling reservation":
        case "You can't cancel reservation for another user":
        case "Station is currently not available for charging":
        case "Station is currently not available for stopping charging":
        case "You can't stop charging for another user":
            return res.status(409).json({ message: error.message });
        default:
            return res.status(500).json({ message: error.message });
    }
}

router.get("/:id", async (req, res) => {
    try {
        const stationId = req.params.id;
        const userId = req.userId;
        const savedStationUsage = await StationService.startCharging(stationId, userId);
        res.json(savedStationUsage);
    } catch (error) {
        getCorrectError(error);
    }
});

router.get("/:id/last_usage", async (req, res) => {
    res.json(await StationService.getLastUsageByStationId(req.params.id));
});

router.get("/:id/last_reservation", async (req, res) => {
    res.json(await StationService.getLastReservationByStationId(req.params.id));
});

router.post("/:id/reserve", verifyToken, async (req, res) => {
    try {
        const stationId = req.params.id;
        const userId = req.userId;
        const savedStationUsage = await StationService.reserve(stationId, userId);
        res.status(201).json(savedStationUsage);
    } catch (error) {
        getCorrectError(error);
    }
});

router.post("/:id/cancel_reservation", verifyToken, async (req, res) => {
    try {
        const stationId = req.params.id;
        const userId = req.userId;
        const savedStationUsage = await StationService.cancelReservation(stationId, userId);
        res.status(201).json(savedStationUsage);
    } catch (error) {
        getCorrectError(error);
    }
});

router.post("/:id/start_charging/", verifyToken, async (req, res) => {
    try {
        const stationId = req.params.id;
        const userId = req.userId;
        const savedStationUsage = await StationService.startCharging(stationId, userId);
        res.status(201).json(savedStationUsage);
    } catch (error) {
        getCorrectError(error);
    }
});

router.post("/:id/stop_charging/", verifyToken, async (req, res) => {
    try {
        const stationId = req.params.id;
        const userId = req.userId;
        const savedStationUsage = await StationService.stopCharging(stationId, userId);
        res.status(201).json(savedStationUsage);
    } catch (error) {
        getCorrectError(error);
    }
});

//TODO: Check status code
router.post("/", async (req, res) => {
    try {
        const newStation = await StationService.add(
            req.body.name,
            req.body.lat,
            req.body.lon,
            req.body.price,
            req.body.power,
            req.body.dismissed,
            req.body.last_heartbeat,
            req.body.notes,
            req.body.description
        );
        res.status(201).json(newStation);
    } catch (error) {
        getCorrectError(error);
    }
});
//TODO: Check status code
router.patch("/", verifyTokenAdmin, async (req, res) => {
    try {
        const station = await StationService.update(
            req.body.id,
            req.body.name,
            req.body.lat,
            req.body.lon,
            req.body.price,
            req.body.power,
            req.body.dismissed,
            req.body.last_heartbeat,
            req.body.notes,
            req.body.description
        );
        res.status(201).json(station);
    } catch (error) {
        getCorrectError(error);
    }
});

module.exports = router;

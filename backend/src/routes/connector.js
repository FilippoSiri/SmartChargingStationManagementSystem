"use strict";
const express = require("express");
const ConnectorService = require("../services/ConnectorService");
const {
    verifyTokenAdmin,
} = require("../middleware/authMiddleware");
const router = express.Router();

function getCorrectError(error, res) {
    switch (error.message) {
        case "Connector not found":
            return res.status(404).json({ message: error.message });
        default:
            return res.status(500).json({ message: error.message });
    }
}

router.get("/", async (req, res) => {
    res.json(await ConnectorService.getAll());
});

router.get("/:id", async (req, res) => {
    try {
        const connectorId = req.params.id;
        const connector = await StationService.getById(connectorId);
        res.json(connector);
    } catch (error) {
        return getCorrectError(error, res);
    }
});
//TODO: Check status code
router.post("/", verifyTokenAdmin, async (req, res) => {
    try {
        const newConnector = await ConnectorService.add(
            req.body.name,
            req.body.power
        );
        res.status(201).json(newConnector);
    } catch (error) {
        return getCorrectError(error, res);
    }
});
//TODO: Check status code
router.patch("/", verifyTokenAdmin, async (req, res) => {
    try {
        const connector = await ConnectorService.update(
            req.body.id,
            req.body.name,
            req.body.power
        );
        res.status(201).json(connector);
    } catch (error) {
        return getCorrectError(error, res);
    }
});

module.exports = router;

"use strict";
const express = require("express");
const router = express.Router();

/*Central System to Charging Station*/ 

router.post('/:identity/starttransaction', async (req, res, next) => {
    try {

        const client = allClients.get(req.params.identity);

        if (!client) {
            throw Error("Client not found");
        }
        /*
        To add link to DB
        */ 
        const response = await client.call('RemoteStartTransaction', {
            connectorId: 1, // start on connector 1
            idTag: 'XXXXXXXX', // using an idTag with identity 'XXXXXXXX'
        });

        if (response.status === 'Accepted') {
            console.log('Remote start worked!');
        } else {
            console.log('Remote start rejected.');
        }

    } catch (err) {
        next(err);
    }
});

router.post('/:identity/remotestoptransaction', async (req, res, next) => {
    try {
        const client = allClients.get(req.params.identity);

        if (!client) {
            throw Error("Client not found");
        }
        /*
        To add link to DB
        */ 
        const response = await client.call('RemoteStopTransaction', {
            transactionId: req.body.transactionId,
        });

        if (response.status === 'Accepted') {
            console.log('Remote stop worked!');
        } else {
            console.log('Remote stop rejected.');
        }

    } catch (err) {
        next(err);
    }
});

router.post('/:identity/cancelreservation', async (req, res, next) => {
    try {
        const client = allClients.get(req.params.identity);

        if (!client) {
            throw Error("Client not found");
        }
        /*
        To add link to DB
        */ 
        const response = await client.call('CancelReservation', {
            reservationId: req.body.reservationId,
        });

        if (response.status === 'Accepted') {
            console.log('Reservation cancellation worked!');
        } else {
            console.log('Reservation cancellation rejected.');
        }

    } catch (err) {
        next(err);
    }
});

router.post('/:identity/changeavailability', async (req, res, next) => {
    try {
        const client = allClients.get(req.params.identity);

        if (!client) {
            throw Error("Client not found");
        }
        /*
        To add link to DB
        */ 
        const response = await client.call('ChangeAvailability', {
            connectorId: req.body.connectorId,
            type: req.body.type,
        });

        if (response.status === 'Accepted') {
            console.log('Availability change worked!');
        } else {
            console.log('Availability change rejected.');
        }

    } catch (err) {
        next(err);
    }
});

/*Charging Station to Central System*/ 

router.post('/:identity/bootnotification', async (req, res, next) => {
    try {
        const client = allClients.get(req.params.identity);

        if (!client) {
            throw Error("Client not found");
        }
        /*
        To add link to DB
        */ 
        const response = await client.call('BootNotification', {
            chargePointVendor: req.body.chargePointVendor,
            chargePointModel: req.body.chargePointModel,
        });

        console.log('BootNotification status:', response.status);

    } catch (err) {
        next(err);
    }
});

router.post('/:identity/heartbeat', async (req, res, next) => {
    try {
        const client = allClients.get(req.params.identity);

        if (!client) {
            throw Error("Client not found");
        }
        /*
        To add link to DB
        */ 
        const response = await client.call('Heartbeat', {});

        console.log('Heartbeat time:', response.currentTime);

    } catch (err) {
        next(err);
    }
});

router.post('/:identity/starttransaction', async (req, res, next) => {
    try {
        const client = allClients.get(req.params.identity);

        if (!client) {
            throw Error("Client not found");
        }
        /*
        To add link to DB
        */ 
        const response = await client.call('StartTransaction', {
            connectorId: req.body.connectorId,
            idTag: req.body.idTag,
            timestamp: req.body.timestamp,
            meterStart: req.body.meterStart,
        });

        console.log('StartTransaction status:', response.status);

    } catch (err) {
        next(err);
    }
});

router.post('/:identity/statusnotification', async (req, res, next) => {
    try {
        const client = allClients.get(req.params.identity);

        if (!client) {
            throw Error("Client not found");
        }
        /*
        To add link to DB
        */ 
        const response = await client.call('StatusNotification', {
            connectorId: req.body.connectorId,
            status: req.body.status,
            errorCode: req.body.errorCode,
        });

        console.log('StatusNotification status:', response.status);

    } catch (err) {
        next(err);
    }
});

router.post('/:identity/stoptransaction', async (req, res, next) => {
    try {
        const client = allClients.get(req.params.identity);

        if (!client) {
            throw Error("Client not found");
        }
        /*
        To add link to DB
        */ 
        const response = await client.call('StopTransaction', {
            transactionId: req.body.transactionId,
            timestamp: req.body.timestamp,
            meterStop: req.body.meterStop,
        });

        console.log('StopTransaction status:', response.status);

    } catch (err) {
        next(err);
    }
});
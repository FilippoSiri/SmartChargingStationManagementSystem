"use strict";
require("dotenv").config();
const express = require("express");
const stationRouter = require("./routes/station");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const connectorRouter = require("./routes/connector");
const RPCStation = require("./services/RPCStationService");
const StationService = require("./services/StationService");
const { HEARTBEAT_TIME } = require("./utils/constants");

const { RPCServer, createRPCError } = require('ocpp-rpc');

const server = new RPCServer({
    protocols: ['ocpp1.6'], // server accepts ocpp1.6 subprotocol
    strictMode: true,       // enable strict validation of requests & responses
});

server.auth((accept, reject, handshake) => {
    // accept the incoming client
    accept({
        // anything passed to accept() will be attached as a 'session' property of the client.
        sessionId: 'XYZ123'
    });
});

server.on('client', async (client) => {
    console.log(`${client.session.sessionId} connected!`); // `XYZ123 connected!`
    RPCStation.addStation(client);
    console.log('Id:', client.identity);

    client.handle('BootNotification', ({params}) => {
        console.log(`Server got BootNotification from ${client.identity}:`, params);

        // respond to accept the client
        return {
            status: "Accepted",
            interval: HEARTBEAT_TIME, 
            currentTime: new Date().toISOString()
        };
    });
    
    client.handle('Heartbeat', async ({params}) => {
        console.log(`Server got Heartbeat from ${client.identity}:`, params);
        const station = await StationService.getById(client.identity);
        station.last_heartbeat = new Date();
        await station.save();
        // respond with the server's current time.
        return {
            currentTime: new Date().toISOString()
        };
    });
    
    client.handle('StatusNotification', ({params}) => {
        console.log(`Server got StatusNotification from ${client.identity}:`, params);
        return {};
    });

    client.handle('MeterValues', async ({params}) => {
        console.log(`Server got MeterValues from ${client.identity}:`, params.meterValue[0].sampledValue[0].value);
        const valueEnergy = params.meterValue[0].sampledValue[0].value;
        
        console.log(`\nvalueEnergy: ${valueEnergy}`);

        const lastStationUsage = await StationService.getLastUsageByStationId(client.identity);
        lastStationUsage.kw = parseFloat(valueEnergy)/1000;
        await lastStationUsage.save();

        return {};
    });

    client.handle('Authorize', ({params}) => {
        console.log(`Server got Authorize from ${client.identity}:`, params);
        return {
            idTagInfo: {
                status: "Accepted"
            }
        };
    });

    client.handle('StartTransaction', async ({params}) => {
        //Chiamare funzioni di controllo
        //Creare transazione sul db e restituire transactionId
        
        const newUsage = await StationService.createTransaction(client.identity, params.idTag);

        console.log(`newUsage: ${newUsage}`);

        console.log(`\nServer got StartTransaction from ${client.identity}:`, params);
        return {
            transactionId: newUsage.id,
            idTagInfo: {
                status: "Accepted"
            }
        };
    });

    client.handle('StopTransaction', async ({params}) => {
        console.log(`Server got StopTransaction from ${client.identity}:`, params);
        //params contiene transactionId e meterStop e timestamp
        //TODO chiamare servizio che cerca di fermare la transazione

        console.log(`\nServer got StopTransaction from ${client.identity}:`, params);
        const valueEnergy = params.meterStop;

        const lastStationUsage = await StationService.getLastUsageByStationId(client.identity);

        lastStationUsage.kw = valueEnergy/1000;
        lastStationUsage.end_time = new Date();

        await lastStationUsage.save();

        console.log(`\nFinito StopTransaction`);

        let cancellazione = true;
        if(cancellazione){
            return {
                idTagInfo: {
                    status: "Accepted"
                }
            }
        }else{
            return {
                idTagInfo: {
                    status: "Rejected"
                }
            }
        }
    });

    client.handle(({method, params}) => {
        // This handler will be called if the incoming method cannot be handled elsewhere.
        console.log(`Server got ${method} from ${client.identity}:`, params);

        // throw an RPC error to inform the server that we don't understand the request.
        throw createRPCError("NotImplemented");
    });

});

const rpcPort = process.env.RPC_PORT || 3001;
server.listen(rpcPort);
console.log(`Listening RPC Server on port ${rpcPort}...`)

const cors = require("cors");
var path = require('path');
const e = require("express");

const app = express();

app.use(
    cors({
        origin: `http://localhost:${process.env.FE_PORT}`,
    })
);

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


app.use(express.json());

app.use("/station", stationRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/connector", connectorRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // send the error as json
    res.status(err.status || 500);
    res.json({ error: err.message });
});

// start node server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = app;

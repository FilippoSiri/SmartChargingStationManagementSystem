"use strict";
require("dotenv").config();
const express = require("express");
const stationRouter = require("./routes/station");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const RPCStation = require("./utils/RPCStation");

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
            interval: 300,
            currentTime: new Date().toISOString()
        };
    });
    
    client.handle('Heartbeat', ({params}) => {
        console.log(`Server got Heartbeat from ${client.identity}:`, params);

        // respond with the server's current time.
        return {
            currentTime: new Date().toISOString()
        };
    });
    
    client.handle('StatusNotification', ({params}) => {
        console.log(`Server got StatusNotification from ${client.identity}:`, params);
        return {};
    });

    client.handle('MeterValues', ({params}) => {
        console.log(`Server got MeterValues from ${client.identity}:`, params);
        return {};
    });

    client.handle('Authorize', ({params}) => {
        console.log(`Server got Authorize from ${client.identity}:`, params);
        return {};
    });

    client.handle('StartTransaction', ({params}) => {
        //Chiamare funzioni di controllo
        console.log(`Server got StartTransaction from ${client.identity}:`, params);
        return {
            transactionId: 1234,
            idTagInfo: {
                status: "Accepted"
            }
        };
    });

    client.handle('StopTransaction', ({params}) => {
        console.log(`Server got StopTransaction from ${client.identity}:`, params);
        return {
            idTagInfo: {
                status: "Accepted"
            }
        };
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

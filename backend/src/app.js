"use strict";
require("dotenv").config();
const express = require("express");
const stationRouter = require("./routes/station");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const cors = require("cors");
const { RPCServer, RPCClient } = require("ocpp-rpc");

const app = express();

app.use(
    cors({
        origin: `http://localhost:${process.env.FE_PORT}`,
    })
);

const httpServer = app.listen(process.env.RPC_PORT, "localhost");
const rpcServer = new RPCServer();
httpServer.on("upgrade", rpcServer.handleUpgrade);

rpcServer.on("client", (client) => {
    client.call("Say", `Hello, ${client.identity}!`);
});

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

const {RPCServer, RPCClient} = require('ocpp-rpc');
const express = require('express');

const app = express();
const httpServer = app.listen(3000, 'localhost');

const rpcServer = new RPCServer();
httpServer.on('upgrade', rpcServer.handleUpgrade);

rpcServer.on('client', client => {
    // RPC client connected
    client.call('Say', `Hello, ${client.identity}!`);
});

// create a simple client to connect to the server
const cli = new RPCClient({
    endpoint: 'ws://localhost:3000',
    identity: 'XYZ123'
});



const start = async function avvio(){await cli.connect();}

start();
cli.handle('Say', ({params}) => {
    console.log('Server saids:', params);
});
cli.handle('Say', ({params}) => {
    console.log('Server saidss:', params);
});
//cli.connect()
const { RPCClient } = require('ocpp-rpc');

const cli = new RPCClient({
    endpoint: 'ws://localhost:3000', // the OCPP endpoint URL
    identity: 'testClaudio',             // the OCPP identity
    protocols: ['ocpp1.6'],          // client understands ocpp1.6 subprotocol
    strictMode: true,                // enable strict validation of requests & responses
});

const connettiti = async function connecta(){await cli.connect()};

// connect to the OCPP server
connettiti();

// send a BootNotification request and await the response
async function testGlobale(){
    const bootResponse = await cli.call('BootNotification', {
        chargePointVendor: "ocpp-rpc",
        chargePointModel: "ocpp-rpc",
    });
    
    // check that the server accepted the client
    if (bootResponse.status === 'Accepted') {
    
        // send a Heartbeat request and await the response
        const heartbeatResponse = await cli.call('Heartbeat', {});
        // read the current server time from the response
        console.log('Server time is:', heartbeatResponse.currentTime);
    
        // send a StatusNotification request for the controller
        await cli.call('StatusNotification', {
            connectorId: 0,
            errorCode: "NoError",
            status: "Available",
        });
    }
} 

testGlobale();
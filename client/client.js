const { RPCClient } = require('ocpp-rpc');
const readline = require('readline');
require('dotenv').config();

const possibleStatus = {
    Available: 'Available',
    Charging: 'Charging',
    Finishing: 'Finishing',
    Reserved: 'Reserved',
    Unavailable: 'Unavailable',
    Faulted: 'Faulted'
};

const possibleReasonStopTransaction = {
    EmergencyStop: 'EmergencyStop',
    EVDisconnected: 'EVDisconnected',
    HardReset: 'HardReset',
    Local: 'Local',
    Other: 'Other',
    PowerLoss: 'PowerLoss',
    Reboot: 'Reboot',
    Remote: 'Remote',
    SoftReset: 'SoftReset',
    UnlockCommand: 'UnlockCommand',
    DeAuthorized: 'DeAuthorized'
}
  
var transactionId;
var reservationId = 5000;
var timerHeartbeat;
var status = possibleStatus.Available;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

const cli = new RPCClient({
    endpoint: `ws://${process.env.RPC_URL}:${process.env.RPC_PORT}`, // the OCPP endpoint URL
    identity: process.env.STATION_ID,             // the OCPP identity
    protocols: ['ocpp1.6'],          // client understands ocpp1.6 subprotocol
    strictMode: true,                // enable strict validation of requests & responses
});

// connect to the OCPP server
async function connect(){
    await cli.connect();
}
connect();

async function BootNotification(){
    let res = await cli.call('BootNotification', {
        chargePointVendor: "ocpp-rpc",
        chargePointModel: "ocpp-rpc",
    });

    return res;
}

async function Heartbeat(){
    return await cli.call('Heartbeat', {});
}

async function StatusNotification(){
    await cli.call('StatusNotification', {
        connectorId: 0,
        errorCode: "NoError",
        status: "Available",
    });
}

async function MeterValues(){
    await cli.call('MeterValues', {
        connectorId: 0,
        transactionId: 1234,
        meterValue: [{
            timestamp: new Date().toISOString(),
            sampledValue: [{
                value: "1000"
            }]
        }]
    });

}


cli.handle('RemoteStartTransaction', ({params}) => {
    console.log('Server requested RemoteStartTransaction:', params);
    return {status: 'Accepted'};
});

cli.handle('RemoteStopTransaction', ({params}) => {
    console.log('Server requested RemoteStopTransaction:', params);
    return {status: 'Accepted'};
});

cli.handle('ReserveNow', ({params}) => {
    console.log('Server requested ReserveNow:', params);
    return {status: 'Accepted'};
});

cli.handle('CancelReservation', ({params}) => {
    console.log('Server requested CancelReservation:', params);
    return {status: 'Accepted'};
});

function processInput(input) {

    BootNotification().then((res) => {
        if (input.trim() === 'exit') {
            console.log('Exiting the program...');
            rl.close(); // Close the readline interface, effectively terminating the program
            cli.close();//Da capire come chiudere il client che non l'ho trovato il modo
            return;
          } else {
            switch(input.trim()){

                case 'Heartbeat':
                    Heartbeat().then((heartbeatResponse) => {
                        console.log(heartbeatResponse);
                    });
                    break;
                case 'StatusNotification':
                    StatusNotification();
                    break;
                case 'MeterValues':
                    MeterValues();
                    break;
                case 'Authorize':
                    rl.question('Enter idTag: ', async (IdTag) => {
                        await Authorize(IdTag);
                    });
                    break;
                case 'StartTransaction':
                    rl.question('Enter connectorId: ', async (connectorId) => {
                        rl.question('Enter idTag: ', async (idTag) => {
                            if(status == possibleStatus.Reserved) //La colonnina era stata prenotata
                                await StartTransaction(connectorId, idTag, 1000)
                            else                                  //La colonnina non era stata prenotata
                                await StartTransaction(connectorId, idTag);
                        });
                    });
                    break;
                case 'StopTransaction':
                    console.log('Possible Reason Stop Transaction:');
                    let indexPrint = 1;
                    Object.entries(possibleReasonStopTransaction).forEach(([_, reason]) => {
                        console.log(`${indexPrint}. ${reason}`);
                        indexPrint++;
                    });
                    rl.question('Enter the reason code number: ', async (reasonCodeNumber) => {
                        const reasonCode = Object.values(possibleReasonStopTransaction)[reasonCodeNumber - 1];
                        console.log(reasonCode);
                        await StopTransaction(reasonCode);
                    });
                    StopTransaction();
                    break;
                default:
                    console.log(`Input non trovato: ${input}`);
                    break;
            }
            rl.question('Enter input: ', processInput);
          }
    });

    // Check if the input is the specific input that triggers the program to close
    
}



rl.question('Enter input: ', processInput);
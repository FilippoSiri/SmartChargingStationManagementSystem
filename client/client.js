const { RPCClient } = require('ocpp-rpc');
const readline = require('readline');
const { DEFAULT_INTERVAL } = require('./utils/constants');
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
var reservationId;
var idTagReserved;
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

//
async function Authorize(IdTag){
    //if(status != possibleStatus.Available || status != possibleStatus.Charging) return;
    const res = await cli.call('Authorize', {
        idTag: IdTag,
    })
    console.log(res); //result sarà sempre "approved"
    if(res.idTagInfo.status != "Accepted") return false;
    else return true;
    //rl.question('Enter input: ', processInput);
}

//
async function StartTransaction(ConnectorId, IdTag, ReservationId){
    //if(status != possibleStatus.Available) return;
    let res;
    if(ReservationId == undefined){
        res = await cli.call('StartTransaction', {
            connectorId: parseInt(ConnectorId),
            idTag: IdTag,
            meterStart: 1000,
            timestamp: new Date().toISOString()
        });
    }else{
        res = await cli.call('StartTransaction', {
            connectorId: parseInt(ConnectorId),
            idTag: IdTag,
            meterStart: 1000,
            timestamp: new Date().toISOString(),
            reservationId: ReservationId
        });
    }
    console.log(res);
    if(res.idTagInfo.status != "Accepted") return false;
    this.transactionId = res.transactionId;
    return true;   
}
//
async function StopTransaction(TransactionId, reasonCode){
    let res;
    //if(status != possibleStatus.Charging) return;
    if(reasonCode == undefined){
        res = await cli.call('StopTransaction', {
            meterStop: 1000,
            timestamp: new Date().toISOString(),
            transactionId: TransactionId,
        });
    }else{
        res = await cli.call('StopTransaction', {
            meterStop: 1000,
            timestamp: new Date().toISOString(),
            transactionId: TransactionId,
            reason: reasonCode
        });
    
    }
    this.transactionId = undefined;
}


cli.handle('RemoteStartTransaction', ({params}) => {
    console.log('Server requested RemoteStartTransaction:', params);
    if(this.status == possibleStatus.Reserved && this.idTagReserved != params.idTag){return {status: "Rejected"};}
    if(Authorize(params.idTag)){
        if(StartTransaction(0, params.idTag)){
            this.status = possibleStatus.Charging;
            return {status: "Accepted"};
        }else{
            this.status = possibleStatus.Available;
            return {status: "Rejected"};
        }
    }else{
        this.status = possibleStatus.Available;
        return {
            status: "Rejected"
        };
    }
});


cli.handle('RemoteStopTransaction', ({params}) => {
    console.log('Server requested RemoteStopTransaction:', params);
    StopTransaction(params.transactionId);
    this.status = possibleStatus.Available; //Il server non può impedire di fermare una transazione
    return {status: 'Accepted'};
});

cli.handle('ReserveNow', ({params}) => {
    if(status != possibleStatus.Available) return {status: 'Rejected'};
    this.idTagReserved = params.idTag;
    this.reservationId = params.reservationId;
    this.status = possibleStatus.Reserved;
    console.log('Server requested ReserveNow:', params);
    return {status: 'Accepted'};
});

cli.handle('CancelReservation', ({params}) => {
    if(status != possibleStatus.Reserved) return {status: 'Rejected'};
    if(params.reservationId != this.reservationId) return {status: 'Rejected'};
    this.idTagReserved = undefined;
    this.reservationId = undefined;
    this.status = possibleStatus.Available;
    console.log('Server requested CancelReservation:', params);
    return {status: 'Accepted'};
});

// connect to the OCPP server
async function connect(){
    await cli.connect();
    BootNotification().then((res) => {
        console.log(res);
        if(res.status !== 'Accepted'){
            console.log('BootNotification rejected');
            cli.close();
            process.exit(1);
        }
        console.log('Listening...');
        timerHeartbeat = setInterval(async () => {
            console.log('Sending heartbeat...');
            const res = await Heartbeat();
            //TODO: Handle heartbeat response
        }, (res.interval !== undefined ? res.interval : DEFAULT_INTERVAL) * 1000);
    
    
        //rl.question('Enter input: ', processInput);
    });
}
connect();

function processInput(input) {
    switch(input.trim()){
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
        case 'Exit':
            console.log('Exiting the program...');
            cli.close();
            process.exit(0);
        default:
            console.log(`Input non trovato: ${input}`);
            break;
    }
    rl.question('Enter input: ', processInput); 
}
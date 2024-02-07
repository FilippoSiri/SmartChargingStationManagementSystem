class RPCStation{
    static stations = new Map();

    static addStation(station) {
        this.stations.set(station.identity, station);
        console.log(this.stations);
    }
    
    static getStation(identity) {
        return this.stations.get(identity);
    }

    static async remoteStartTransaction(clientStation){
        return await clientStation.call('RemoteStartTransaction', {
            connectorId: 0,
            idTag: "123456",
            chargingProfile: {
                chargingProfileId: 1,
                stackLevel: 1,
                chargingProfilePurpose: "TxProfile",
                chargingProfileKind: "Absolute",
                chargingSchedule: {
                    duration: 100,
                    startSchedule: new Date().toISOString(),
                    chargingRateUnit: "W",
                    chargingSchedulePeriod: [{
                        startPeriod: 0,
                        limit: 100,
                        numberPhases: 1
                    }]
                }
            }
        });
    }
    
    static async remoteStopTransaction(clientStation){
        return await clientStation.call('RemoteStopTransaction', {
            transactionId: 1234
        });
    }
    
    static async changeAvailability(clientStation){
        return await clientStation.call('ChangeAvailability', {
            connectorId: 0,
            type: "Operative"
        });
    }
    
    static async reserveNow(clientStation){
        console.log("Entro");
        return await clientStation.call('ReserveNow', {
            connectorId: 0,
            expiryDate: new Date().toISOString(),
            idTag: "1234",
            parentIdTag: "1234"
        });
    }
    
    static async cancelReservation(clientStation){
        return await clientStation.call('CancelReservation', {
            reservationId: 1234
        });
    }
    
}

module.exports = RPCStation;
class RPCStation{
    static stations = new Map();

    static addStation(station) {
        this.stations.set(station.identity, station);
        console.log(this.stations);
    }
    
    static async remoteStartTransaction(stationId){
        try{
            const response = await this.stations.get(stationId).call('RemoteStartTransaction', {
                connectorId: 0,
                idTag: "123456"
            });
            return response.status === 'Accepted';   
        }catch(e){
            console.log(e);
            return false;
        }
    }
    
    static async remoteStopTransaction(stationId){
        try{
            const response = await this.stations.get(stationId).call('RemoteStopTransaction', {
                transactionId: 1234
            });
        }catch(e){
            console.log(e);
            return false;
        }
        
    }
    
    static async changeAvailability(stationId){
        return await this.stations.get(stationId).call('ChangeAvailability', {
            connectorId: 0,
            type: "Operative"
        });
    }
    
    static async reserveNow(stationId){
        return await this.stations.get(stationId).call('ReserveNow', {
            connectorId: 0,
            expiryDate: new Date().toISOString(),
            idTag: "1234",
            parentIdTag: "1234"
        });
    }
    
    static async cancelReservation(stationId){
        return await this.stations.get(stationId).call('CancelReservation', {
            reservationId: 1234
        });
    }
    
}

module.exports = RPCStation;
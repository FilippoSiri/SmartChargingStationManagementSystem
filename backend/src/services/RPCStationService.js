class RPCStationService{
    static stations = new Map();

    static addStation(station) {
        this.stations.set(station.identity, station);
        console.log(this.stations);
    }
    
    //deve prendere in ingresso idTag (id Utente)
    static async remoteStartTransaction(stationId, IdTag){
        try{
            const response = await this.stations.get(stationId).call('RemoteStartTransaction', {
                idTag: "123456"//da aggiugnere input
            });
            return response.status === "Accepted";   
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
            return response.status === 'Accepted';   
        }catch(e){
            console.log(e);
            return false;
        }
        
    }
    
    static async reserveNow(stationId){
        try{
            const response = await this.stations.get(stationId).call('ReserveNow', {
                connectorId: 0,
                expiryDate: new Date().toISOString(),
                idTag: "1234",
                parentIdTag: "1234",
                reservationId: 1234
            });
            return response.status === 'Accepted';
        }catch(e){
            console.log(e);
            return false;
        }
    }
    
    static async cancelReservation(stationId){
        try{
            const response = await this.stations.get(stationId).call('CancelReservation', {
                reservationId: 1234
            });
            return response.status === 'Accepted';
        }catch(e){
            console.log(e);
            return false;
        }
    }
    
}

module.exports = RPCStationService;
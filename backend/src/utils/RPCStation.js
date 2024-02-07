class RPCStation{
    static stations = new Map();

    static addStation(station) {
        this.stations.set(station.identity, station);
        console.log(this.stations);
    }

}

module.exports = RPCStation;
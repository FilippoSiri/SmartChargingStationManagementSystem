"use strict";
const Station = require("../models/Station");
const StationUsage = require("../models/StationUsage");
const RPCStationService = require("./RPCStationService");

class StationService {
    static async getAll(){
        return await Station.getAll();
    }

    static async getById(id){
        const station = await Station.getById(id);
        if(station === null)
            throw new Error("Station not found");
        return station;
    }
    
    static async getLastUsageByStationId(id){
        return await StationUsage.getLastUsageByStationId(id);
    }
    
    static async getLastReservationByStationId(id){
        return await StationUsage.getLastReservationByStationId(id);
    }
    
    static async reserve(id, userId){
        const station = await Station.getById(id);
        if (station === null)
            throw new Error("Station not found");
    
        if (station.status !== Station.STATUS.FREE)
            throw new Error("Station is currently not available for reservation");
    
        const stationUsage = new StationUsage();
        stationUsage.station_id = id;
        stationUsage.user_id = userId;
        stationUsage.reservation_time = new Date();
        stationUsage.price = station.price;
        stationUsage.deleted = false;
    
        const savedStationUsage = await stationUsage.save();
    
        if (savedStationUsage !== null) {
            if(await RPCStationService.reserveNow(id)){
                return savedStationUsage;
            }else{
                console.log("ReserveNow Declined");
                savedStationUsage.deleted = true;
                savedStationUsage.save();
                throw new Error("ReserveNow Declined");
            }
        } else {
            throw new Error("Error reserving station");
        }
    }

    static async cancelReservation(id, userId){
        const station = await Station.getById(id);
        if (station === null)
            throw new Error("Station not found");
    
        if (station.status !== Station.STATUS.RESERVED)
            throw new Error("Station is currently not available for cancelling reservation");
    
        const lastStationReservation = await StationUsage.getLastReservationByStationId(id);
    
        if (lastStationReservation.user_id != userId)
            throw new Error("You can't cancel reservation for another user");
    
        lastStationReservation.deleted = true;
    
        const savedStationUsage = await lastStationReservation.save();
    
        if (savedStationUsage !== null) {
            if(await RPCStationService.cancelReservation(id)){
                return savedStationUsage;
            }else{
                console.log("cancelReservation Declined");
                savedStationUsage.deleted = false;
                savedStationUsage.save();
                throw new Error("cancelReservation Declined");
            }
        } else {
            throw new Error("Error cancelling reservation");
        }
    }

    static async startCharging(id, userId){
        const station = await Station.getById(id);
        let savedStationUsage = null;
        if (station === null)
            throw new Error("Station not found");
    
        if (station.status === Station.STATUS.RESERVED) {
            const lastStationReservation = await StationUsage.getLastReservationByStationId(id);
    
            if (lastStationReservation.user_id != userId)
                throw new Error("Station is currently not available for charging");
    
            lastStationReservation.start_time = new Date();
            lastStationReservation.end_time = null;
    
            savedStationUsage = await lastStationReservation.save();
        } else {
            const stationUsage = new StationUsage();
            stationUsage.station_id = id;
            stationUsage.user_id = userId;
            stationUsage.start_time = new Date();
            stationUsage.price = station.price;
            stationUsage.deleted = false;
    
            savedStationUsage = await stationUsage.save();
        }
    
        if (savedStationUsage !== null) {
            if(await RPCStationService.remoteStartTransaction(id)){
                return savedStationUsage;
            }else{
                if(savedStationUsage.reservation_time !== null)
                    savedStationUsage.start_time = null;
                else
                    savedStationUsage.deleted = true;
                savedStationUsage.save();
                console.log("RemoteStartTransaction Declined");
                throw new Error("RemoteStartTransaction Declined");
            }
        } else {
            throw new Error("Error starting charging");
        }
    }

    static async stopCharging(id, userId){    
        const station = await Station.getById(id);
        if (station === null)
            throw new Error("Station not found");
    
        if (station.status !== Station.STATUS.USED)
            throw new Error("Station is currently not available for stopping charging");
    
        const lastStationUsage = await StationUsage.getLastUsageByStationId(id);
    
        if (lastStationUsage.user_id != userId)
            throw new Error("You can't stop charging for another user");
    
        lastStationUsage.end_time = new Date();
    
        const savedStationUsage = await lastStationUsage.save();
    
        if (savedStationUsage !== null) {
            if(await RPCStationService.remoteStopTransaction(id)){
                return savedStationUsage;
            }else{
                console.log("RemoteStartTransaction Declined");
                savedStationUsage.end_time = null;
                savedStationUsage.save();
                throw new Error("RemoteStartTransaction Declined");
            }
        } else {
            throw new Error("Error stopping charging");
        }
    }

    static async add(name, lat, lon, price, power, dismissed, last_heartbeat, notes, description){
        const newStation = new Station(
            null,
            name,
            lat,
            lon,
            price,
            power,
            dismissed,
            last_heartbeat,
            notes,
            description,
            Station.STATUS.FREE
        );
        const addedStation = await newStation.save();
        if (addedStation !== null) {
            return addedStation;
        }
        throw new Error("Error adding station");
    }

    static async update(id, name, lat, lon, price, power, dismissed, last_heartbeat, notes, description){
        const station = await Station.getById(id);
        if (station !== null) {
            if (name !== undefined)
                station.name = name;
            if (lat !== undefined)
                station.lat = lat;
            if (lon !== undefined)
                station.lon = lon;
            if (price !== undefined)
                station.price = price;
            if (power !== undefined)
                station.power = power;
            if (dismissed !== undefined)
                station.dismissed = dismissed;
            if (last_heartbeat !== undefined)
                station.last_heartbeat = last_heartbeat;
            if (notes !== undefined)
                station.notes = notes;
            if (description !== undefined)
                station.description = description;
            const updatedStation = await station.save();
            if (updatedStation !== null) {
                return updatedStation;
            }
            throw new Error("Error updating station");
        }
        throw new Error("Station not found");
    }

    static async getReport(){
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        const rows = await StationUsage.getReport();

        const data = months.reduce((acc, month) => {
            acc[month] = {revenue: 0, usedPower: 0};
            return acc;
        }, {});


        rows.forEach(row => {
            data[months[row.month - 1]].revenue = row.total;
            data[months[row.month - 1]].usedPower = row.kw;
        });

        return data;
    }
}

module.exports = StationService;

'use strict';
const conn = require('../utils/db-connection');
const StationUsage = require('./StationUsage');
const { RESERVATION_TIME } = require('../utils/constants');

const STATUS = {
    AVAILABLE: 0,
    DISMISSED: 1,
    BROKEN: 2
}

const SECONDARY_STATUS = {
    FREE: 0,
    RESERVED : 1,
    IN_USE : 2
}

async function getSecondaryStatus(lastReservation, lastUsage) {
    if(lastUsage && lastUsage.end_time === null)
        return SECONDARY_STATUS.IN_USE;
    else if(lastReservation && lastReservation.reservation_time.getTime() + RESERVATION_TIME > Date.now())
        return SECONDARY_STATUS.RESERVED;
    return SECONDARY_STATUS.FREE;
}

class Station {
    constructor(id, name, lat, lon, price, power, status, secondary_status) {
        this.id = id;
        this.name = name;
        this.lat = lat;
        this.lon = lon;
        this.price = price;
        this.power = power;
        this.status = status;
        this.secondary_status = secondary_status;
    }

    async save() {
        if (this.id) {
            // update existing station
            const sql = 'UPDATE Station SET name = ?, lat = ?, lon = ?, price = ?, power = ?, status = ? WHERE id = ?';
            const [rows, _] = await conn.query(sql, [this.name, this.lat, this.lon, this.price, this.power, this.status, this.id]);
            if(rows.affectedRows == 0)
                return null;
            const lastReservation = await StationUsage.getLastReservation(this.id);
            const lastUsage = await StationUsage.getLastUsage(this.id);
            this.secondary_status = await getSecondaryStatus(lastReservation, lastUsage);  
        } else {
            // insert new station
            const sql = 'INSERT INTO Station (name, lat, lon, price, power, status) VALUES (?, ?, ?, ?, ?, ?)';
            const [rows, _] = await conn.query(sql, [this.name, this.lat, this.lon, this.price, this.power, this.status]);
            this.secondary_status = SECONDARY_STATUS.FREE;
            if(rows.affectedRows == 0)
                return null;     
            this.id = rows.insertId;
        }
        return this;
    }

    static async getAll() {
        const sql = 'SELECT * FROM Station';
        const [rows, _] = await conn.query(sql);

        const allReservation = await StationUsage.getAllLastReservation();
        const allUsage = await StationUsage.getAllLastUsage();

        return await Promise.all(rows.map(async row => {
            const lastReservation = allReservation.find(reservation => reservation.station_id === row.id);
            const lastUsage = allUsage.find(usage => usage.station_id === row.id);
            const secondary_status = await getSecondaryStatus(lastReservation, lastUsage);
            return new Station(row.id, row.name, row.lat, row.lon, row.price, row.power, row.status, secondary_status)
        }));
    }
  
    static async getById(id) {
        const sql = 'SELECT * FROM Station WHERE id = ?';
        const [rows, _] = await conn.query(sql, [id]);
        if(rows.length == 0)
            return null;
        const row = rows[0];
        const lastReservation = await StationUsage.getLastReservation(row.id);
        const lastUsage = await StationUsage.getLastUsage(row.id);
        const secondary_status = await getSecondaryStatus(lastReservation, lastUsage);
        return new Station(row.id, row.name, row.lat, row.lon, row.price, row.power, row.status, secondary_status);
    }
}

Station.STATUS = STATUS;
Station.SECONDARY_STATUS = SECONDARY_STATUS;

module.exports = Station;
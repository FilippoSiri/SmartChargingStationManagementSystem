"use strict";
const conn = require("../utils/db-connection");
const StationUsage = require("./StationUsage");
const { RESERVATION_TIME, HEARTBEAT_TIME } = require("../utils/constants");

const STATUS = {
    FREE: 0,
    RESERVED: 1,
    USED: 2,
    DISMISSED: 3,
    BROKEN: 4,
    UNDEFINED: 5
};

async function getStatus(station, lastReservation, lastUsage) {
    if (station.last_heartbeat === null)
        return STATUS.UNDEFINED;
    if (station.dismissed)
        return STATUS.DISMISSED;
    if (station.last_heartbeat === null || station.last_heartbeat.getTime() + HEARTBEAT_TIME < Date.now())
        return STATUS.BROKEN;
    if (lastUsage && lastUsage.end_time === null)
        return STATUS.USED;
    if (lastReservation && lastReservation.reservation_time.getTime() + RESERVATION_TIME > Date.now())
        return STATUS.RESERVED;
    return STATUS.FREE;
}

class Station {
    constructor(
        id,
        name,
        lat,
        lon,
        price,
        power,
        dismissed,
        last_heartbeat,
        notes,
        status
    ) {
        this.id = id;
        this.name = name;
        this.lat = lat;
        this.lon = lon;
        this.price = price;
        this.power = power;
        this.dismissed = dismissed;
        this.last_heartbeat = last_heartbeat;
        this.notes = notes;
        this.status = status;
    }

    async save() {
        if (this.id) {
            // update existing station
            const sql =
                "UPDATE Station SET name = ?, lat = ?, lon = ?, price = ?, power = ?, dismissed = ?, last_heartbeat = ?, notes = ? WHERE id = ?";
            const [rows, _] = await conn.query(sql, [
                this.name,
                this.lat,
                this.lon,
                this.price,
                this.power,
                this.dismissed,
                this.last_heartbeat,
                this.notes,
                this.id,
            ]);
            if (rows.affectedRows == 0) return null;
            const lastReservation = await StationUsage.getLastReservation(
                this.id
            );
            const lastUsage = await StationUsage.getLastUsage(this.id);
            this.status = await getStatus(this, lastReservation, lastUsage);
        } else {
            // insert new station
            const sql =
                "INSERT INTO Station (name, lat, lon, price, power, dismissed, last_heartbeat, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            const [rows, _] = await conn.query(sql, [
                this.name,
                this.lat,
                this.lon,
                this.price,
                this.power,
                this.dismissed,
                this.last_heartbeat,
                this.notes,
            ]);
            this.status = STATUS.UNDEFINED;
            if (rows.affectedRows == 0) return null;
            this.id = rows.insertId;
        }
        return this;
    }

    static async getAll() {
        const sql = "SELECT * FROM Station";
        const [rows, _] = await conn.query(sql);

        const allReservation = await StationUsage.getAllLastReservation();
        const allUsage = await StationUsage.getAllLastUsage();

        return await Promise.all(
            rows.map(async (row) => {
                const lastReservation = allReservation.find(
                    (reservation) => reservation.station_id === row.id
                );
                const lastUsage = allUsage.find(
                    (usage) => usage.station_id === row.id
                );
                const status = await getStatus(row, lastReservation, lastUsage);
                return new Station(
                    row.id,
                    row.name,
                    row.lat,
                    row.lon,
                    row.price,
                    row.power,
                    row.dismissed == 1,
                    row.last_heartbeat,
                    row.notes,
                    status
                );
            })
        );
    }

    static async getById(id) {
        const sql = "SELECT * FROM Station WHERE id = ?";
        const [rows, _] = await conn.query(sql, [id]);
        if (rows.length == 0) return null;
        const row = rows[0];
        const lastReservation = await StationUsage.getLastReservation(row.id);
        const lastUsage = await StationUsage.getLastUsage(row.id);
        const status = await getStatus(row, lastReservation, lastUsage);

        return new Station(
            row.id,
            row.name,
            row.lat,
            row.lon,
            row.price,
            row.power,
            row.dismissed == 1,
            row.last_heartbeat,
            row.notes,
            status
        );
    }
}

Station.STATUS = STATUS;

module.exports = Station;

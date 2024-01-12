'use strict';
const conn = require('../utils/db-connection');

class StationUsage {
    constructor(id, user_id, station_id, start_time, end_time, reservation_time, kw, price) {
        this.id = id;
        this.user_id = user_id;
        this.station_id = station_id;
        this.start_time = start_time;
        this.end_time = end_time;
        this.reservation_time = reservation_time;
        this.kw = kw;
        this.price = price;
    }

    async save() {
        if (this.id) {
            // update existing station usage
            const sql = 'UPDATE StationUsage SET user_id = ?, station_id = ?, start_time = ?, end_time = ?, reservation_time = ?, kw = ?, price = ? WHERE id = ?';
            const [rows, _] = await conn.query(sql, [this.user_id, this.station_id, this.start_time, this.end_time, this.reservation_time, this.kw, this.price, this.id]);
            if(rows.affectedRows == 0)
                return null;
        } else {
            // insert new station usage
            const sql = 'INSERT INTO StationUsage (user_id, station_id, start_time, end_time, reservation_time, kw, price) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const [rows, _] = await conn.query(sql, [this.user_id, this.station_id, this.start_time, this.end_time, this.reservation_time, this.kw, this.price]);
            if(rows.affectedRows == 0)
                return null;
            this.id = rows.insertId;
        }
        return this;
    }

    static async getAll() {
        const sql = 'SELECT * FROM StationUsage';
        const [rows, _] = await conn.query(sql);
        return rows.map(row => new StationUsage(row.id, row.user_id, row.station_id, row.start_time, row.end_time, row.reservation_time, row.kw, row.price));
    }

    static async getAllLastReservation() {
        const sql = `
            SELECT * 
            FROM StationUsage AS su1 
            WHERE reservation_time = (
                SELECT MAX(reservation_time)
                FROM StationUsage AS su2
                WHERE su1.station_id = su2.station_id AND su1.start_time is null
            ) 
        `;
        const [rows, _] = await conn.query(sql);
        return rows.map(row => new StationUsage(row.id, row.user_id, row.station_id, row.start_time, row.end_time, row.reservation_time, row.kw, row.price));
    }
  
    static async getAllLastUsage() {
        const sql = `
            SELECT * 
            FROM StationUsage AS su1 
            WHERE start_time = (
                SELECT MAX(start_time)
                FROM StationUsage AS su2
                WHERE su1.station_id = su2.station_id and su1.start_time is not null
            )
        `;
        const [rows, _] = await conn.query(sql);
        return rows.map(row => new StationUsage(row.id, row.user_id, row.station_id, row.start_time, row.end_time, row.reservation_time, row.kw, row.price));
    }
    
    static async getLastReservation(station_id) {
        const sql = 'SELECT * FROM StationUsage WHERE station_id = ? and reservation_time is not null and start_time is null ORDER BY reservation_time DESC LIMIT 1';
        const [rows, _] = await conn.query(sql, [station_id]);
        if(rows.length == 0)
            return null;
        const row = rows[0];
        return new StationUsage(row.id, row.user_id, row.station_id, row.start_time, row.end_time, row.reservation_time, row.kw, row.price);
    }

    static async getLastUsage(station_id) { 
        const sql = 'SELECT * FROM StationUsage WHERE station_id = ? and start_time is not null ORDER BY start_time DESC LIMIT 1';
        const [rows, _] = await conn.query(sql, [station_id]);
        if(rows.length == 0)
            return null;
        const row = rows[0];
        return new StationUsage(row.id, row.user_id, row.station_id, row.start_time, row.end_time, row.reservation_time, row.kw, row.price);
    }
}

module.exports = StationUsage;
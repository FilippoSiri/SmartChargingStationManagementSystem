'use strict';
const conn = require('../utils/db-connection');

class Station {
    constructor(id, name, lat, lon, price, power, status) {
        this.id = id;
        this.name = name;
        this.lat = lat;
        this.lon = lon;
        this.price = price;
        this.power = power;
        this.status = status;
    }

    async save() {
        if (this.id) {
            // update existing station
            const sql = 'UPDATE Station SET name = ?, lat = ?, lon = ?, price = ?, power = ?, status = ? WHERE id = ?';
            const [rows, _] = await conn.query(sql, [this.name, this.lat, this.lon, this.price, this.power, this.status, this.id]);
            if(rows.affectedRows == 0)
                return null;
        } else {
            // insert new ustationser
            const sql = 'INSERT INTO Station (name, lat, lon, price, power, status) VALUES (?, ?, ?, ?, ?, ?)';
            const [rows, _] = await conn.query(sql, [this.name, this.lat, this.lon, this.price, this.power, this.status]);
            if(rows.affectedRows == 0)
                return null;
            this.id = rows.insertId;
        }
        return this;
    }

    static async getAll() {
        const sql = 'SELECT * FROM Station';
        const [rows, _] = await conn.query(sql);
        return rows.map(row => new Station(row.id, row.name, row.lat, row.lon, row.price, row.power, row.status));
    }
  
    static async getById(id) {
        const sql = 'SELECT * FROM Station WHERE id = ?';
        const [rows, _] = await conn.query(sql, [id]);
        if(rows.length == 0)
            return null;
        const row = rows[0];
        return new Station(row.id, row.name, row.lat, row.lon, row.price, row.power, row.status, row.id);
    }
}
module.exports = Station;
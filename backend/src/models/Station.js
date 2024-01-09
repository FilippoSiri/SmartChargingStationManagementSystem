'use strict';
const conn = require('../utils/db-connection');

class Station {
    constructor(name, lat, lon, price, power, status) {
        this.name = name;
        this.lat = lat;
        this.lon = lon;
        this.price = price;
        this.power = power;
        this.status = status;
    }

    async save(){
        const sql = 'INSERT INTO Station (name, lat, lon, price, power, status) VALUES (?, ?, ?, ?, ?, ?)';
        const [result, _] = await conn.query(sql, [this.name, this.lat, this.lon, this.price, this.power, this.status]);
        if(result.affectedRows == 1){
            this.id = result.insertId;
            return this;
        }
        return null;
    }

    static async getAll() {
        const sql = 'SELECT * FROM Station';
        const [result, _] = await conn.query(sql);
        return result;
    }
  
    static async getById(id) {
        const sql = 'SELECT * FROM Station WHERE id = ?';
        const [result, _] = await conn.query(sql, [id]);
        if(result.length == 0)
            return null;
        return result[0];
    }
}
module.exports = Station;
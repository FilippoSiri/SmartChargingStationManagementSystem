CREATE DATABASE IF NOT EXISTS SmartChargingStation;
USE SmartChargingStation;

CREATE TABLE Station (
    id int AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    lat DECIMAL(11, 8),
    lon DECIMAL(11, 8),
    price int,
    power DECIMAL(11, 8),
    last_heartbeath DATETIME,
    note TEXT,
);

CREATE TABLE User (
    id int AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    surname VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    token_reset_time DATETIME,
    balance int
);

CREATE TABLE StationUsage (
    id int AUTO_INCREMENT PRIMARY KEY,
    user_id int,
    station_id int,
    start_time DATETIME,
    end_time DATETIME,
    reservation_time DATETIME,
    kw DECIMAL(11, 8),
    price int,
    FOREIGN KEY (user_id) REFERENCES User(id),
    FOREIGN KEY (station_id) REFERENCES Station(id)
);

INSERT INTO Station (name, lat, lon, price, power, status) 
VALUES ('Station 1', 37.7749, -122.4194, 100, 2.5, 1);

INSERT INTO Station (name, lat, lon, price, power, status) 
VALUES ('Station 2', 34.0522, -118.2437, 200, 3.5, 0);

INSERT INTO Station (name, lat, lon, price, power, status) 
VALUES ('Station 3', 40.7128, -74.0060, 150, 2.8, 1);
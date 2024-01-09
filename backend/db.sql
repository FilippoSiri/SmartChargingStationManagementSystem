CREATE DATABASE IF NOT EXISTS SmartChargingStation;
USE SmartChargingStation;

CREATE TABLE Station (
    id int AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    lat DECIMAL(11, 8),
    lon DECIMAL(11, 8),
    price int,
    power DECIMAL(11, 8),
    status int
);

INSERT INTO Station (name, lat, lon, price, power, status) 
VALUES ('Station 1', 37.7749, -122.4194, 100, 2.5, 1);

INSERT INTO Station (name, lat, lon, price, power, status) 
VALUES ('Station 2', 34.0522, -118.2437, 200, 3.5, 0);

INSERT INTO Station (name, lat, lon, price, power, status) 
VALUES ('Station 3', 40.7128, -74.0060, 150, 2.8, 1);
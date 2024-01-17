CREATE DATABASE IF NOT EXISTS SmartChargingStation;
USE SmartChargingStation;

CREATE TABLE Station (
    id int AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    lat DECIMAL(11, 8),
    lon DECIMAL(11, 8),
    price int,
    power DECIMAL(11, 8),
    dismissed BOOLEAN,
    last_heartbeat DATETIME,
    notes TEXT
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

INSERT INTO Station (name, lat, lon, price, power, dismissed, last_heartbeat, notes)
            VALUES ('Station 1', 44.41225398745292, 8.943041803651521, 421, 3.4212377134862795, 0, NOW(), 'This is a note');

INSERT INTO Station (name, lat, lon, price, power, dismissed, last_heartbeat, notes)
            VALUES ('Station 2', 44.40973066556966, 8.937683635571881, 228, 3.6384354501274463, 0, NOW(), 'This is a note');

INSERT INTO Station (name, lat, lon, price, power, dismissed, last_heartbeat, notes)
            VALUES ('Station 3', 44.40959225369384, 8.938335670510613, 259, 4.732612399122979, 0, NOW(), 'This is a note');

INSERT INTO Station (name, lat, lon, price, power, dismissed, last_heartbeat, notes)
            VALUES ('Station 4', 44.41490247844163, 8.948156087159589, 228, 3.952524392919057, 0, NOW(), 'This is a note');

INSERT INTO Station (name, lat, lon, price, power, dismissed, last_heartbeat, notes)
            VALUES ('Station 5', 44.41668083596903, 8.945843180774654, 428, 2.9332294756920354, 0, NOW(), 'This is a note');

INSERT INTO Station (name, lat, lon, price, power, dismissed, last_heartbeat, notes)
            VALUES ('Station 6', 44.41298340189158, 8.939498167023588, 341, 3.525655247462496, 0, NOW(), 'This is a note');

INSERT INTO Station (name, lat, lon, price, power, dismissed, last_heartbeat, notes)
            VALUES ('Station 7', 44.410629875247835, 8.940450134372531, 167, 3.6201685757315314, 0, NOW(), 'This is a note');

INSERT INTO Station (name, lat, lon, price, power, dismissed, last_heartbeat, notes)
            VALUES ('Station 8', 44.416008668901455, 8.94061536564911, 351, 3.7019193661509875, 0, NOW(), 'This is a note');

INSERT INTO Station (name, lat, lon, price, power, dismissed, last_heartbeat, notes)
            VALUES ('Station 9', 44.41648755559513, 8.943489395794249, 320, 4.548326041075304, 0, NOW(), 'This is a note');

INSERT INTO Station (name, lat, lon, price, power, dismissed, last_heartbeat, notes)
            VALUES ('Station 10', 44.413023902482834, 8.938031770503345, 175, 3.2172681666350913, 0, NOW(), 'This is a note');
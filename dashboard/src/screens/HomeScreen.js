import React, { useEffect, useRef, useState, useCallback, createElement } from "react";
import { Container, Grid, Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import "@tomtom-international/web-sdk-maps/dist/maps.css";
import tt from "@tomtom-international/web-sdk-maps";

import axios from "axios";
import CustomMarker from "../components/CustomMarker";

const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
        field: "name",
        headerName: "Station Name",
        width: 150,
        editable: false,
    },
    {
        field: "power",
        headerName: "Station Power",
        width: 150,
        editable: false,
    },
    {
        field: "price",
        headerName: "Station Price",
        width: 150,
        editable: false,
    },
    {
        field: "string_status",
        headerName: "Station Status",
        width: 150,
        editable: false,
    },
    {
        field: "edit",
        headerName: "Edit",
        width: 150,
        renderCell: (params) => (
            <Link
                to={`/station/${params.id}`}
                style={{ textDecoration: "none" }}
                color="inherit"
            >
                <Button variant="contained">
                    <FontAwesomeIcon icon={faEdit} />
                    &nbsp;Edit
                </Button>
            </Link>
        ),
    },
];

const stationStatuses = {
    0: "Free",
    1: "Reserved",
    2: "In use",
    3: "Dismissed",
    4: "Broken",
    5: "Undefined"
}

const stationColors = {
    0: "#085C13",
    1: "#FFD700",
    2: "#FF0000",
    3: "#000000",
    4: "#000000",
    5: "#000000"
}

const HomeScreen = () => {
    const [stations, setStations] = useState([]);
    const [map, setMap] = useState({});
    const mapElement = useRef();

    useEffect(() => {
        const fetchStations = async () => {
            console.log(
                `http://localhost:${process.env.REACT_APP_API_PORT}/station`
            );
            let { data } = await axios.get(
                `http://localhost:${process.env.REACT_APP_API_PORT}/station`
            );

            console.log(data[0]);

            data = data.map((station) => {
                return {
                    id: station.id,
                    name: station.name,
                    lat: station.lat,
                    lon: station.lon,
                    price: station.price / 100,
                    power: Math.round(station.power * 10).toFixed(2),
                    status: station.status,
                    string_status: stationStatuses[station.status],
                };
            });
            setStations(data);
        };

        let map = tt.map({
            key: process.env.REACT_APP_TOMTOM_API_KEY,
            container: mapElement.current,
            center: [8.93413, 44.40757],
            zoom: 15,
        });

        setMap(map);
        fetchStations();

        let intervalId = setInterval(fetchStations, 60000);

        return () => {
            map.remove();
            clearInterval(intervalId);
        }
    }, []);

    const addMarker = useCallback((station) => {
        const mymarker = document.createElement('div');
        mymarker.className = 'marker';
        const markerContentElement = document.createElement('div');
        markerContentElement.className = 'marker-content';
        markerContentElement.style.background = stationColors[station.status];
        mymarker.appendChild(markerContentElement);

        let marker = new tt.Marker({element: mymarker})
            .setLngLat([station.lon, station.lat])
            .addTo(map);
        marker.setPopup(
            new tt.Popup({ offset: 35 }).setHTML(
                `<h3>${station.name}</h3><p>Power: ${station.power}</p><p>Price: ${station.price}</p>`
            )
        );
    },[map]);

    useEffect(() => {
        stations.forEach((station) => {
            addMarker(station);
        });
    }, [stations, addMarker]);

    return (
        <Container maxWidth="xl" style={{ marginTop: "3em" }}>
            <Grid container spacing={2}>
                <Grid item xs={7}>
                    <Box
                        className="boj"
                        sx={{ height: "600px", width: "100%" }}
                    >
                        <DataGrid
                            style={{ height: "100%", width: "100%" }}
                            rows={stations}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 10,
                                    },
                                },
                            }}
                            pageSizeOptions={[10]}
                            disableRowSelectionOnClick
                        />
                    </Box>
                </Grid>
                <Grid item xs={5}>
                    <div
                        ref={mapElement}
                        className="mapDiv"
                        style={{ height: "100%" }}
                    ></div>
                </Grid>
            </Grid>
        </Container>
    );
};

export default HomeScreen;

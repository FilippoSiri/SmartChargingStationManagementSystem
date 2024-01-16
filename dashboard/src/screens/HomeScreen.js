"use strict";
import React, { useEffect, useRef, useState } from "react";
import { Container, Grid, Typography, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import "@tomtom-international/web-sdk-maps/dist/maps.css";
import tt from "@tomtom-international/web-sdk-maps";

import axios from "axios";

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
    type: "number",
    width: 110,
    editable: false,
  },
  {
    field: "status",
    headerName: "Station Status",
    type: "number",
    width: 150,
    editable: false,
  },
];

const HomeScreen = () => {
  const [stations, setStations] = useState([]);
  const [map, setMap] = useState({});
  const mapElement = useRef();

  useEffect(() => {
    const fetchStations = async () => {
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

    return () => map.remove();
  }, []);

  useEffect(() => {
    stations.forEach((station) => {
      addMarker(station);
    });
  }, [stations]);

  const addMarker = (station) => {
    let marker = new tt.Marker()
      .setLngLat([station.lon, station.lat])
      .addTo(map);
    marker.setPopup(
      new tt.Popup({ offset: 35 }).setHTML(
        `<h3>${station.name}</h3><p>Power: ${station.power}</p><p>Price: ${station.price}</p>`
      )
    );
  };

  return (
    <Container maxWidth="xl" style={{ marginTop: "3em" }}>
      <Grid container spacing={2}>
        <Grid item xs={7}>
          <Box className="boj" sx={{ height: "600px", width: "100%" }}>
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
              checkboxSelection
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

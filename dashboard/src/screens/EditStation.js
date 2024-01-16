import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";

import axios from "axios";

const EditStation = () => {
  const { id } = useParams();
  const [stationInfo, setStationinfo] = useState({});

  useEffect(() => {
    const getStationInfo = async () => {
      const { data } = await axios.get(
        `http://localhost:${process.env.REACT_APP_API_PORT}/station/${id}`
      );
      console.log(data);
      setStationinfo(data);
    };

    getStationInfo();
  }, []);

  return (
    <Container xs={"xl"}>
      <Box
        boxShadow={3}
        style={{ marginTop: "1em", borderRadius: "5px", padding: "1em" }}
      >
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          <Grid item xs={12}>
            <Typography variant="h5">Edit Charging Station {id}</Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="body1">Name</Typography>
            <input
              className="input-edit-station"
              placeholder={stationInfo.name}
            />
          </Grid>

          <Grid item xs={4}>
            <Typography variant="body1">Power</Typography>
            <input
              className="input-edit-station"
              placeholder={stationInfo.power}
            />
          </Grid>

          <Grid item xs={4}>
            <Typography variant="body1">Price (€/kWh)</Typography>
            <input
              className="input-edit-station"
              placeholder={stationInfo.price / 100}
            />
          </Grid>

          <Grid item xs={4}>
            <Typography variant="body1">Dismissed</Typography>
            <select className="input-edit-station">
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="body1">Longitude</Typography>
            <input
              className="input-edit-station"
              placeholder={stationInfo.lon}
            />
          </Grid>

          <Grid item xs={4}>
            <Typography variant="body1">Latitude</Typography>
            <input
              className="input-edit-station"
              placeholder={stationInfo.lat}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1">Note</Typography>
            <textarea
              className="input-edit-station"
              placeholder={stationInfo.name}
              style={{ height: "100px", width: "100%" }}
            />
          </Grid>

          <Grid item xs={12}>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              <Grid item xs={1}>
                <Button variant="contained" color="success">
                  Save
                </Button>
              </Grid>
              <Grid item xs={1}>
                <Button variant="contained" color="error">
                  Delete
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default EditStation;

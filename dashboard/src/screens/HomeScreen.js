import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

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

  useEffect(() => {
    const fetchStations = async () => {
      let { data } = await axios.get(
        `http://localhost:${process.env.REACT_APP_API_PORT}/station`
      );
      data = data.map((station) => {
        return {
          id: station.id,
          name: station.name,
          power: Math.round(station.power * 10).toFixed(2),
          price: station.price / 100,
          status: station.status,
        };
      });
      setStations(data);
    };

    fetchStations();
  }, []);

  return (
    <Container maxWidth="xl" style={{ marginTop: "3em" }}>
      <Grid container spacing={2}>
        <Grid item xs={7}>
          <Box sx={{ height: "95%", width: "100%" }}>
            <DataGrid
              style={{ textAlign: "center" }}
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
          <div>
            <h1>
              <Typography>MAPS</Typography>
            </h1>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomeScreen;

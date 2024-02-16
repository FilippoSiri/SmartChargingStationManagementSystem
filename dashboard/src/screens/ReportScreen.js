import React, { useState, useEffect} from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { Container, Typography, Grid } from "@mui/material";

import axios from "axios";

const ReportScreen = () => {
    const [reportData, setReportData] = useState({});

    useEffect(() => {
        const getReportData = async () => {
            try {
                const data = await axios.get(`${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/station/report`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token"),
                    }
                });

                console.log(data.data);
                //setReportData(data.data);
                setReportData({"january": {revenue: 1000 * Math.random(), usedPower: 1000 * Math.random()}, "february": {revenue: 2000 * Math.random(), usedPower: 2000 * Math.random()}, "march": {revenue: 3000 * Math.random(), usedPower: 3000 * Math.random()}, "april": {revenue: 4000 * Math.random(), usedPower: 4000 * Math.random()}, "may": {revenue: 5000 * Math.random(), usedPower: 5000 * Math.random()}, "june": {revenue: 6000 * Math.random(), usedPower: 6000 * Math.random()}, "july": {revenue: 7000 * Math.random(), usedPower: 7000 * Math.random()}, "august": {revenue: 8000 * Math.random(), usedPower: 8000 * Math.random()}, "september": {revenue: 9000 * Math.random(), usedPower: 9000 * Math.random()}, "october": {revenue: 10000 * Math.random(), usedPower: 10000 * Math.random()}, "november": {revenue: 11000 * Math.random(), usedPower: 11000 * Math.random()}, "december": {revenue: 12000 * Math.random(), usedPower: 12000 * Math.random()}});
            } catch (error) {
                alert("Error getting report data");
                console.error(error);
            }
        }

        getReportData();

    }, []);

    return (
        <Container maxWidth="xl" style={{ marginTop: "3em" }}>
            <Typography variant="h4" gutterBottom component="div">
                Report
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Line
                        style={{ height: "30%", width: "100%" }}
                        data={{
                            labels: Object.keys(reportData),
                            datasets: [
                                {
                                    label: "Revenue",
                                    data: Object.values(reportData).map((row) => (row.revenue / 100)),
                                    backgroundColor: "rgba(1, 125, 12, 0.2)",
                                    borderColor: "rgba(1, 125, 12, 1)",
                                    borderWidth: 1,
                                },
                            ],
                        }}
                        options={{
                            indexAxis: "x",
                            scales: {
                                x: {
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Line
                        style={{ height: "30%", width: "100%" }}
                        data={{
                            labels: Object.keys(reportData),
                            datasets: [
                                {
                                    label: "Used Power",
                                    data: Object.values(reportData).map((row) => row.usedPower),
                                    backgroundColor: "rgba(99, 99, 255, 0.2)",
                                    borderColor: "rgba(99, 99, 255, 1)",
                                    borderWidth: 1,
                                },
                            ],
                        }}
                        options={{
                            indexAxis: "x",
                            scales: {
                                x: {
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                </Grid>
            </Grid>
            
        </Container>
    );
};

export default ReportScreen;
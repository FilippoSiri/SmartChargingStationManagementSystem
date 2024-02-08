import React from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { Container, Typography, Grid } from "@mui/material";

const ReportScreen = () => {
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
                            labels: ["January", "February", "March"],
                            datasets: [
                                {
                                    label: "Revenue",
                                    data: [3, 2, 10],
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
                            labels: ["January", "February", "March"],
                            datasets: [
                                {
                                    label: "Costs",
                                    data: [3, 2, 10],
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
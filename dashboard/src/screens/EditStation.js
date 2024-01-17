import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Slide,
    Typography,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";

import axios from "axios";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const EditStation = () => {
    const { id } = useParams();
    const [openPostApi, setOpenPostApi] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);
    const [stationInfo, setStationinfo] = useState({});
    const [dialogMessage, setDialogMessage] = useState("");

    useEffect(() => {
        const getStationInfo = async () => {
            let { data } = await axios.get(
                `http://localhost:${process.env.REACT_APP_API_PORT}/station/${id}`
            );

            // Convert price from cents to euros
            // need to be here, because if we do inside placeholder error occurs
            data.price = data.price / 100;

            console.log(data);

            setStationinfo(data);
        };

        if (id) getStationInfo();
    }, [id]);

    const handleChangeStationInfo = (e) => {
        let fieldToUpdate = e.target.getAttribute("field");
        let newValue = e.target.value;

        if (fieldToUpdate === "dismissed")
            newValue = newValue === "true" ? true : false;

        setStationinfo({ ...stationInfo, [fieldToUpdate]: newValue });
    };

    const handleSubmitClick = async (e) => {
        e.preventDefault();

        const reqType = id ? axios.patch : axios.post;

        const res = await reqType(
            `http://localhost:${process.env.REACT_APP_API_PORT}/station`,
            {
                id: stationInfo.id,
                name: stationInfo.name,
                lat: stationInfo.lat,
                lon: stationInfo.lon,
                price: stationInfo.price * 100,
                power: stationInfo.power,
                dismissed: stationInfo.dismissed,
                last_heartbeat: stationInfo.last_heartbeat,
                notes: stationInfo.notes,
            }
        );

        if (res.status === 201) {
            setDialogMessage("Station updated successfully");
        } else {
            setDialogMessage("Error updating station");
        }
        setOpenPostApi(true);
    };

    const handleClosePostAPI = () => {
        setOpenPostApi(false);
    };

    const handleOpenCancel = () => {
        setOpenCancel(true);
    };

    const handleCloseCancel = () => {
        setOpenCancel(false);
    };

    return (
        <Container xs={"xl"} style={{ marginTop: "3em" }}>
            <Box
                boxShadow={3}
                style={{
                    marginTop: "1em",
                    borderRadius: "5px",
                    padding: "1em",
                }}
            >
                <form onSubmit={handleSubmitClick}>
                    <Grid
                        container
                        spacing={{ xs: 2, md: 3 }}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                        <Grid item xs={12}>
                            {id ? (
                                <Typography variant="h5">
                                    Edit Charging Station {id}
                                </Typography>
                            ) : (
                                <Typography variant="h5">
                                    Add Charging Station
                                </Typography>
                            )}
                        </Grid>

                        <Grid item xs={4}>
                            <Typography variant="body1">Name</Typography>
                            <input
                                className="input-edit-station"
                                placeholder={
                                    stationInfo.name ?? "Insert station name"
                                }
                                field="name"
                                onChange={handleChangeStationInfo}
                                required={id ? false : true}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <Typography variant="body1">Power</Typography>
                            <input
                                type="text"
                                field="power"
                                className="input-edit-station"
                                placeholder={
                                    stationInfo.power ?? "Insert power"
                                }
                                onChange={handleChangeStationInfo}
                                required={id ? false : true}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <Typography variant="body1">
                                Price (€/kWh)
                            </Typography>
                            <input
                                type="text"
                                field="price"
                                className="input-edit-station"
                                placeholder={
                                    stationInfo.price ?? "Insert price"
                                }
                                onChange={handleChangeStationInfo}
                                required={id ? false : true}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <Typography variant="body1">Dismissed</Typography>
                            <select
                                field="dismissed"
                                className="input-edit-station"
                                value={stationInfo.dismissed}
                                onChange={handleChangeStationInfo}
                                required={id ? false : true}
                            >
                                <option value="false">False</option>
                                <option value="true">True</option>
                            </select>
                        </Grid>

                        <Grid item xs={4}>
                            <Typography variant="body1">Longitude</Typography>
                            <input
                                className="input-edit-station"
                                placeholder={
                                    stationInfo.lon ?? "Insert longitude"
                                }
                                field="lon"
                                onChange={handleChangeStationInfo}
                                required={id ? false : true}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <Typography variant="body1">Latitude</Typography>
                            <input
                                className="input-edit-station"
                                placeholder={
                                    stationInfo.lat ?? "Insert latitude"
                                }
                                field="lat"
                                onChange={handleChangeStationInfo}
                                required={id ? false : true}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <Typography variant="body1">
                                Last heartbeat
                            </Typography>
                            <input
                                className="input-edit-station"
                                type="text"
                                value={new Date(
                                    stationInfo.last_heartbeat ??
                                        new Date().toISOString()
                                ).toLocaleString()}
                                disabled
                                style={{ cursor: "not-allowed" }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="body1">Note</Typography>
                            <textarea
                                className="input-edit-station"
                                placeholder={stationInfo.notes ?? "Insert note"}
                                style={{ height: "100px", width: "100%" }}
                                field="notes"
                                onChange={handleChangeStationInfo}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Grid
                                container
                                spacing={{ xs: 2, md: 3 }}
                                columns={{ xs: 4, sm: 8, md: 12 }}
                            >
                                <Grid item xs={1}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="success"
                                    >
                                        Save
                                    </Button>
                                </Grid>
                                <Grid item xs={1}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={handleOpenCancel}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Box>
            <Dialog
                open={openPostApi}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClosePostAPI}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Update request"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {dialogMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Link to="/">
                        <Button onClick={handleClosePostAPI}>OK</Button>
                    </Link>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openCancel}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClosePostAPI}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Confirm exit"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {"Are you sure you want to exit?"}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Link to="/">
                        <Button onClick={handleClosePostAPI}>YES</Button>
                    </Link>
                    <Button onClick={handleCloseCancel}>NO</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default EditStation;

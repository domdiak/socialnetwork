import { Component } from "react";
import { Link } from "react-router-dom";
import {
    Typography,
    Box,
    TextField,
    Grid,
    Container,
    Button,
} from "@mui/material";

export class Registration extends Component {
    constructor() {
        super();
        this.state = {
            error: "",
        };
        this.inputUpdate = this.inputUpdate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        console.log("Registration mounted");
    }
    inputUpdate({ target }) {
        // console.log(target.value);
        this.setState(
            {
                [target.name]: target.value,
            },
            () => {
                // console.log(this.state);
            }
        );
    }
    handleSubmit(event) {
        event.preventDefault();
        fetch("/register.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => {
                // console.log("resp", resp);
                return resp.json();
            })
            .then((data) => {
                // ** Why am I not seeing this in the console???
                console.log("resp from POST /register.json", data);
                if (data.success) {
                    location.reload();
                } else {
                    this.setState({
                        error: "Error, try again",
                    });
                }
            })
            .catch((err) => console.log("Error when POST /register.json:", err))
            .catch((err) =>
                console.log("Error in resp from POST register.json", err)
            );
    }
    render() {
        return (
            <>
                {this.state.error && (
                    <h2> Something went wrong: {this.state.error} </h2>
                )}
                <Grid
                    container
                    spacing={5}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={{ minHeight: "100vh" }}
                >
                    <Typography variant="h3" component="h3" align="left">
                        Registration
                    </Typography>
                    <Box component="form" sx={{ width: "50%", px: 4 }}>
                        <TextField
                            fullWidth
                            id="outlined-basic"
                            variant="outlined"
                            name="first"
                            type="text"
                            label="Type first name"
                            onChange={this.inputUpdate}
                        />
                        <TextField
                            fullWidth
                            id="outlined-basic"
                            variant="outlined"
                            name="last"
                            type="text"
                            label="Type last name"
                            onChange={this.inputUpdate}
                        />
                        <TextField
                            fullWidth
                            id="outlined-basic"
                            variant="outlined"
                            name="email"
                            type="text"
                            label="Type email"
                            onChange={this.inputUpdate}
                        />
                        <TextField
                            fullWidth
                            id="outlined-basic"
                            variant="outlined"
                            name="password"
                            type="password"
                            label="Type password"
                            onChange={this.inputUpdate}
                        />
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={this.handleSubmit}
                        >
                            {" "}
                            Register{" "}
                        </Button>
                        <Link to="/login">Click here to Log in!</Link>
                    </Box>
                </Grid>
            </>
        );
    }
}

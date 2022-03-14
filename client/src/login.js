import { Component } from "react";
import { Link } from "react-router-dom";
import {
    Typography,
    Box,
    TextField,
    Grid,
    Container,
    Button,
    Paper,
    Avatar,
} from "@mui/material";
import { BrowserRouter, Route } from "react-router-dom";

export class Login extends Component {
    constructor() {
        super();
        this.state = {
            error: "",
        };
        this.inputUpdate = this.inputUpdate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        console.log("Login mounted");
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
        fetch("/login.json", {
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
                console.log("resp from POST /login.json", data);
                if (data.success) {
                    location.reload();
                } else {
                    this.setState({
                        error: "Wrong password or user doesn't exist",
                    });
                }
            })
            .catch((err) => console.log("Error when POST /login.json:", err))
            .catch((err) =>
                console.log("Error in resp from POST login.json", err)
            );
    }

    render() {
        return (
            <>
                {this.state.error && (
                    <h2> Something went wrong: {this.state.error} </h2>
                )}
                <Grid>
                    <Paper
                        elevation={10}
                        sx={{
                            p: 2,
                            height: "70vh",
                            width: 280,
                            margin: "20px auto",
                        }}
                    >
                        <Grid align="center">
                            <Avatar></Avatar>
                            <Typography
                                variant="h4"
                                component="h4"
                                sx={{ p: 2, fontWeight: "bold" }}
                            >
                                Login
                            </Typography>
                        </Grid>
                        <TextField
                            label="Email"
                            placeholder="Enter your email"
                            name="email"
                            type="text"
                            sx={{ margin: "8px 0" }}
                            onChange={this.inputUpdate}
                            fullWidth
                        ></TextField>
                        <TextField
                            label="Password"
                            placeholder="Enter password"
                            name="password"
                            type="password"
                            sx={{ margin: "8px 0" }}
                            onChange={this.inputUpdate}
                            fullWidth
                        ></TextField>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ margin: "8px 0" }}
                            onClick={this.handleSubmit}
                        >
                            {" "}
                            Login
                        </Button>
                        <Typography sx={{ margin: "8px 0" }}>
                            <Link to="/reset">Forgot your password?</Link>
                        </Typography>
                        <Typography>
                            {" "}
                            No account?
                            <Link href="#"> Sign up here</Link>
                        </Typography>
                    </Paper>
                </Grid>

                <Box
                    component="form"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                ></Box>
            </>
        );
    }
}

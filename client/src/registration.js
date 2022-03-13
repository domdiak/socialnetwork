import { Component } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

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
                <h1> Registration </h1>
                {this.state.error && (
                    <h2> Something went wrong: {this.state.error} </h2>
                )}
                <Container maxWidth="sm">
                    <form>
                        <Grid container spacing={5}></Grid>
                        <Grid container spacing={5}></Grid>
                        <Grid container spacing={5}></Grid>
                        <Grid container spacing={5}></Grid>
                        <Grid container spacing={5}></Grid>
                        <Grid container spacing={5}></Grid>
                        <input
                            name="first"
                            type="text"
                            placeholder="Type first name"
                            onChange={this.inputUpdate}
                        />
                        <input
                            name="last"
                            type="text"
                            placeholder="Type last name"
                            onChange={this.inputUpdate}
                        />
                        <input
                            name="email"
                            type="text"
                            placeholder="Type email"
                            onChange={this.inputUpdate}
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Type password"
                            onChange={this.inputUpdate}
                        />
                        <Button variant="contained" onClick={this.handleSubmit}>
                            {" "}
                            Register{" "}
                        </Button>
                    </form>
                    <Link to="/login">Click here to Log in!</Link>
                </Container>
            </>
        );
    }
}

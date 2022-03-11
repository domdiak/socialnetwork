import { Component } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
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
                <h1> Login! </h1>
                {this.state.error && (
                    <h2> Something went wrong: {this.state.error} </h2>
                )}
                <form>
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
                        Login{" "}
                    </Button>
                </form>
                <Link to="/reset">Forgot your password?</Link>
            </>
        );
    }
}

import { Component } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

export class Reset extends Component {
    constructor() {
        super();
        this.state = {
            view: 1,
            error: "",
        };
        this.inputUpdate = this.inputUpdate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }
    componentDidMount() {
        console.log("Reset mounted");
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
    handleReset(event) {
        event.preventDefault();
        fetch("/password/reset/start", {
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
                console.log("resp from POST /password/reset/start", data);
                if (data.success) {
                    this.setState({
                        view: 2,
                    });
                } else {
                    this.setState({
                        error: "Something went wrong. Try again.",
                    });
                }
            })
            .catch((err) =>
                console.log("Error when POST /password/reset/start:", err)
            )
            .catch((err) =>
                console.log("Error when POST /password/reset/start", err)
            );
    }
    handleSubmit(event) {
        event.preventDefault();
        fetch("/password/reset/verify", {
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
                console.log("resp from POST /password/reset/verify", data);
                if (data.success) {
                    this.setState({
                        view: 3,
                    });
                } else {
                    this.setState({
                        error: "Something went wrong. Try again.",
                    });
                }
            })
            .catch((err) =>
                console.log("Error when POST /password/reset/verify:", err)
            )
            .catch((err) =>
                console.log("Error when POST /password/reset/verify", err)
            );
    }
    determineViewToRender() {
        if (this.state.view === 1) {
            return (
                <>
                    {this.state.error && (
                        <h2> Something went wrong: {this.state.error} </h2>
                    )}
                    <form>
                        <input
                            name="email"
                            type="text"
                            placeholder="Type your email"
                            onChange={this.inputUpdate}
                        />
                        <Button variant="contained" onClick={this.handleReset}>
                            {" "}
                            Reset Password{" "}
                        </Button>
                    </form>
                </>
            );
        } else if (this.state.view === 2) {
            return (
                <>
                    <form>
                        <input
                            name="code"
                            type="text"
                            placeholder="Type your code"
                            onChange={this.inputUpdate}
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Type your news password"
                            onChange={this.inputUpdate}
                        />
                        <Button variant="contained" onClick={this.handleSubmit}>
                            {" "}
                            Set new password{" "}
                        </Button>
                    </form>
                </>
            );
        } else if (this.state.view === 3) {
            // remember to also add a link to login ;)
            return (
                <div>
                    <h1>Your password has been changed successfully.</h1>
                    <Link to="/login">Go back to login page.</Link>
                </div>
            );
        }
    }

    render() {
        return (
            <>
                <h1> Reset Page</h1>
                {this.determineViewToRender()}
            </>
        );
    }
}

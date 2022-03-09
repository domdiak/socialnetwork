import { Component } from "react";

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
                <h1> Registration </h1>;
                {this.state.error && (
                    <h2> Something went wrong: {this.state.error} </h2>
                )}
                ;
                <form>
                    <input
                        name="first"
                        type="text"
                        onChange={this.inputUpdate}
                    />
                    <input
                        name="last"
                        type="text"
                        onChange={this.inputUpdate}
                    />
                    <input
                        name="email"
                        type="text"
                        onChange={this.inputUpdate}
                    />
                    <input
                        name="password"
                        type="password"
                        onChange={this.inputUpdate}
                    />
                    <button onClick={this.handleSubmit}> Register </button>
                </form>
            </>
        );
    }
}

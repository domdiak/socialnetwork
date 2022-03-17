import { Component } from "react";
import { Box, Container, Grid, Button, Paper, TextField } from "@mui/material";

export class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            // Why do I need the draftBio?
            draftBio: "",
            bio: "",
        };
        this.editBio = this.editBio.bind(this);
        this.inputUpdate = this.inputUpdate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    editBio() {
        this.setState({ editMode: true, bio: this.props.bio });
    }

    inputUpdate({ target }) {
        this.setState(
            {
                [target.name]: target.value,
            },
            () => {
                console.log(this.state);
            }
        );
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch("/submit.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => {
                return resp.json();
            })
            .then((data) => {
                console.log("resp from POST /submit/bio.json", data);
                if (data.success) {
                    this.editMode = false;
                    location.reload();
                }
            })
            .catch((err) => console.log("Error in POST /submit/bio", err));
    }

    render() {
        return (
            <>
                {this.state.editMode && (
                    <Paper variant="outlined" sx={{ height: "100%" }}>
                        <TextField
                            name="bio"
                            type="text"
                            defaultValue={this.props.bio}
                            onChange={this.inputUpdate}
                        ></TextField>

                        <Button onClick={this.handleSubmit} variant="contained">
                            Save Bio
                        </Button>
                    </Paper>
                )}
                {!this.state.editMode && this.props.bio && (
                    <Paper elevation={0} sx={{ height: "100%" }}>
                        {this.props.bio}
                        <Button onClick={this.editBio} variant="contained">
                            Edit Bio
                        </Button>
                    </Paper>
                )}
                {!this.state.editMode && !this.props.bio && (
                    <Button onClick={this.editBio} variant="contained">
                        Edit Bio
                    </Button>
                )}
            </>
        );
    }
}

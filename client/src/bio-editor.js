import { Component } from "react";
import { Box, Container, Grid } from "@mui/material";

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
                <Box sx={{ border: 1 }}>
                    {this.state.editMode && (
                        <div>
                            <textarea
                                name="bio"
                                type="text"
                                defaultValue={this.props.bio}
                                onChange={this.inputUpdate}
                            ></textarea>
                            <button onClick={this.handleSubmit}>
                                Save Bio
                            </button>
                        </div>
                    )}
                    {!this.state.editMode && this.props.bio && (
                        <div>
                            {this.props.bio}
                            <button onClick={this.editBio}>Edit Bio</button>
                        </div>
                    )}
                    {!this.state.editMode && !this.props.bio && (
                        <div>
                            <button onClick={this.editBio}>Add Bio</button>
                        </div>
                    )}
                </Box>
            </>
        );
    }
}

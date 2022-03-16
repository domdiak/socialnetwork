import { Component } from "react";
import { ProfilePic } from "./profile-pic";
import { BioEditor } from "./bio-editor.js";
import {
    AppBar,
    Toolbar,
    Typography,
    Avatar,
    Grid,
    Paper,
    Box,
} from "@mui/material";

export class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        // this.showUploader = this.showUploader.bind(this);
    }
    render() {
        return (
            <>
                <Grid container sx={{ marginTop: "200px", height: "50%" }}>
                    <Grid item xs={3}>
                        <Box sx={{ height: "50%" }}>
                            <ProfilePic
                                url={this.props.profilePic}
                                showUploader={this.props.showUploader}
                            >
                                {" "}
                            </ProfilePic>
                            <p>
                                {" "}
                                First name: {this.props.first} Last name:{" "}
                                {this.props.last}{" "}
                            </p>
                        </Box>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper>
                            <BioEditor
                                bio={this.props.bio}
                                setBio={this.props.setBio}
                            >
                                {" "}
                            </BioEditor>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}></Grid>
                </Grid>
            </>
        );
    }
}

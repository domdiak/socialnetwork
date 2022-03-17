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
    Button,
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
                <Box sx={{ paddingTop: "15vh" }}>
                    <Grid
                        container
                        sx={{
                            height: "70vh",
                            bgcolor: "lightblue",
                            justifyContent: "center",
                        }}
                    >
                        <Grid
                            item
                            xs={3}
                            sx={{
                                border: "solid 2px",
                            }}
                        >
                            <Box
                                sx={{
                                    textAlign: "center",
                                    padding: "20px",
                                    margin: "10px",
                                }}
                            >
                                <ProfilePic
                                    url={this.props.profilePic}
                                    showUploader={this.props.showUploader}
                                >
                                    {" "}
                                </ProfilePic>
                                <Button
                                    variant="contained"
                                    sx={{ margin: "10px" }}
                                >
                                    {" "}
                                    Search Friends{" "}
                                </Button>
                                <Button variant="contained">
                                    {" "}
                                    [Placeholder]{" "}
                                </Button>
                            </Box>
                        </Grid>
                        <Grid
                            item
                            xs={3}
                            sx={{ border: "solid 2px" }}
                            container
                        >
                            <Grid item sx={{ height: "20%" }}>
                                <Typography
                                    variant="h4"
                                    sx={{ padding: "5px", margin: "5px" }}
                                >
                                    {" "}
                                    {this.props.first} {this.props.last}{" "}
                                </Typography>
                            </Grid>
                            <Grid item sx={{ height: "80%" }}>
                                <BioEditor
                                    bio={this.props.bio}
                                    setBio={this.props.setBio}
                                >
                                    {" "}
                                </BioEditor>
                            </Grid>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "solid 2px" }}>
                            <Typography variant="h4"> Friends:</Typography>
                        </Grid>
                    </Grid>
                </Box>
            </>
        );
    }
}

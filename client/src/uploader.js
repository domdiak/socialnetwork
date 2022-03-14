import { Component } from "react";
import { Box, TextField, Grid, Button, Paper } from "@mui/material";
// import CloseIcon from "@mui/icons-material";

export class Uploader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profilePic: {},
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.files[0],
        });
        // console.log("e.target.files[0]", e.target.files[0]);
    }
    handleSubmit(e) {
        e.preventDefault();
        console.log("this.state.profilePic", this.state.profilePic);
        const fd = new FormData();
        fd.append("file", this.state.profilePic);
        fetch("/upload/profile", {
            method: "POST",
            body: fd,
        })
            .then((resp) => {
                return resp.json();
            })
            .then((data) => {
                console.log("Data from POST /upload/profilepic", data);
                this.props.updateProfilePic(data.profilepic);
            })

            .catch((err) => {
                console.log("Error in POST /upload/profilepic", err);
            });

        // 1. Prevent the default behavior
        // 2. Create a new form data instance
        // 3. Append your file to it (use the state)
        // 4. Send data over to the server with a fetch request
        // 5. If the request is successful update the profilePic
        // property form the state of App (use updateProfilePic)
    }

    render() {
        return (
            <Grid>
                <Paper
                    elevation={5}
                    sx={{
                        p: 2,
                        height: "70vh",
                        width: "50vw",
                        margin: "10vh auto",
                    }}
                >
                    <Grid align="center">
                        <Box
                            component="img"
                            src={"./defaultPic.jpeg"}
                            sx={{ maxWidth: "50%", borderRadius: "50%" }}
                        ></Box>
                        <Box
                            component="form"
                            onSubmit={this.handleSubmit}
                            sx={{ width: "50%", px: 4 }}
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ margin: "8px 0" }}
                                onClick={this.handleSubmit}
                            >
                                {" "}
                                Upload
                            </Button>
                            <TextField
                                name="profilePic"
                                type={"file"}
                                onChange={this.handleChange}
                            ></TextField>
                        </Box>
                    </Grid>
                    <p onClick={this.props.hideUploader}> X </p>
                </Paper>
            </Grid>
        );
    }
}

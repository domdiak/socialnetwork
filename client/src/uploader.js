import { Component } from "react";
import {
    Box,
    TextField,
    Grid,
    Button,
    Paper,
    Input,
    IconButton,
} from "@mui/material";
// import CloseIcon from "@mui/icons-material";
// import CloseIcon from "@mui/icons-material/CloseIcon";

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
            <Grid
                container
                sx={{
                    position: "fixed",
                    top: "15vh",
                    height: "100vh",
                    backgroundColor: "rgba(255,140,105,0.5)",
                }}
            >
                {" "}
                <Paper
                    elevation={5}
                    sx={{
                        p: 2,
                        height: "70vh",
                        width: "50vw",
                        margin: "0 auto",
                        borderRadius: "10px",
                        position: "relative",
                    }}
                >
                    <Grid align="center">
                        <Box
                            component="img"
                            src={"./defaultPic.jpeg"}
                            sx={{
                                maxWidth: "50%",
                                borderRadius: "50%",
                                marginTop: "20px",
                            }}
                        ></Box>
                        <Box
                            component="form"
                            onSubmit={this.handleSubmit}
                            sx={{ width: "80%" }}
                        >
                            <Grid
                                container
                                spacing={2}
                                justifyContent="space-evenly"
                            >
                                <Grid item xs={5}>
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
                                </Grid>
                                <Grid item xs={5}>
                                    <TextField
                                        name="profilePic"
                                        type={"file"}
                                        onChange={this.handleChange}
                                    ></TextField>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Box
                        component="p"
                        onClick={this.props.hideUploader}
                        sx={{
                            position: "absolute",
                            top: "0",
                            right: "0",
                            margin: "3px",
                        }}
                    >
                        X
                    </Box>
                </Paper>
            </Grid>
        );
    }
}

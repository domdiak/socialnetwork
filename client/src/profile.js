import { Component } from "react";
import { ProfilePic } from "./profile-pic";
import { BioEditor } from "./bio-editor.js";
import { AppBar, Toolbar, Typography, Avatar } from "@mui/material";

export class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        // this.showUploader = this.showUploader.bind(this);
    }
    render() {
        return (
            <>
                <Grid container></Grid>
                <div className="profile">
                    <h1 onClick={this.props.showUploader}> Profile </h1>
                    <p>
                        {" "}
                        First name: {this.props.first} Last name:{" "}
                        {this.props.last}{" "}
                    </p>
                    {/* You need to pass the values here */}
                    <ProfilePic
                        url={this.props.profilePic}
                        showUploader={this.props.showUploader}
                    >
                        {" "}
                    </ProfilePic>
                    <BioEditor bio={this.props.bio} setBio={this.props.setBio}>
                        {" "}
                    </BioEditor>
                </div>
            </>
        );
    }
}

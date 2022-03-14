import { Component } from "react";
import Logo from "./logo";
import { Uploader } from "./uploader.js";
import { Profile } from "./profile.js";
import { ProfilePic } from "./profile-pic";
import { BioEditor } from "./bio-editor.js";
import { AppBar, Toolbar, Typography, Avatar } from "@mui/material";

export class App extends Component {
    constructor() {
        super();

        this.state = {
            first: "",
            last: "",
            email: "",
            profilePic: undefined,
            bio: "",
            uploaderVisible: false,
        };

        // If you don't bind your methods, make sure you use arrow functions
        // when passing them over to other components to preserve your context
        this.showUploader = this.showUploader.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.updateProfilePic = this.updateProfilePic.bind(this);
    }

    componentDidMount() {
        fetch("/user/data.json")
            .then((res) => res.json())
            .then((userData) => {
                console.log("userData on mounting:", userData);
                this.setState(userData);
            });
    }

    showUploader() {
        this.setState({ uploaderVisible: true });
    }
    hideUploader() {
        this.setState({ uploaderVisible: false });
    }

    updateProfilePic(newProfilePicUrl) {
        this.setState({ profilePic: newProfilePicUrl });
    }

    setBio(addedBio) {
        this.setState({ bio: addedBio });
    }

    render() {
        // const { profilePic, first, last } = this.props;

        return (
            <div id={"app"}>
                <AppBar elevation={0}>
                    <Toolbar sx={{ height: "10vh" }}>
                        <Logo />
                        <ProfilePic
                            url={this.state.profilePic}
                            firstName={this.state.first}
                            lastName={this.state.last}
                            showUploader={this.showUploader}
                        />
                    </Toolbar>
                </AppBar>
                <Profile
                    id={this.state.id}
                    first={this.state.first}
                    last={this.state.last}
                    profilePic={this.state.profilePic}
                    showUploader={this.showUploader}
                    bio={this.state.bio}
                    setBio={this.setBio}
                >
                    <ProfilePic></ProfilePic>
                    <BioEditor> </BioEditor>
                </Profile>
                {this.state.uploaderVisible && (
                    <Uploader
                        hideUploader={this.hideUploader}
                        updateProfilePic={this.updateProfilePic}
                    />
                )}
            </div>
        );
    }
}

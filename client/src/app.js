import { Component } from "react";
import Logo from "./logo";
import { Uploader } from "./uploader.js";
import { Profile } from "./profile.js";
import { ProfilePic } from "./profile-pic";
import { FindPeople } from "./find-people";
import { BioEditor } from "./bio-editor.js";
import { OtherProfile } from "./other-profile.js";
import { AppBar, Toolbar } from "@mui/material";
// import { useParams, useHistory } from "react-router";
import { Route, BrowserRouter } from "react-router-dom";

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
            <>
                <BrowserRouter>
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
                    <Route exact path="/">
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
                    </Route>
                    {this.state.uploaderVisible && (
                        <Uploader
                            hideUploader={this.hideUploader}
                            updateProfilePic={this.updateProfilePic}
                        />
                    )}
                    <Route path="/find">
                        <FindPeople> </FindPeople>
                    </Route>
                    <Route path="/user/:otherUserId">
                        <OtherProfile />
                    </Route>
                </BrowserRouter>
            </>
        );
    }
}

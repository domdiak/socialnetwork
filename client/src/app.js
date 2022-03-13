import { Component } from "react";
import { ProfilePic } from "./profile-pic";
import Logo from "./logo";
import { Uploader } from "./uploader.js";

export class App extends Component {
    constructor() {
        super();

        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            profilePic: undefined,
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
    // You could make a toggleUploader method that handles both hiding
    // and showing

    updateProfilePic(newProfilePicUrl) {
        this.setState({ profilePic: newProfilePicUrl });
    }

    render() {
        const { profilePic, first, last } = this.props;

        return (
            <div id={"app"}>
                <Logo />
                <ProfilePic
                    url={this.state.profilePic}
                    firstName={this.state.firstName}
                    lastName={this.state.lastName}
                    showUploader={this.showUploader}
                />
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

import { Component } from "react";

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
            <div id={"uploader"}>
                <form onSubmit={this.handleSubmit}>
                    <input
                        name="profilePic"
                        type={"file"}
                        onChange={this.handleChange}
                    />
                    <button>Upload</button>
                </form>
                <p onClick={this.props.hideUploader}> X </p>
            </div>
        );
    }
}

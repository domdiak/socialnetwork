import { Component } from "react";
import { ProfilePic } from "./profile-pic";
import Logo from "./logo";

export class App extends Component {
    constructor() {
        super();

        this.state = {
            first: "",
            last: "",
            email: "",
            profilePic: "",
        };
    }
    componentDidMount() {
        fetch("/user")
            .then((res) => res.json())
            .then((userData) => {
                console.log(userData);
                this.setState(userData);
            });
    }
    render() {
        return (
            <>
                <Logo />
                <ProfilePic />
                <div> App</div>;
            </>
        );
    }
}

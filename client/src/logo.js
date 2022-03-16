import ReactDOM from "react-dom";
import Welcome from "./welcome";
import Button from "@mui/material/Button";

export default function Logo() {
    const imgStyle = {
        maxWidth: "10%",
    };

    return (
        <>
            <img style={imgStyle} src="./logosn.jpg" />
        </>
    );
}

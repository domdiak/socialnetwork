import ReactDOM from "react-dom";
import Welcome from "./welcome";
import Button from "@mui/material/Button";

export default function Logo() {
    function logout() {
        fetch("/user/id.json")
            .then((response) => response.json())
            .then((data) => {
                data.userId = null;
                console.log("User logged out, cookies:", data.userId);
            });
    }

    return (
        <>
            <img src="./logo.jpg" />
            {/* <Button variant="contained" onClick={logout}>
                {" "}
                Logout
            </Button> */}
        </>
    );
}

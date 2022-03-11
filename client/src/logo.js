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
        ReactDOM.render(<Welcome />, document.querySelector("main"));
    }

    return (
        <>
            <h1> Logo</h1>
            <Button variant="contained" onClick={logout}>
                {" "}
                Logout
            </Button>
        </>
    );
}

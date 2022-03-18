import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import { Button } from "@mui/material";

export function FriendButton() {
    const { otherUserId } = useParams();
    // const { status, setStatus } = useState();
    const [buttonText, setButtonText] = useState("");
    const [status, setStatus] = useState();
    const btnSendRequest = "Send a friend request";
    const statusSendRequest = "sendRequest";
    const statusNoRequest = "noRequest";

    const handleClick = () => {
        // POST request if request has not been made
        if (status === statusNoRequest) {
            setStatus(statusSendRequest);
            fetch("/friendship-status", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    otherUserId: otherUserId,
                    action: status,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("Data from POST /friendship-status", data);
                });
        }
    };

    useEffect(() => {
        let abort = false;

        fetch(`/friendship/${otherUserId}.json`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Response from GET /friendship/:id", data);
                if (!data.requestMade) {
                    setButtonText(btnSendRequest);
                    setStatus(statusNoRequest);
                }
            });
        return () => {
            abort = true;
        };
    }, []);

    return (
        <>
            <Button variant="contained" onClick={handleClick}>
                {" "}
                {buttonText}{" "}
            </Button>
        </>
    );
}

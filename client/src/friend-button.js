import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import { Button, TextField, Box } from "@mui/material";

export function FriendButton() {
    const buttonText = {
        send: "Send a friend request",
        accept: "Accept a friend request",
        cancel: "Cancel a friend request",
    };

    // let action = {
    //     sendRequest: 1,
    //     cancelRequest: 2,
    //     acceptRequest: 3,
    // };

    const { otherUserId } = useParams();
    const [button, setButton] = useState("");
    const [status, setStatus] = useState("");
    const [confirmed, setConfirmed] = useState(false);

    const handleClick = () => {
        // POST request if request has not been made
        console.log("Current status after clicking", status);
        fetch("/friendship-status", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                otherUserId: otherUserId,
                status: status,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                // console.log("Data from POST /friendship-status", data);
                // setStatus(data.status);
                // console.log("Current status:", status);
                location.reload();
            });
    };

    useEffect(() => {
        let abort = false;
        // console.log("status on loading the page:", status);

        fetch(`/friendship/${otherUserId}.json`)
            .then((res) => res.json())
            .then((data) => {
                // console.log("Response from GET /friendship/:id", data);
                // If no request in the DB, show the Send Friend Request Button
                if (data.status === 1) {
                    setStatus(data.status);
                    setButton(buttonText.send);
                }
                // Status 2 == cancel request
                if (data.status === 2) {
                    setStatus(data.status);
                    setButton(buttonText.cancel);
                }
                // Status 3 == accept request
                if (data.status === 3) {
                    setStatus(data.status);
                    setButton(buttonText.accept);
                }
                // status 4 == request accepted
                if (data.status === 4) {
                    setConfirmed(true);
                }
            });
        return () => {
            abort = true;
        };
    }, []);

    return (
        <>
            {!confirmed && (
                <Button variant="contained" onClick={handleClick}>
                    {" "}
                    {button}{" "}
                </Button>
            )}
            {confirmed && <Box> Friends </Box>}
        </>
    );
}

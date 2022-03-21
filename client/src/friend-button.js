import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import { Button } from "@mui/material";

export function FriendButton() {
    const statusNoRequest = "noRequest";
    const statusSendRequest = "sendRequest";
    const statusCancelRequest = "cancelRequest";
    const statusAcceptRequest = "acceptRequest";

    const btnSendRequest = "Send a friend request";
    const btnAcceptRequest = "Accept a friend request";
    const btnCancelRequest = "Cancel a friend request";

    const { otherUserId } = useParams();
    // const { status, setStatus } = useState();
    const [buttonText, setButtonText] = useState("");
    const [status, setStatus] = useState(statusNoRequest);

    const handleClick = () => {
        // POST request if request has not been made
        if (status === statusNoRequest) {
            // Removed for now
            // setStatus("statusSendRequest");
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
                    setStatus(data.status);
                    console.log("Current status:", status);
                    location.reload();
                });
        }
    };

    useEffect(() => {
        let abort = false;
        console.log("status on loading the page:", status);

        fetch(`/friendship/${otherUserId}.json`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Response from GET /friendship/:id", data);
                // If no request in the DB, show the Send Friend Request Button
                if (data.status === statusNoRequest) {
                    setButtonText(btnSendRequest);
                } else {
                    // If request has been made, show accept button if cookie = recipient; if cookie = sender, show cancel button
                    console.log("data in else", data);
                    if (
                        !data.rows[0].accepted_status &&
                        data.rows[0].id_recipient == otherUserId
                    ) {
                        setButtonText(btnCancelRequest);
                        setStatus(statusCancelRequest);
                    } else {
                        setButtonText(btnAcceptRequest);
                        setStatus(statusAcceptRequest);
                    }
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

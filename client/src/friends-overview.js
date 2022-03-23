import { Route, BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getList, acceptFriend, cancelRequest } from "./redux/friends/slice";
import { useState, useEffect } from "react";
import { Grid, Box, Paper, Button } from "@mui/material";

export default function FriendsOverview() {
    const dispatch = useDispatch();

    // Feeding data from redux
    const requests = useSelector(
        (state) =>
            state.friends &&
            state.friends.filter((friend) => !friend.accepted_status)
    );

    const friends = useSelector(
        (state) =>
            state.friends &&
            state.friends.filter((friend) => friend.accepted_status)
    );

    console.log("friends", friends);

    // Load the list of friends/connections requests on mounting the page
    useEffect(() => {
        let abort = false;
        fetch("/friends-overview.json")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log("data", data.rows);
                dispatch(getList(data.rows));
            });

        return () => {
            abort = true;
        };
    }, []);

    const handleAccept = (id) => {
        fetch("/accept-friend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                otherUserId: id,
            }),
        }).then(() => {
            dispatch(acceptFriend(id));
        });
    };

    const handleUnfriend = (id) => {
        fetch("/unfriend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                otherUserId: id,
            }),
        }).then(() => {
            dispatch(cancelRequest(id));
        });
    };

    return (
        <>
            <Box style={{ marginTop: "15vh" }}>
                <h3> Friends </h3>
                <Grid container>
                    <Grid item>
                        {friends &&
                            friends.map((friend, index) => {
                                return (
                                    <Paper key={index}>
                                        {friend.first} {friend.last}
                                        <Button
                                            variant="contained"
                                            onClick={() =>
                                                handleUnfriend(friend.id)
                                            }
                                        >
                                            {" "}
                                            Unfriend{" "}
                                        </Button>
                                    </Paper>
                                );
                            })}
                    </Grid>
                </Grid>
                <h3> Friend Requests </h3>
                <Grid container>
                    <Grid item>
                        {requests &&
                            requests.map((request, index) => {
                                return (
                                    <Paper key={index}>
                                        {request.first} {request.last}
                                        <Button
                                            variant="contained"
                                            onClick={() =>
                                                handleAccept(request.id)
                                            }
                                        >
                                            {" "}
                                            Accept{" "}
                                        </Button>
                                    </Paper>
                                );
                            })}
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

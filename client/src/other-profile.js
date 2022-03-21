import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import { Grid, Typography, Button } from "@mui/material";
import { FriendButton } from "./friend-button.js";

export function OtherProfile() {
    const [user, setUser] = useState({});
    const [success, setSuccess] = useState(false);

    const { otherUserId } = useParams();
    const history = useHistory();

    useEffect(() => {
        let abort = false;

        console.log("Profile ID requested for viewing:", otherUserId);
        console.log();

        fetch(`/user/${otherUserId}.json`)
            .then((res) => res.json())
            .then((user) => {
                // console.log("Fetch user info:", user);
                if (!abort) {
                    setUser(user);
                }
                // Redirects to profile that's logged in
                if (user.ownProfile) {
                    history.push("/");
                }
            });
        return () => {
            abort = true;
        };
    }, []);

    return (
        <>
            {!success && <h2> User doesnt exist </h2>}
            <Grid
                container
                sx={{
                    marginTop: "15vh",
                    height: "75vh",
                    justifyContent: "center",
                }}
            >
                <Grid
                    item
                    xs={4}
                    sx={{ border: "1px solid black", justifyContent: "center" }}
                    container
                >
                    <Grid item>
                        <img
                            style={{
                                height: "300px",
                                width: "300px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                margin: "20px",
                            }}
                            src={user.profilePic}
                        ></img>
                    </Grid>
                    <Grid item>
                        <FriendButton> </FriendButton>
                    </Grid>
                </Grid>
                <Grid
                    item
                    xs={6}
                    direction="column"
                    sx={{ border: "1px solid black" }}
                    container
                >
                    <Grid item xs={3}>
                        <Typography variant="h6">
                            {user.first} {user.last}
                        </Typography>
                        {user.bio}
                    </Grid>
                    <Grid item xs={3} sx={{ border: "1px solid black" }}>
                        <Typography variant="h6"> Friends: </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

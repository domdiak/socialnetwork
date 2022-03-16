import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Grid, Paper } from "@mui/material";

export function OtherProfile() {
    const [user, setUser] = useState({});

    const { otherUserId } = useParams();

    useEffect(() => {
        let abort = false;

        console.log("Profile ID requested for viewing:", otherUserId);

        fetch(`/user/${otherUserId}.json`)
            .then((res) => res.json())
            .then((user) => {
                if (!abort) {
                    setUser(user);
                    console.log("user", user);
                }
            });
        return () => {
            abort = true;
        };
    }, []);

    return (
        <>
            <Grid container>
                <Grid item>
                    <Paper>
                        {user.first} {user.last} {user.bio}
                        <img src={user.profilePic}></img>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}

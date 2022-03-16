import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import { Grid, Paper } from "@mui/material";

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
                console.log("Fetch user info:", user);
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

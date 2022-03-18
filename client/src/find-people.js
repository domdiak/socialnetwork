import { useState, useEffect } from "react";
import { Grid, Paper, Typography, TextField } from "@mui/material";

export function FindPeople() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        let abort = false;

        fetch(`/users/search?searchterm=${searchTerm}`)
            .then((res) => res.json())
            .then((users) => {
                if (!abort) {
                    setUsers(users);
                }
            });

        return () => (abort = true);
    }, [searchTerm]);

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <>
            <Grid
                container
                spacing={2}
                sx={{
                    marginTop: "15vh",
                    justifyContent: "center",
                    height: "60vh",
                }}
            >
                <Grid
                    item
                    xs={3}
                    sx={{ border: "1px solid black", padding: "5px" }}
                >
                    <Typography variant="h4"> Find Friends </Typography>
                    <TextField
                        label="Type name"
                        onChange={handleChange}
                        fullWidth
                    ></TextField>
                </Grid>
                <Grid item xs={6} sx={{ border: "1px solid black" }}>
                    <Grid container spacing={2} sx={{ gridAutoRows: "100%" }}>
                        {users.map((user) => (
                            <Grid
                                item
                                xs={6}
                                key={user.id}
                                sx={{ height: "100%" }}
                            >
                                <Paper
                                    elevation={2}
                                    sx={{ borderRadius: "50px" }}
                                    onClick={() => {
                                        location.replace(`/user/${user.id}`);
                                    }}
                                >
                                    <Grid container alignItems="center">
                                        <img
                                            style={{
                                                height: "100px",
                                                width: "100px",
                                                borderRadius: "50px",
                                                objectFit: "cover",
                                            }}
                                            src={user.profilepic}
                                        ></img>
                                        <Typography
                                            variant="h6"
                                            sx={{ padding: "5px" }}
                                        >
                                            {user.first} {user.last}
                                        </Typography>
                                    </Grid>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

import { useState, useEffect } from "react";
import { AppBar, Toolbar, Grid, Paper } from "@mui/material";

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
            <label> Find Friends</label>
            <input onChange={handleChange} />
            <Grid container direction="column" spacing={2}>
                {users.map((user) => (
                    <Grid key={user.id} item xs={4}>
                        <Paper>
                            {user.first} {user.last}
                            <img src={user.profilepic}></img>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}

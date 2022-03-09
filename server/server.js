const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("../database/db.js");
// Middleware required for hasing passwords
const { hash, compare } = require("./bycrypt.js");

// Middlewar required to generate encrypted cookies for each session
const cookieSession = require("cookie-session");

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
);

app.use(express.json());

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

// Routes ------------------------------------------

app.post("/register.json", (req, res) => {
    const { first, last, email, password } = req.body;
    hash(password)
        .then((hashedPassword) => {
            db.registerUser(first, last, email, hashedPassword).then(
                ({ rows }) => {
                    req.session.userId = rows[0].id;
                    console.log("Cookies on /register.json", req.session);
                }
            );
        })
        .catch((err) => {
            console.log("Error in hash.password function", err);
        });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

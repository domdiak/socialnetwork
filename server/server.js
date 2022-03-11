const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("../database/db.js");
// Middleware required for hasing passwords
const { hash, compare } = require("./bycrypt.js");

const { sendEmail } = require("./ses.js");

// Middlewar required to generate encrypted cookies for each session
const cookieSession = require("cookie-session");

//Middleware used to generated random strings
const cryptoRandomString = require("crypto-random-string");
const secretCode = cryptoRandomString({
    length: 6,
});

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

// POST /register --------------------------------
app.post("/register.json", (req, res) => {
    const { first, last, email, password } = req.body;
    hash(password)
        .then((hashedPassword) => {
            db.registerUser(first, last, email, hashedPassword).then(
                ({ rows }) => {
                    req.session.userId = rows[0].id;
                    console.log("Cookies on /register.json", req.session);
                    res.json({ success: true });
                }
            );
        })
        .catch((err) => {
            console.log("Error in hash.password function", err);
            res.json({ success: false });
        });
});

// POST /login ------------------------------------------------
app.post("/login.json", (req, res) => {
    const { email, password } = req.body;
    console.log("req.body", req.body);
    db.getPassword(email)
        .then(({ rows }) => {
            // Checks if user exists
            if (rows.length === 0) {
                res.json({ success: false });
            } else {
                compare(password, rows[0].password)
                    .then((match) => {
                        if (match) {
                            console.log("Successful login.");
                            console.log("Cookies on Login", req.session);
                            req.session.userId = rows[0].id;
                        }
                    })
                    .catch((err) =>
                        console.log("Error in comparePassowrd", err)
                    );
            }
        })
        .catch((err) => console.log("Error in getPassword", err));
});

// POST /reset ----- View 1 ------------------------
app.post("/password/reset/start", (req, res) => {
    const { email } = req.body;
    db.checkIfExists(email)
        .then(({ rows }) => {
            // console.log("Rows in /password/reset/start", rows);
            if (rows.length === 0) {
                res.json({ success: false });
            } else {
                // console.log("rowsemail", rows[0].email);
                // console.log("secretCode", secretCode);
                db.addResetCode(email, secretCode)
                    .then(({ rows }) => {
                        const subject = "Reset code";
                        console.log("Rows in addResetCode", rows);
                        sendEmail(rows[0].email, rows[0].code, subject)
                            .then(res.json({ success: true }))
                            .catch((err) => {
                                console.log("Error in sendEmail", err);
                                // Not suure if this is right
                                res.json({ success: false });
                            });
                    })
                    .catch((err) => console.log("Error in addResetCode", err));
            }
        })
        .catch((err) => console.log("Error checkIfExists", err));
});

// POST /reset ----- View 2 ------------------------

app.post("/password/reset/verify", (req, res) => {
    const { email, code, password } = req.body;
    db.verifyResetCode(email, code)
        .then(({ rows }) => {
            if (rows.length === 0) {
                res.json({ success: false });
            } else {
                console.log("Rows in verifyResetCode:", rows);
                console.log("newPassword", password);
                hash(password)
                    .then((hashedPassword) => {
                        db.updatePassword(email, hashedPassword)
                            .then(({ rows }) => {
                                console.log("Rows in updatePassword", rows);
                                res.json({ success: true });
                            })
                            .catch((err) =>
                                console.log("Error in updatePassword", err)
                            );
                    })
                    .catch((err) => console.log("Error in hashPassword", err));
            }
        })
        .catch((err) => console.log("Error in verifyResetCode", err));
});

// It keeps resetting userId to the last user that logged in
app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

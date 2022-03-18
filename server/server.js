const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("../database/db.js");
const s3 = require("./s3");
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

// Multer middlewar ------------------------------------
const multer = require("multer");
const uidSafe = require("uid-safe");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename: function (req, file, callback) {
        uidSafe(24).then((uid) => {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
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
                            req.session.userId = rows[0].id;
                            console.log("Cookies on Login", req.session);
                            res.json({ success: true });
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
                        // console.log("Rows in addResetCode", rows);
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
                // console.log("Rows in verifyResetCode:", rows);
                // console.log("newPassword", password);
                hash(password)
                    .then((hashedPassword) => {
                        db.updatePassword(email, hashedPassword)
                            .then(({ rows }) => {
                                // console.log("Rows in updatePassword", rows);
                                res.json({ success: true });
                            })
                            .catch((err) => {
                                console.log("Error in updatePassword", err);
                                res.json({ success: false });
                            });
                    })
                    .catch((err) => console.log("Error in hashPassword", err));
            }
        })
        .catch((err) => console.log("Error in verifyResetCode", err));
});

// Route for adding bio

app.post("/submit.json", (req, res) => {
    console.log("SaveBio got hit");
    const { userId } = req.session;
    const { bio } = req.body;
    console.log("bio", bio);
    db.setBio(bio, userId)
        .then(({ rows }) => {
            console.log("Rows in setBio", rows);
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("Error in setBio", err);
            res.json({ success: false });
        });
});

// Route for uploading images

app.post("/upload/profile", uploader.single("file"), s3.upload, (req, res) => {
    console.log("/upload got hit");
    console.log("req.file:", req.file);
    const { userId } = req.session;
    console.log("userId", userId);
    db.updateProfilePic(
        `https://s3.amazonaws.com/socialnetworkdominik/${req.file.filename}`,
        userId
    )
        .then((data) => {
            // console.log(data);
            return res.json(data.rows[0]);
        })
        .catch((err) => {
            console.log("Error in updateProfilePic", err);
        });
});

// It keeps resetting userId to the last user that logged in
app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});

// GET request to fetch userData on mounting app.js
app.get("/user/data.json", function (req, res) {
    // console.log("UserId in GET /user/data.json", req.session.userId);
    const { userId } = req.session;
    db.getUserInfo(userId)
        .then(({ rows }) => {
            // console.log("Rows in getUserInfo", rows);
            return res.json(rows[0]);
        })
        .catch((err) => {
            console.log("Error in getUserInfo", err);
        });
});

// GET request to search users

app.get("/users/search", (req, res) => {
    // console.log("Search got hit");
    if (req.query.searchterm === "") {
        db.searchRecentUsers()
            .then(({ rows }) => {
                return res.json(rows);
            })
            .catch((err) => {
                console.log("Error in GET searchRecentUsers", err);
            });
    } else {
        db.searchUsers(req.query.searchterm)
            .then(({ rows }) => {
                return res.json(rows);
            })
            .catch((err) => {
                console.log("Error in GET searchUsers", err);
            });
    }
});

// GET request to show OtherProfile

app.get("/user/:id.json", (req, res) => {
    const otherProfileId = req.params.id;
    const loggedUserId = req.session.userId;
    db.getUserInfo(otherProfileId)
        .then(({ rows }) => {
            if (loggedUserId === rows[0].otherProfileId) {
                return res.json({ ownProfile: true });
            } else if (rows[0] === 0) {
                return res.json({ success: false });
            } else {
                return res.json(rows[0]);
            }
        })
        .catch((err) => {
            console.log("Error in getUserInfo", err);
        });
});

// Friend connection routes ------------------------------

app.get("/friendship/:id.json", (req, res) => {
    const loggedUserId = req.session.userId;
    const otherUserId = req.params.id;
    db.checkStatus(loggedUserId, otherUserId).then(({ rows }) => {
        // Check if friendship request has ever been made
        if (rows.length === 0) {
            return res.json({ requestMade: false });
        }
    });
});

app.post("/friendship-status", (req, res) => {
    console.log("req.body", req.body);
});

app.get("/logout", (req, res) => {
    req.session.userId = null;
    res.redirect("/");
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

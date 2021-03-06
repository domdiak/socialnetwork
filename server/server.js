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
            // console.log("checkStatus1", rows);
            // 1 = Send request
            return res.json({ status: 1 });
        }
        if (!rows[0].accepted_status && rows[0].id_sender === loggedUserId) {
            // console.log("checkStatus2", rows);
            // 2 = cancel request
            return res.json({ status: 2 });
        }
        if (!rows[0].accepted_status && rows[0].id_recipient === loggedUserId) {
            // console.log("checkStatus3", rows);
            // 3 = accept request
            return res.json({ status: 3 });
        } else {
            // console.log("checkStatus4", rows);
            // 4 = accepted
            return res.json({ status: 4 });
        }
    });
});

app.post("/friendship-status", (req, res) => {
    const { otherUserId, status } = req.body;
    const loggedUserId = req.session.userId;
    // console.log("Status on clicking:", status);
    if (status === 1) {
        db.sendRequest(loggedUserId, otherUserId)
            .then(({ rows }) => {
                return res.json({ status: "success" });
            })
            .catch((err) => {
                console.log("Error in sendRequest", err);
            });
    }
    if (status === 2) {
        db.cancelRequest(loggedUserId, otherUserId)
            .then(({ rows }) => {
                return res.json({ status: "success" });
            })
            .catch((err) => {
                console.log("Error in cancelRequest", err);
            });
    }
    if (status === 3) {
        db.acceptRequest(otherUserId, loggedUserId)
            .then(({ rows }) => {
                return res.json({ status: "success" });
            })
            .catch((err) => console.log("Error in acceptRequest", err));
    }
});

app.get("/friends-overview.json", (req, res) => {
    const loggedUserId = req.session.userId;
    db.getFriends(loggedUserId)
        .then(({ rows }) => {
            // console.log("Data from getFriends", rows);
            return res.json({ rows });
        })
        .catch((err) => console.log("Error in getFriends", err));
});

app.post("/accept-friend", (req, res) => {
    const { otherUserId } = req.body;
    const loggedUserId = req.session.userId;
    db.acceptRequest(otherUserId, loggedUserId)
        .then(({ rows }) => {
            // console.log("Results in acceptRequest POST /accept-friend", rows);
        })
        .catch((err) => {
            console.log("Error in acceptRequest on POST /accept-friend", err);
        });
});

app.post("/unfriend", (req, res) => {
    const { otherUserId } = req.body;
    const loggedUserId = req.session.userId;
    db.cancelRequest(otherUserId, loggedUserId)
        .then(({ rows }) => {
            // console.log("Results in acceptRequest POST /cancel-friend", rows);
        })
        .catch((err) => {
            console.log("Error in acceptRequest on POST /accept-friend", err);
        });
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

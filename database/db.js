const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/socialnetwork`
);

module.exports.registerUser = (first, last, email, password) => {
    const sqlAddSignature = `
    INSERT INTO users (first, last, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING id
    `;
    return db.query(sqlAddSignature, [first, last, email, password]);
};

module.exports.getPassword = (email) => {
    const sqlPassword = `
    SELECT password, id 
    FROM users 
    WHERE (email = $1)
    `;
    return db.query(sqlPassword, [email]);
};

module.exports.checkIfExists = (email) => {
    const sqlCheckIfExists = `
    SELECT email 
    FROM users 
    WHERE (email = $1)
    `;
    return db.query(sqlCheckIfExists, [email]);
};

module.exports.addResetCode = (email, code) => {
    const sqlStoreResetCode = `
    INSERT INTO reset_codes (email, code)
    VALUES ($1, $2)
    RETURNING *
    `;
    return db.query(sqlStoreResetCode, [email, code]);
};

module.exports.verifyResetCode = (email, code) => {
    const sqlVerifyResetCode = `
    SELECT code 
    FROM reset_codes
    WHERE email = $1
    AND code = $2
    AND timestamp - timestamp < INTERVAL '10 minutes'
    ORDER BY timestamp ASC 
    LIMIT 1;
    `;
    return db.query(sqlVerifyResetCode, [email, code]);
};

module.exports.updatePassword = (email, password) => {
    const sqlUpdatePassword = `
    UPDATE users
    SET password = $2
    WHERE email = $1
    RETURNING *;
    `;
    // Error: bind message supplies 2 parameters, but prepared statement "" requires 1
    return db.query(sqlUpdatePassword, [email, password]);
};

module.exports.getUserInfo = (userId) => {
    const sqlGetUserInfo = `
    SELECT id, first, last, profilepic AS "profilePic", bio
    FROM users 
    WHERE id = $1;
    `;
    return db.query(sqlGetUserInfo, [userId]);
};

module.exports.updateProfilePic = (profilepic, userId) => {
    const sqlUpdateProfilePic = `
    UPDATE users
    SET profilepic = $1
    WHERE id = $2
    RETURNING *;
    `;
    return db.query(sqlUpdateProfilePic, [profilepic, userId]);
};

module.exports.setBio = (bio, userId) => {
    const sqlSetBio = `
    UPDATE users
    SET bio = $1
    WHERE id = $2
    RETURNING *;
    `;
    return db.query(sqlSetBio, [bio, userId]);
};

module.exports.searchUsers = (searchTerm) => {
    const sqlSearchUsers = `
    SELECT id, first, last, profilepic 
    FROM users 
    WHERE first ILIKE $1
    ORDER BY id DESC
    LIMIT 3;
    `;
    return db.query(sqlSearchUsers, [searchTerm + "%"]);
};

module.exports.searchRecentUsers = () => {
    const sqlSearchRecentUsers = `
    SELECT id, first, last, profilepic
    FROM users
    ORDER BY id DESC
    LIMIT 6
    `;
    return db.query(sqlSearchRecentUsers);
};

module.exports.checkStatus = (senderId, recipientId) => {
    const sqlCheckStatus = `
    SELECT accepted_status 
    FROM friend_connections 
    WHERE (id_sender = $1
        AND id_recipient = $2)
    OR (id_sender = $2
        AND id_recipient = $1) 
    `;

    return db.query(sqlCheckStatus, [senderId, recipientId]);
};

module.exports.sendRequest = (senderId, recipientId) => {
    const sqlSendRequest = `
    INSERT INTO friend_connections (id_sender, id_recipient, accepted_status)
    VALUES ($1, $2, true);
    `;
};
module.exports.acceptRequest = () => {};
module.exports.cancelRequest = () => {};

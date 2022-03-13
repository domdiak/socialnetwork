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
    SELECT first, last, profilepic 
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

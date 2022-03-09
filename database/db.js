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

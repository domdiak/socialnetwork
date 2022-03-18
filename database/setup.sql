DROP TABLE IF EXISTS users; 


CREATE TABLE users (
    id              SERIAL PRIMARY KEY, 
    first           VARCHAR(255) NOT NULL CHECK (first != ''),
    last            VARCHAR(255) NOT NULL CHECK (last != ''),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    profilepic      VARCHAR,
    bio             VARCHAR (255),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

 CREATE TABLE reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,
    code VARCHAR NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE friend_connections (
    id_connection SERIAL PRIMARY KEY,
    id_sender INT NOT NULL,
    id_recipient INT NOT NULL,
    accepted_status BOOLEAN DEFAULT false, 
  );
DROP TABLE IF EXISTS users;

CREATE TABLE users(
  id INT PRIMARY KEY,
  username VARCHAR NOT NULL,
  fullname VARCHAR,
  location VARCHAR
);
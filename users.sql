DROP TABLE IF EXISTS user_languages;

DROP TABLE IF EXISTS users;

CREATE TABLE users(
  id INT PRIMARY KEY,
  username VARCHAR NOT NULL,
  fullname VARCHAR,
  location VARCHAR
);

CREATE TABLE user_languages(
  user_id INT NOT NULL,
  programming_language VARCHAR,
  CONSTRAINT userid_language PRIMARY KEY (user_id, programming_language),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
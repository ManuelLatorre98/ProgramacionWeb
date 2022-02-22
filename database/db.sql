CREATE DATABASE database_operations;

USE database_operations;

--User table--
CREATE TABLE users(
    id INT(11) NOT NULL AUTO_INCREMENT,
    email NVARCHAR(320) NOT NULL,
    password VARCHAR(16) NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE users
    MODIFY password VARCHAR(60);
DESCRIBE users;

--Operations table--
CREATE TABLE operations(
    id INT(11) NOT NULL AUTO_INCREMENT,
    concept TEXT NOT NULL,
    amount  INT NOT NULL,
    date timestamp NOT NULL,
    type VARCHAR(16) NOT NULL,
    user_id INT(11),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    PRIMARY KEY (id)
);

ALTER TABLE operations
    MODIFY user_id INT(11) NOT NULL;

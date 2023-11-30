-- DROP SCHEMA test;
CREATE DATABASE IF NOT EXISTS test;
USE test;

CREATE TABLE user (
	username varchar(30) PRIMARY KEY,
	password varbinary(72) NOT NULL,
	bio varchar(255),
	user_img TEXT
)

CREATE TABLE post (
    post_id CHAR(36) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    user_id VARCHAR(30),
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    city_id INT,
    coordinates POINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(username)
);

CREATE TABLE postimages (
    image_id CHAR(36) PRIMARY KEY,
    imageUrl VARCHAR(255),
    thumbUrl VARCHAR(255),
    post_id CHAR(36),
    image_caption VARCHAR(255),
    FOREIGN KEY (post_id) REFERENCES post(post_id)
);



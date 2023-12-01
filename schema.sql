DROP SCHEMA test;
CREATE DATABASE IF NOT EXISTS test;
USE test;

CREATE TABLE user (
	username varchar(30) PRIMARY KEY,
	password varchar(72) NOT NULL,
	bio varchar(255),
	user_img TEXT
);

CREATE TABLE post (
    post_id CHAR(36) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    user_id VARCHAR(30),
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    city_id INT,
    coordinates POINT NOT NULL,
    UNIQUE(post_id),
    FOREIGN KEY (user_id) REFERENCES user(username)
);

CREATE TABLE postimages (
    image_id CHAR(36) NOT NULL,
    imageUrl VARCHAR(255),
    thumbUrl VARCHAR(255),
    post_id CHAR(36),
    image_caption VARCHAR(255),
    UNIQUE(image_id),
    FOREIGN KEY (post_id) REFERENCES post(post_id)
);

CREATE TABLE tags (
    tag VARCHAR(20),
    tag_created_by VARCHAR(30),
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tag),
    FOREIGN KEY (tag_created_by) REFERENCES user(username)
);

DELIMITER //
CREATE PROCEDURE GetUserHash(IN p_username VARCHAR(30))
BEGIN
    SELECT password as hash FROM user WHERE username = p_username;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE RegisterUser(IN p_username VARCHAR(30), IN p_password_hash VARBINARY(72))
BEGIN
    IF EXISTS (SELECT 1 FROM user WHERE username = p_username) THEN
        SELECT 'Username exists' as result;
    ELSE
        INSERT INTO user (username, password) VALUES (p_username, p_password_hash);
        SELECT 'Success' as result;
    END IF;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE GetAllTags()
BEGIN
    SELECT tag  FROM tags;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE CreateTag(IN p_tag VARCHAR(20), IN p_tag_created_by VARCHAR(30))
BEGIN
    IF EXISTS (SELECT 1 FROM tags WHERE tag = p_tag) THEN
        SELECT 'Tag already exists' as result;
    ELSE
        INSERT INTO tags (tag, tag_created_by) VALUES (p_tag, p_tag_created_by);
        SELECT 'Success' as result;
    END IF;
END //
DELIMITER ;




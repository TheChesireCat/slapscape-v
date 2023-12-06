DROP SCHEMA test_2;
CREATE DATABASE IF NOT EXISTS test_2;
USE test_2;

CREATE TABLE user (
	username varchar(30) PRIMARY KEY,
	password varchar(72) NOT NULL,
    user_img varchar(255),
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
	bio varchar(255)
);

CREATE TABLE post (
    post_id CHAR(36) NOT NULL,
    username VARCHAR(30) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    coordinates POINT NOT NULL,
    UNIQUE(post_id),
    FOREIGN KEY (username) REFERENCES user(username) ON DELETE CASCADE
);

CREATE TABLE postimages (
    imageUrl VARCHAR(255),
    post_id CHAR(36),
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(imageUrl),
    FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE
);

CREATE TABLE tags (
    tag VARCHAR(20) PRIMARY KEY,
    tag_created_by VARCHAR(30),
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tag_created_by) REFERENCES user(username) ON DELETE SET NULL
);

CREATE TABLE posttags (
    post_id CHAR(36),
    tag VARCHAR(20),
    FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE,
    FOREIGN KEY (tag) REFERENCES tags(tag)
);


DELIMITER //
CREATE PROCEDURE DeleteUser(IN p_username VARCHAR(30))
BEGIN
    DELETE FROM user WHERE username = p_username;
END //
DELIMITER ;


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

DROP PROCEDURE IF EXISTS GetUserData;

DELIMITER //
CREATE PROCEDURE GetUserData(IN p_username VARCHAR(30))
BEGIN
    IF EXISTS (SELECT 1 FROM user WHERE username = p_username) THEN
        SELECT username, bio, user_img FROM user WHERE username = p_username;
    ELSE
        SELECT 'User does not exist' as result;
    END IF;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE UpdateUserData(IN p_username CHAR(30),IN p_password varchar(72) , IN p_bio VARCHAR(255), IN p_user_img VARCHAR(255))
BEGIN
    UPDATE user SET bio = p_bio, user_img = p_user_img, password = p_password WHERE username = p_username;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE UpdateUserBio(IN p_username CHAR(30), IN p_bio VARCHAR(255))
BEGIN
    UPDATE user SET bio = p_bio WHERE username = p_username;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE UpdateUserPassword(IN p_username CHAR(30), IN p_password VARCHAR(72))
BEGIN
    UPDATE user SET password = p_password WHERE username = p_username;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE UpdateUserImg(IN p_username CHAR(30), IN p_user_img VARCHAR(255))
BEGIN
    UPDATE user SET user_img = p_user_img WHERE username = p_username;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE CreatePost(IN p_post_id CHAR(36), IN p_username VARCHAR(30), IN p_title VARCHAR(100), IN p_description TEXT, IN p_coordinates POINT)
BEGIN
    INSERT INTO post (post_id, username, title, description, coordinates) VALUES (p_post_id, p_username, p_title, p_description, p_coordinates);
    SELECT p_post_id as post_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE CreatePostImage(IN p_imageUrl VARCHAR(255), IN p_post_id CHAR(36))
BEGIN
    INSERT INTO postimages (imageUrl, post_id) VALUES (p_imageUrl, p_post_id);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE CreatePostTag(IN p_post_id CHAR(36), IN p_tag VARCHAR(20))
BEGIN
    INSERT INTO posttags (post_id, tag) VALUES (p_post_id, p_tag);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetAllPosts()
BEGIN
    SELECT post_id, username, title, ST_AsText(coordinates) AS coordinates
    FROM post;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetPostsInViewport(IN p_sw_lat DECIMAL(10, 8), IN p_sw_lng DECIMAL(11, 8), IN p_ne_lat DECIMAL(10, 8), IN p_ne_lng DECIMAL(11, 8))
BEGIN
    
    select post_id, title, date_created, ST_X(coordinates) as lat, ST_Y(coordinates) AS lon
    from post 
    where ST_Contains(
        ST_GeomFromText(
            CONCAT(
                'Polygon((', p_sw_lat, ' ', p_sw_lng, ', ', p_sw_lat, ' ', p_ne_lng, ', ', p_ne_lat, ' ', p_ne_lng, ', ', p_ne_lat, ' ', p_sw_lng, ', ', p_sw_lat, ' ', p_sw_lng, '))'
                )
            ), coordinates
        );
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE GetPostInfo(IN p_post_id CHAR(36))
BEGIN
    SELECT p.post_id, DATE_FORMAT(p.date_created,"%D %b %Y") as date_str, u.username, u.user_img, p.title, p.description, ST_X(p.coordinates) as lat, ST_Y(p.coordinates) AS lon
    FROM post as p
    JOIN user as u ON p.username = u.username
    WHERE post_id = p_post_id;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE GetPostImages(IN p_post_id CHAR(36))
BEGIN
    SELECT imageUrl
    FROM postimages
    WHERE post_id = p_post_id;
END //
DELIMITER ;

-- here on wards

DELIMITER //
CREATE PROCEDURE GetPostTags(IN p_post_id CHAR(36))
BEGIN
    SELECT tag
    FROM posttags
    WHERE post_id = p_post_id;
END //
DELIMITER 


CREATE TABLE comments (
    post_id CHAR(36) NOT NULL,
    username VARCHAR(30) NOT NULL,
    comment TEXT NOT NULL,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES user(username) ON DELETE CASCADE
);

DELIMITER //
CREATE PROCEDURE CreateComment(IN p_post_id CHAR(36), IN p_username VARCHAR(30), IN p_comment TEXT)
BEGIN
    INSERT INTO comments (post_id, username, comment) VALUES (p_comment_id, p_post_id, p_username, p_comment);
    SELECT "Comment created" as result;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetPostComments(IN p_post_id CHAR(36))
BEGIN
    SELECT u.username as username, u.user_img as user_img, c.comment as comment, DATE_FORMAT(c.date_created,"%D %b %Y") as date_str
    FROM comments as c
    JOIN user as u ON u.username = c.username
    WHERE post_id = p_post_id
    ORDER BY c.date_created DESC;
END //
DELIMITER ;

CREATE TABLE likes (
    post_id CHAR(36) NOT NULL,
    username VARCHAR(30) NOT NULL,
    FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES user(username) ON DELETE CASCADE
)

DELIMITER //
CREATE PROCEDURE AddOrRemoveLike(IN p_post_id CHAR(36), IN p_username VARCHAR(30))
BEGIN
    IF EXISTS (SELECT 1 FROM likes WHERE post_id = p_post_id AND username = p_username) THEN
        DELETE FROM likes WHERE post_id = p_post_id AND username = p_username;
        SELECT 'Removed like' as result;
    ELSE
        INSERT INTO likes (post_id, username) VALUES (p_post_id, p_username);
        SELECT 'Added like' as result;
    END IF;
END //
DELIMITER ;

DELIMITER //

CREATE FUNCTION GetPostLiked(p_post_id CHAR(36), p_username VARCHAR(30))
RETURNS BOOLEAN
NOT DETERMINISTIC
READS SQL DATA
BEGIN
    RETURN (SELECT EXISTS (
        SELECT 1 FROM likes 
        WHERE post_id = p_post_id AND username = p_username
    ));
END //

DELIMITER //
CREATE PROCEDURE GetTotalLikes(IN p_post_id CHAR(36))
BEGIN
    SELECT COUNT(*) as total_likes
    FROM likes
    WHERE post_id = p_post_id;
END //
DELIMITER ;

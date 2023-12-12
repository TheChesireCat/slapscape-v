-- DROP DATABASE IF EXISTS slapscape_v2;
-- CREATE DATABASE IF NOT EXISTS slapscape_v2;
-- USE slapscape_v2;

-- -- CREATE TABLE state (
-- --     state_name VARCHAR(30) PRIMARY KEY,
-- --     state_polygon POLYGON,
-- --     UNIQUE(state_name)
-- -- );

-- -- CREATE TABLE zipcode (
-- --     zipcode_num CHAR(5) NOT NULL PRIMARY KEY,
-- --     state_name VARCHAR(30),
-- --     zipcode_polygon POLYGON,
-- --     city_name VARCHAR(50),
-- --     FOREIGN KEY (state_name) REFERENCES state(state_name) ON DELETE CASCADE
-- -- );
-- -- Error Code: 1064. You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'Error Code: 1830. Column 'username' cannot be NOT NULL: needed in a foreign key ' at line 1

-- -- Error Code: 1830. Column 'username' cannot be NOT NULL: needed in a foreign key constraint 'post_ibfk_1' SET NULL

CREATE TABLE userAcc (
	username VARCHAR(15) PRIMARY KEY,
	password BYTEA NOT NULL,
	user_img VARCHAR(255),
	date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	bio VARCHAR(150),
	UNIQUE(username)
);

CREATE TABLE post (
	post_id CHAR(36) NOT NULL,
	username VARCHAR(15),
	title VARCHAR(100) NOT NULL,
	description VARCHAR(255) NOT NULL,
	date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	coordinates POINT NOT NULL,
	UNIQUE(post_id),
	FOREIGN KEY (username) REFERENCES userAcc(username) ON DELETE SET NULL
);

CREATE TABLE postimages (
	imageUrl VARCHAR(255),
	post_id CHAR(36),
	date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UNIQUE(imageUrl),
	FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE SET NULL
);

CREATE TABLE tags (
	tag VARCHAR(20) PRIMARY KEY,
	tag_created_by VARCHAR(15),
	date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (tag_created_by) REFERENCES userAcc(username) ON DELETE SET NULL
);

CREATE TABLE posttags (
	post_id CHAR(36),
	tag VARCHAR(20),
	FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE,
	FOREIGN KEY (tag) REFERENCES tags(tag)
);

CREATE TABLE comments (
	post_id CHAR(36) NOT NULL,
	username VARCHAR(15),
	comment VARCHAR(150) NOT NULL,
	date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE,
	FOREIGN KEY (username) REFERENCES userAcc(username) ON DELETE SET NULL
);

CREATE TABLE likes (
	post_id CHAR(36) NOT NULL,
	username VARCHAR(15) NOT NULL,
	FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE,
	FOREIGN KEY (username) REFERENCES userAcc(username) ON DELETE CASCADE
);


CREATE OR REPLACE PROCEDURE DeleteUser(p_username VARCHAR(15))
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM userAcc WHERE username = p_username;
END;
$$;


-- CREATE OR REPLACE PROCEDURE GetUserHash(p_username VARCHAR(15))
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--     SELECT password AS hash FROM userAcc WHERE username = p_username;
-- END;
-- $$;

CREATE OR REPLACE FUNCTION GetUserHash(p_username VARCHAR(15))
RETURNS BYTEA
LANGUAGE plpgsql
AS $$
DECLARE
    hash BYTEA;
BEGIN
    SELECT password INTO hash FROM userAcc WHERE username = p_username;
    RETURN hash;
END;
$$;



-- CREATE OR REPLACE PROCEDURE RegisterUser(p_username VARCHAR(15), p_password_hash BYTEA)
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--     IF EXISTS (SELECT 1 FROM userAcc WHERE username = p_username) THEN
--         SELECT 'Username exists' AS message;
--     ELSE
--         INSERT INTO userAcc (username, password) VALUES (p_username, p_password_hash);
--         SELECT 'Success' AS message;
--     END IF;
-- END;
-- $$;

CREATE OR REPLACE FUNCTION RegisterUser(p_username VARCHAR(15), p_password_hash BYTEA)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM useracc WHERE username = p_username) THEN
        RETURN 'Username exists';
    ELSE
        INSERT INTO useracc (username, password) VALUES (p_username, p_password_hash);
        RETURN 'Success';
    END IF;
END;
$$;


CREATE OR REPLACE PROCEDURE GetAllTags()
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT tag FROM tags;
END;
$$;


CREATE OR REPLACE PROCEDURE CreateTag(p_tag VARCHAR(20), p_tag_created_by VARCHAR(15))
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM tags WHERE tag = p_tag) THEN
        RAISE NOTICE 'Tag already exists';
    ELSE
        INSERT INTO tags (tag, tag_created_by) VALUES (p_tag, p_tag_created_by);
        RAISE NOTICE 'Success';
    END IF;
END;
$$;


CREATE OR REPLACE PROCEDURE GetUserData(p_username VARCHAR(15))
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM userAcc WHERE username = p_username) THEN
        SELECT username, bio, user_img FROM userAcc WHERE username = p_username;
    ELSE
        RAISE NOTICE 'User does not exist';
    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE UpdateUserData(p_username CHAR(30), p_password VARCHAR(72), p_bio VARCHAR(255), p_user_img VARCHAR(255))
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE userAcc SET bio = p_bio, user_img = p_user_img, password = p_password WHERE username = p_username;
END;
$$;

CREATE OR REPLACE PROCEDURE UpdateUserBio(p_username CHAR(30), p_bio VARCHAR(255))
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE userAcc SET bio = p_bio WHERE username = p_username;
END;
$$;


CREATE OR REPLACE PROCEDURE UpdateUserPassword(p_username CHAR(30), p_password VARBINARY(72))
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE userAcc SET password = p_password WHERE username = p_username;
END;
$$;

CREATE OR REPLACE PROCEDURE UpdateUserImg(p_username CHAR(30), p_user_img VARCHAR(255))
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE userAcc SET user_img = p_user_img WHERE username = p_username;
END;
$$;

CREATE OR REPLACE PROCEDURE CreatePost(p_post_id CHAR(36), p_username VARCHAR(15), p_title VARCHAR(100), p_description VARCHAR(150), p_coordinates POINT)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO post (post_id, username, title, description, coordinates) VALUES (p_post_id, p_username, p_title, p_description, p_coordinates);
    RAISE NOTICE 'Post ID: %', p_post_id;
END;
$$;


CREATE OR REPLACE PROCEDURE CreatePostImage(p_imageUrl VARCHAR(255), p_post_id CHAR(36))
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO postimages (imageUrl, post_id) VALUES (p_imageUrl, p_post_id);
END;
$$;

CREATE OR REPLACE PROCEDURE CreatePostTag(p_post_id CHAR(36), p_tag VARCHAR(20))
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO posttags (post_id, tag) VALUES (p_post_id, p_tag);
END;
$$;

CREATE OR REPLACE PROCEDURE GetAllPosts()
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT post_id, username, title, ST_AsText(coordinates) AS coordinates FROM post;
END;
$$;

CREATE OR REPLACE PROCEDURE GetPostsInViewport(p_sw_lat DECIMAL(10, 8), p_sw_lng DECIMAL(11, 8), p_ne_lat DECIMAL(10, 8), p_ne_lng DECIMAL(11, 8))
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT post_id, title, date_created, ST_X(coordinates) as lat, ST_Y(coordinates) AS lon FROM post 
    WHERE ST_Contains(
        ST_MakePolygon(ST_MakeLine(ARRAY[
            ST_SetSRID(ST_Point(p_sw_lng, p_sw_lat), 4326), 
            ST_SetSRID(ST_Point(p_ne_lng, p_sw_lat), 4326),
            ST_SetSRID(ST_Point(p_ne_lng, p_ne_lat), 4326),
            ST_SetSRID(ST_Point(p_sw_lng, p_ne_lat), 4326),
            ST_SetSRID(ST_Point(p_sw_lng, p_sw_lat), 4326)
        ])),
        coordinates
    );
END;
$$;

CREATE OR REPLACE PROCEDURE GetPostInfo(p_post_id CHAR(36))
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT p.post_id, to_char(p.date_created, 'DD Mon YYYY') as date_str, u.username, u.user_img, p.title, p.description, ST_X(p.coordinates) as lat, ST_Y(p.coordinates) AS lon
    FROM post AS p
    JOIN userAcc AS u ON p.username = u.username
    WHERE p.post_id = p_post_id;
END;
$$;


CREATE OR REPLACE PROCEDURE GetPostImages(p_post_id CHAR(36))
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT imageUrl
    FROM postimages
    WHERE post_id = p_post_id;
END;
$$;


CREATE OR REPLACE PROCEDURE GetPostTags(p_post_id CHAR(36))
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT tag
    FROM posttags
    WHERE post_id = p_post_id;
END;
$$;


CREATE OR REPLACE PROCEDURE CreateComment(p_post_id CHAR(36), p_username VARCHAR(15), p_comment VARCHAR(150))
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO comments (post_id, username, comment) VALUES (p_post_id, p_username, p_comment);
    RAISE NOTICE 'Comment created';
END;
$$;

CREATE OR REPLACE PROCEDURE GetPostComments(p_post_id CHAR(36))
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT u.username as username, u.user_img as user_img, c.comment as comment, to_char(c.date_created, 'DD Mon YYYY') as date_str
    FROM comments AS c
    JOIN userAcc AS u ON u.username = c.username
    WHERE post_id = p_post_id
    ORDER BY c.date_created DESC;
END;
$$;

CREATE OR REPLACE PROCEDURE AddOrRemoveLike(p_post_id CHAR(36), p_username VARCHAR(15))
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM likes WHERE post_id = p_post_id AND username = p_username) THEN
        DELETE FROM likes WHERE post_id = p_post_id AND username = p_username;
        RAISE NOTICE 'Removed like';
    ELSE
        INSERT INTO likes (post_id, username) VALUES (p_post_id, p_username);
        RAISE NOTICE 'Added like';
    END IF;
END;
$$;



CREATE OR REPLACE FUNCTION GetPostLiked(p_post_id CHAR(36), p_username VARCHAR(15))
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN (SELECT EXISTS (
        SELECT 1 FROM likes 
        WHERE post_id = p_post_id AND username = p_username
    ));
END;
$$;


CREATE OR REPLACE PROCEDURE GetTotalLikes(p_post_id CHAR(36))
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT COUNT(*) as total_likes
    FROM likes
    WHERE post_id = p_post_id;
END;
$$;


CREATE OR REPLACE PROCEDURE DeleteImage(p_imageUrl VARCHAR(255))
LANGUAGE plpgsql
AS $$
DECLARE
    postID CHAR(36);
    imageCount INT;
BEGIN
    SELECT post_id INTO postID FROM postimages WHERE imageUrl = p_imageUrl;

    IF postID IS NULL THEN
        RAISE NOTICE 'Image not found';
    ELSE
        SELECT COUNT(*) INTO imageCount FROM postimages WHERE post_id = postID;
        IF imageCount > 1 THEN
            DELETE FROM postimages WHERE imageUrl = p_imageUrl;
            RAISE NOTICE 'Image deleted';
        ELSE
            RAISE NOTICE 'Cannot delete the only image of the post';
        END IF;
    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE UpdatePostTitle(p_post_id CHAR(36), p_title VARCHAR(100))
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE post SET title = p_title WHERE post_id = p_post_id;
END;
$$;

CREATE OR REPLACE PROCEDURE UpdatePostDescription(p_post_id CHAR(36), p_description VARCHAR(150))
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE post SET description = p_description WHERE post_id = p_post_id;
END;
$$;

CREATE OR REPLACE PROCEDURE GetTotalPostsWithTag(p_tag VARCHAR(20))
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT COUNT(*) as total_posts
    FROM posttags
    WHERE tag = p_tag;
END;
$$;

CREATE OR REPLACE PROCEDURE GetPostsByTag(p_tag VARCHAR(20), p_page INT, p_posts_per_page INT)
LANGUAGE plpgsql
AS $$
DECLARE
    offset_val INT;
BEGIN
    offset_val := (p_page - 1) * p_posts_per_page;
    SELECT p.post_id, to_char(p.date_created, 'DD Mon YYYY') as date_str, u.username, u.user_img, p.title, p.description, ST_X(p.coordinates) as lat, ST_Y(p.coordinates) AS lon
    FROM post AS p
    JOIN posttags AS pt ON p.post_id = pt.post_id
    JOIN userAcc AS u ON p.username = u.username
    WHERE pt.tag = p_tag
    ORDER BY p.date_created DESC
    LIMIT p_posts_per_page OFFSET offset_val;
END;
$$;



CREATE OR REPLACE PROCEDURE GetTotalPostsByUser(p_username VARCHAR(15))
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT COUNT(*) as total_posts
    FROM post
    WHERE username = p_username;
END;
$$;


CREATE OR REPLACE PROCEDURE GetPostsByUser(p_username VARCHAR(15), p_page INT, p_posts_per_page INT)
LANGUAGE plpgsql
AS $$
DECLARE
    offset_val INT;
BEGIN
    offset_val := (p_page - 1) * p_posts_per_page;
    SELECT p.post_id, to_char(p.date_created, 'DD Mon YYYY') as date_str, u.username, u.user_img, p.title, p.description, ST_X(p.coordinates) as lat, ST_Y(p.coordinates) AS lon
    FROM post AS p
    JOIN userAcc AS u ON p.username = u.username
    WHERE p.username = p_username
    ORDER BY p.date_created DESC
    LIMIT p_posts_per_page OFFSET offset_val;
END;
$$;



CREATE OR REPLACE PROCEDURE GetTotalPostsLikedByUser(p_username VARCHAR(15))
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT COUNT(*) as total_posts
    FROM likes
    WHERE username = p_username;
END;
$$;

CREATE OR REPLACE PROCEDURE GetPostsLikedByUser(p_username VARCHAR(15), p_page INT, p_posts_per_page INT)
LANGUAGE plpgsql
AS $$
DECLARE
    offset_val INT;
BEGIN
    offset_val := (p_page - 1) * p_posts_per_page;
    SELECT p.post_id, to_char(p.date_created, 'DD Mon YYYY') as date_str, u.username, u.user_img, p.title, p.description, ST_X(p.coordinates) as lat, ST_Y(p.coordinates) AS lon
    FROM post AS p
    JOIN likes AS l ON p.post_id = l.post_id
    JOIN userAcc AS u ON p.username = u.username
    WHERE l.username = p_username
    ORDER BY p.date_created DESC
    LIMIT p_posts_per_page OFFSET offset_val;
END;
$$;

CREATE OR REPLACE PROCEDURE GetPostsPerTag()
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT tag, COUNT(*) as total_posts
    FROM posttags
    GROUP BY tag;
END;
$$;

CREATE OR REPLACE PROCEDURE GetTotalPostsByQuery(p_query VARCHAR(150))
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT COUNT(*) as total_posts
    FROM post
    WHERE LOWER(title) LIKE '%' || LOWER(p_query) || '%' OR LOWER(description) LIKE '%' || LOWER(p_query) || '%';
END;
$$;

CREATE OR REPLACE PROCEDURE GetPostsByQuery(p_query VARCHAR(150), p_page INT, p_posts_per_page INT)
LANGUAGE plpgsql
AS $$
DECLARE
    offset_val INT;
BEGIN
    offset_val := (p_page - 1) * p_posts_per_page;
    SELECT p.post_id, to_char(p.date_created, 'DD Mon YYYY') as date_str, u.username, u.user_img, p.title, p.description, ST_X(p.coordinates) as lat, ST_Y(p.coordinates) AS lon
    FROM post AS p
    JOIN userAcc AS u ON p.username = u.username
    WHERE LOWER(p.title) LIKE '%' || LOWER(p_query) || '%' OR LOWER(p.description) LIKE '%' || LOWER(p_query) || '%'
    ORDER BY p.date_created DESC
    LIMIT p_posts_per_page OFFSET offset_val;
END;
$$;


CREATE OR REPLACE PROCEDURE DeletePost(p_post_id CHAR(36))
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM post WHERE post_id = p_post_id;
END;
$$;

CREATE OR REPLACE PROCEDURE GetTotalPosts()
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT COUNT(*) as total_posts
    FROM post;
END;
$$;

CREATE OR REPLACE PROCEDURE GetTotalUsers()
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT COUNT(*) as total_users
    FROM userAcc;
END;
$$;


CREATE OR REPLACE PROCEDURE GetTotalImages()
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT COUNT(*) as total_images
    FROM postimages;
END;
$$;

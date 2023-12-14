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
	FOREIGN KEY (username) REFERENCES userAcc(username) ON DELETE SET NULL
);


CREATE OR REPLACE PROCEDURE DeleteUser(p_username VARCHAR(15))
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM userAcc WHERE username = p_username;
END;
$$;



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



CREATE OR REPLACE FUNCTION CreateTag(p_tag VARCHAR(20), p_tag_created_by VARCHAR(15))
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM tags WHERE tag = p_tag) THEN
        RETURN 'Tag already exists';
    ELSE
        INSERT INTO tags (tag, tag_created_by) VALUES (p_tag, p_tag_created_by);
        RETURN 'Success';
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION CreatePost(p_post_id CHAR(36), p_username VARCHAR(15), p_title VARCHAR(100), p_description VARCHAR(150), p_coordinates POINT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO post (post_id, username, title, description, coordinates) VALUES (p_post_id, p_username, p_title, p_description, p_coordinates);
    RETURN 'Post ID: %' || p_post_id;
END;
$$;

CREATE OR REPLACE FUNCTION CreatePostImage(p_imageUrl VARCHAR(255), p_post_id CHAR(36))
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO postimages (imageUrl, post_id) VALUES (p_imageUrl, p_post_id);
END;
$$;


CREATE OR REPLACE FUNCTION CreatePostTag(p_post_id CHAR(36), p_tag VARCHAR(20))
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO posttags (post_id, tag) VALUES (p_post_id, p_tag);
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



CREATE OR REPLACE FUNCTION AddOrRemoveLike(p_post_id CHAR(36), p_username VARCHAR(15))
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM likes WHERE post_id = p_post_id AND username = p_username) THEN
        DELETE FROM likes WHERE post_id = p_post_id AND username = p_username;
        RETURN 'Removed like';
    ELSE
        INSERT INTO likes (post_id, username) VALUES (p_post_id, p_username);
        RETURN 'Added like';
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



CREATE OR REPLACE FUNCTION DeleteImage(p_imageUrl VARCHAR(255))
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    postID CHAR(36);
    imageCount INT;
BEGIN
    SELECT post_id INTO postID FROM postimages WHERE imageUrl = p_imageUrl;

    IF postID IS NULL THEN
        RETURN 'Image not found';
    ELSE
        SELECT COUNT(*) INTO imageCount FROM postimages WHERE post_id = postID;
        IF imageCount > 1 THEN
            DELETE FROM postimages WHERE imageUrl = p_imageUrl;
           RETURN 'Image deleted';
        ELSE
            RETURN 'Cannot delete the only image of the post';
        END IF;
    END IF;
END;
$$;



CREATE OR REPLACE PROCEDURE DeletePost(p_post_id CHAR(36))
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM post WHERE post_id = p_post_id;
END;
$$;

"use server";

import sql from "@/app/lib/db";
import { executeQuery } from "@/app/lib/db";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { getJwtSecretKey, verifyJwtToken } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

export async function registerUser(prevState, formData) {
  const username = formData.get("username");
  const password = formData.get("password");
  if (username.length > 15) {
    return { error: "* Username must be less than 15 characters long" };
  }
  if (password.length < 8) {
    return { error: "* Password must be at least 8 characters long" };
  }
  if (password !== formData.get("confirmPassword")) {
    return { error: "* Passwords do not match" };
  }
  if (username.length < 3) {
    return { error: "* Username must be at least 3 characters long" };
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const result =
    await sql`SELECT RegisterUser(${username}, ${passwordHash}) as message`;
  if (result[0].message === "Success") {
    return redirect("/login");
  } else if (result[0].message === "Username exists") {
    return { error: "* Username exists" };
  }
  return { error: "* Database error during registration, contact Ankit" };
}

export async function loginUser(prevState, formData) {
  const username = formData.get("username");
  const password = formData.get("password");
  const result = await sql`SELECT GetUserHash(${username}) as hash`;
  if (!result[0].hash) {
    return { error: "* Invalid username or password" };
  }
  let uint8Array = new Uint8Array(result[0].hash);
  let decoder = new TextDecoder();
  let decodedString = decoder.decode(uint8Array);

  const match = await bcrypt.compare(password, decodedString);
  if (!match) {
    return { error: "* Invalid username or password" };
  }
  const jwtToken = await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(getJwtSecretKey());
  cookies().set("AUTH_TOKEN", jwtToken, { httpOnly: true, sameSite: "strict" });
  return redirect("/home");
}

export async function getAllTags() {
  const result = await sql`SELECT tag FROM tags`;
  return result || [];
}

export async function createTag(tag, user) {
  const result = await sql`SELECT CreateTag(${tag}, ${user}) as message`;
  revalidateTag("tags");
  return result[0][0];
}

export async function newPost(formData) {
  console.log(formData);
  const title = formData.get("title");
  const description = formData.get("description");
  const tags = formData.getAll("tags");
  const lat = formData.get("lat");
  const lng = formData.get("lng");
  if (!title || !description) {
    return { error: "* Title and description are required" };
  }
  const imageFiles = formData.getAll("images");
  if (!imageFiles || imageFiles.length === 0) {
    return { error: "* An Image is required" };
  }

  // files should be less than 5MB

  for (const imageFile of imageFiles) {
    if (imageFile.size > 5 * 1024 * 1024) {
      return { error: "* Image size should be less than 5MB" };
    }
  }

  const cropSettings = JSON.parse(formData.get("cropSettings"));

  // upload images/image to s3 and get the urls

  const imageList = [];

  for (let i = 0; i < imageFiles.length; i++) {
    const imageFile = imageFiles[i];
    let buffer = Buffer.from(await imageFile.arrayBuffer());

    // Check if there are crop settings for this image
    if (cropSettings[i]) {
      const { width, height, left, top } = cropSettings[i];
      buffer = await sharp(buffer)
        .extract({ width: width, height: height, left: left, top: top }) // Crop based on settings
        .toBuffer();
    }

    // Upload the (possibly cropped) image to S3
    const fileExtension = imageFile.name.split(".").pop();
    const filePath = `${uuidv4()}.${fileExtension}`;
    const client = new S3Client({ region: process.env.AWS_REGION });
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filePath,
      Body: buffer,
      ContentType: imageFile.type,
    });
    const response = await client.send(command);
    imageList.push("https://slapscape-bucket.s3.amazonaws.com/" + filePath);
  }

  const postId = uuidv4();
  const token = cookies().get("AUTH_TOKEN");
  const payload = await verifyJwtToken(token?.value);
  const username = payload.username;

  const result =
    await sql`SELECT CreatePost(${postId}, ${username}, ${title}, ${description}, POINT(${lng}, ${lat}))`;
  for (const imageUrl of imageList) {
    await sql`SELECT CreatePostImage(${imageUrl}, ${postId})`;
  }
  for (const tag of tags) {
    await sql`SELECT CreatePostTag(${postId}, ${tag})`;
  }

  return { message: "Success" };
}

export async function getPostsInBounds(neLat, neLng, swLat, swLng) {
  try {
    // console.log(neLat, neLng, swLat, swLng);
    const result = await sql`
    SELECT 
    post_id, 
    title, 
    date_created, 
    coordinates[0] as lon, 
    coordinates[1] AS lat
  FROM 
    post 
  WHERE 
  ST_Contains(
    ST_MakeEnvelope(${swLng}, ${swLat}, ${neLng}, ${neLat}, 4326),
    ST_SetSRID(ST_MakePoint(coordinates[0], coordinates[1]), 4326)
  )`;

    return result;
  } catch (error) {
    console.error("Error fetching posts within bounds:", error);
    return { error: "Error fetching posts" };
  }
}

export async function getUserData(user) {
  const result =
    await sql`SELECT u.username, u.bio, u.user_img FROM userAcc u WHERE u.username = ${user};`;
  return result[0];
}

export async function updateUserData(prevState, formData) {
  const password = formData.get("password");
  const bio = formData.get("bio");
  const file = formData.get("avatar");
  const username = formData.get("username");

  if (password) {
    if (password.length < 8) {
      return { error: "* Password must be at least 8 characters long" };
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const result =
      await sql`CALL UpdateUserPassword(${username}, ${passwordHash})`;
  }

  if (file.size > 0) {
    const fileExtension = file.name.split(".").pop();
    const filePath = `${uuidv4()}.${fileExtension}`;
    const client = new S3Client({ region: process.env.AWS_REGION });
    const buffer = Buffer.from(await file.arrayBuffer());
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filePath,
      Body: buffer,
      ContentType: file.type,
    });
    const response = await client.send(command);
    const avatar = "https://slapscape-bucket.s3.amazonaws.com/" + filePath;

    const result = await sql`CALL UpdateUserImg(${username}, ${avatar})`;
  }

  if (bio) {
    const result = await sql`CALL UpdateUserBio(${username}, ${bio})`;
  }

  revalidatePath("/home/user/", "page");
}

export async function logout() {
  cookies().delete("AUTH_TOKEN");
  redirect("/login");
}

export async function deleteUser(user) {
  const result = await sql`CALL DeleteUser(${user})`;

  cookies().delete("AUTH_TOKEN");
  redirect("/login");
}

export async function getPostTags(postId) {
  const result = await sql`SELECT tag FROM posttags WHERE post_id = ${postId};`;
  return result;
}

export async function getPostImages(postId) {
  const result =
    await sql`SELECT imageUrl FROM postimages WHERE post_id = ${postId};`;
  return result;
}

export async function getPostInfo(postId) {
  const result =
    await sql`SELECT p.post_id, to_char(p.date_created, 'DD Mon YYYY') as date_str, u.username, u.user_img, p.title, p.description, p.coordinates[1] as lat, p.coordinates[0] AS lon
    FROM post AS p
    LEFT JOIN userAcc AS u ON p.username = u.username
    WHERE p.post_id = ${postId};`;
  return result;
}

export async function getPostComments(postId) {
  const result =
    await sql`SELECT u.username as username, u.user_img as user_img, c.comment as comment, to_char(c.date_created, 'DD Mon YYYY') as date_str
  FROM comments AS c
  JOIN userAcc AS u ON u.username = c.username
  WHERE post_id = ${postId}
  ORDER BY c.date_created DESC;`;
  return result;
}

export async function getPostLiked(postId, username) {
  const result =
    await sql`SELECT GetPostLiked(${postId}, ${username}) as result`;
  return result;
}

export async function addOrRemoveLike(postId, username) {
  const result = await sql`SELECT AddOrRemoveLike(${postId}, ${username})`;
  // console.log(result);
  revalidatePath("/home/post/[id]", "page");
  return result[0][0];
}

export async function getTotalLikes(postId) {
  const result = await sql`SELECT COUNT(*) as total_likes
  FROM likes
  WHERE post_id = ${postId}`;
  return result;
}

export async function addComment(prevState, formData) {
  const comment = formData.get("commentText");
  const username = formData.get("username");
  const postId = formData.get("post_id");
  if (!comment) {
    return { error: "* Comment cannot be empty" };
  }
  const result =
    await sql`INSERT INTO comments (post_id, username, comment) VALUES (${postId}, ${username}, ${comment})`;
  revalidatePath("/home/post/[id]", "page");
}

export async function deleteImage(prevState, formData) {
  const imageUrl = formData.get("image");
  const result = await sql`
  SELECT DeleteImage(${imageUrl}) as message`;
  revalidatePath("/home/post/[id]/", "page");
  return result[0];
}

export async function updatePostTitle(prevState, formData) {
  const title = formData.get("title");
  const postId = formData.get("post_id");
  if (!title) {
    return { error: "* Title cannot be empty" };
  }

  const result =
    await sql`UPDATE post SET title = ${title} WHERE post_id = ${postId}`;
  revalidatePath("/home/post/[id]/", "page");
  return { result: "Edit successful" };
}

export async function updatePostDescription(prevState, formData) {
  const description = formData.get("description");
  const postId = formData.get("post_id");
  if (!description) {
    return { error: "* Description cannot be empty" };
  }
  const result =
    await sql`UPDATE post SET description = ${description} WHERE post_id = ${postId}`;
  revalidatePath("/home/post/[id]/", "page");
  return { result: "Edit successful" };
}

export async function getTotalPostsWithTag(tagId) {
  const result = await sql`SELECT COUNT(*) as total_posts
  FROM posttags
  WHERE tag = ${tagId}`;
  return result[0];
}

export async function getPostsByTag(tagId, page, postsPerPage) {
  const start = (page - 1) * postsPerPage;
  const result = await sql`
  SELECT p.post_id, to_char(p.date_created, 'DD Mon YYYY') as date_str, u.username, u.user_img, p.title, p.description, p.coordinates[1] as lat, p.coordinates[0] AS lon
    FROM post AS p
    LEFT JOIN posttags AS pt ON p.post_id = pt.post_id
    LEFT JOIN userAcc AS u ON p.username = u.username
    WHERE pt.tag = ${tagId}
    ORDER BY p.date_created DESC
    LIMIT ${postsPerPage} OFFSET ${start}`;
  return result;
}

export async function getTotalPostsByUser(username) {
  const result = await sql`
  SELECT COUNT(*) as total_posts FROM post WHERE username = ${username}`;
  return result[0];
}

export async function getPostsByUser(username, page, postsPerPage) {
  const start = (page - 1) * postsPerPage;
  
  const result = await sql`
  SELECT p.post_id, to_char(p.date_created, 'DD Mon YYYY') as date_str, u.username, u.user_img, p.title, p.description, p.coordinates[1] as lat, p.coordinates[0] AS lon
    FROM post AS p
    LEFT JOIN userAcc AS u ON p.username = u.username
    WHERE p.username = ${username}
    ORDER BY p.date_created DESC
    LIMIT ${postsPerPage} OFFSET ${start}`;
  return result;
}

export async function getTotalPostsLikedByUser(username) {
  const result = await sql`
  SELECT COUNT(*) as total_posts
  FROM likes
  WHERE username = ${username}`;
  return result[0];
}

export async function getPostsLikedByUser(username, page, postsPerPage) {
  const start = (page - 1) * postsPerPage;
  const result = await sql`
  SELECT p.post_id, to_char(p.date_created, 'DD Mon YYYY') as date_str, u.username, u.user_img, p.title, p.description, p.coordinates[1] as lat, p.coordinates[0] AS lon
    FROM post AS p
    LEFT JOIN likes AS l ON p.post_id = l.post_id
    LEFT JOIN userAcc AS u ON p.username = u.username
    WHERE l.username = ${username}
    ORDER BY p.date_created DESC
    LIMIT ${postsPerPage} OFFSET ${start}`;
  return result;
}

export async function getPostsPerTag() {
  const result = await sql`
  SELECT tag, COUNT(*) as total_posts
    FROM posttags
    GROUP BY tag;`;
  return result;
}

export async function getTotalPostsByQuery(query) {
  const result = await sql`
  SELECT COUNT(*) as total_posts
  FROM post
  WHERE LOWER(title) LIKE '%' || LOWER(${query}) || '%' OR LOWER(description) LIKE '%' || LOWER(${query}) || '%'`;
  return result[0];
}

export async function getPostsByQuery(query, page, postsPerPage) {
  const start = (page - 1) * postsPerPage;
  const result = await sql`
  SELECT p.post_id, to_char(p.date_created, 'DD Mon YYYY') as date_str, u.username, u.user_img, p.title, p.description, p.coordinates[1] as lat, p.coordinates[0] AS lon
    FROM post AS p
    LEFT JOIN userAcc AS u ON p.username = u.username
    WHERE LOWER(p.title) LIKE '%' || LOWER(${query}) || '%' OR LOWER(p.description) LIKE '%' || LOWER(${query}) || '%'
    ORDER BY p.date_created DESC
    LIMIT ${postsPerPage} OFFSET ${start}`;
  return result;
}

export async function deletePost(formData) {
  const postId = formData.get("post_id");
  const result = await sql`CALL DeletePost(${postId})`;
  redirect("/home");
}

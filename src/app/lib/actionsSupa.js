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
  // console.log(formData);
  const username = formData.get("username");
  const password = formData.get("password");
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
  const r = await sql`SELECT * FROM useracc`;
  console.log(r);
  const result =
    await sql`SELECT RegisterUser(${username}, ${passwordHash}) as message`;
  console.log(result[0]);
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
  // console.log(result);
  if (!result[0].hash) {
    return { error: "* Invalid username or password" };
  }
  // // console.log(result[0][0][0]);
  // console.log(JSON.stringify(result[0][0][0].hash));
  // console.log(password);

  // Create a Uint8Array from the byte array
  let uint8Array = new Uint8Array(result[0].hash);
  // Use TextDecoder to convert the Uint8Array to a string
  let decoder = new TextDecoder();
  let decodedString = decoder.decode(uint8Array);

  const match = await bcrypt.compare(password, decodedString);
  // console.log(match);
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
  console.log(result[0]);
  // const result = await executeQuery({
  //   query: "CALL GetAllTags()",
  // });
  //   console.log(result);
  return result || [];
}

export async function createTag(tag, user) {
  // const result = await executeQuery({
  //   query: "CALL CreateTag(?,?)",
  //   values: [tag, user],
  // });
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
  // console.log(imageFiles);
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

  // for (const imageFile of imageFiles) {
  //   const fileExtension = imageFile.name.split(".").pop();
  //   const filePath = `${uuidv4()}.${fileExtension}`;
  //   const client = new S3Client({ region: process.env.AWS_REGION });
  //   const buffer = Buffer.from(await imageFile.arrayBuffer());
  //   const command = new PutObjectCommand({
  //     Bucket: process.env.AWS_BUCKET_NAME,
  //     Key: filePath,
  //     Body: buffer,
  //     ContentType: imageFile.type,
  //   });
  //   const response = await client.send(command);
  //   imageList.push("https://slapscape-bucket.s3.amazonaws.com/" + filePath);
  // }

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

  // console.log(payload);

  // console.log({
  //   postId: postId,
  //   title: title,
  //   description: description,
  //   tags: tags,
  //   imageList: imageList,
  //   username: username,
  //   lat: lat,
  //   lng: lng,
  // });

  // await executeQuery({
  //   query: "CALL CreatePost(?,?,?,?,POINT(?,?))",
  //   values: [postId, username, title, description, lat, lng],
  // });

  const result = await sql`SELECT CreatePost(${postId}, ${username}, ${title}, ${description}, POINT(${lat}, ${lng}))`;
  for( const imageUrl of imageList){
    await sql`SELECT CreatePostImage(${imageUrl}, ${postId})`;
  }
  for( const tag of tags){
    await sql`SELECT CreatePostTag(${postId}, ${tag})`;
  }


  // for (const imageUrl of imageList) {
  //   await executeQuery({
  //     query: "CALL CreatePostImage(?,?)",
  //     values: [imageUrl, postId],
  //   });
  // }

  // for (const tag of tags) {
  //   await executeQuery({
  //     query: "CALL CreatePostTag(?,?)",
  //     values: [postId, tag],
  //   });
  // }

  // const query = "CALL CreatePost(?,?,?,?)";
  // const values = [title, description, username, coordinates];
  // const result = await executeQuery({ query, values });
  // console.log(result);

  return { message: "Success" };
}

export async function getPostsInBounds(neLat, neLng, swLat, swLng) {
  try {
    const result = await executeQuery({
      query: "CALL GetPostsInViewport(?,?,?,?)",
      values: [swLat, swLng, neLat, neLng],
    });

    // console.log(result);

    return result[0][0];
  } catch (error) {
    console.error("Error fetching posts within bounds:", error);
    return { error: "Error fetching posts" };
  }
}

export async function getAllPosts() {
  try {
    const result = await executeQuery({
      query: "CALL GetAllPosts()",
    });
    return result[0][0];
  } catch (error) {
    throw error;
  }
}

export async function getUserData(user) {
  const result = await executeQuery({
    query: "CALL GetUserData(?)",
    values: [user],
  });
  return result[0][0];
}

export async function updateUserData(prevState, formData) {
  const password = formData.get("password");
  const bio = formData.get("bio");
  const file = formData.get("avatar");
  const username = formData.get("username");

  // console.log(formData);

  if (password) {
    if (password.length < 8) {
      return { error: "* Password must be at least 8 characters long" };
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const result_2 = await executeQuery({
      query: "CALL UpdateUserPassword(?,?)",
      values: [username, passwordHash],
    });
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
    const result_3 = await executeQuery({
      query: "CALL UpdateUserImg(?,?)",
      values: [username, avatar],
    });
  }

  if (bio) {
    const result = await executeQuery({
      query: "CALL UpdateUserBio(?,?)",
      values: [username, bio],
    });
  }

  revalidatePath("/home/user/", "page");
}

export async function logout() {
  cookies().delete("AUTH_TOKEN");
  redirect("/login");
}

export async function deleteUser(user) {
  const result = await executeQuery({
    query: "CALL DeleteUser(?)",
    values: [user],
  });
  cookies().delete("AUTH_TOKEN");
  redirect("/login");
}




export async function getPostTags(postId) {
  const result = await executeQuery({
    query: "CALL GetPostTags(?)",
    values: [postId],
  });
  return result[0][0];
}

export async function getPostImages(postId) {
  const result = await executeQuery({
    query: "CALL GetPostImages(?)",
    values: [postId],
  });
  return result[0][0];
}

export async function getPostInfo(postId) {
  const result = await executeQuery({
    query: "CALL GetPostInfo(?)",
    values: [postId],
  });
  return result[0][0];
}

export async function getPostComments(postId) {
  const result = await executeQuery({
    query: "CALL GetPostComments(?)",
    values: [postId],
  });
  return result[0][0];
}

export async function getPostLiked(postId, username) {
  const result = await executeQuery({
    query: "SELECT GetPostLiked(?,?) as result",
    values: [postId, username],
  });
  return result[0][0];
}

export async function addOrRemoveLike(postId, username) {
  const result = await executeQuery({
    query: "CALL AddOrRemoveLike(?,?)",
    values: [postId, username],
  });
  revalidatePath("/home/post/[id]", "page");
  return result[0][0];
}

export async function getTotalLikes(postId) {
  const result = await executeQuery({
    query: "CALL GetTotalLikes(?)",
    values: [postId],
  });
  return result[0][0][0];
}

export async function addComment(prevState, formData) {
  const comment = formData.get("commentText");
  const username = formData.get("username");
  const postId = formData.get("post_id");
  if (!comment) {
    return { error: "* Comment cannot be empty" };
  }
  const result = await executeQuery({
    query: "CALL CreateComment(?,?,?)",
    values: [postId, username, comment],
  });
  revalidatePath("/home/post/[id]", "page");
}

export async function deleteImage(prevState, formData) {
  const imageUrl = formData.get("image");
  const result = await executeQuery({
    query: "CALL DeleteImage(?)",
    values: [imageUrl],
  });
  revalidatePath("/home/post/[id]/", "page");
  return result[0][0][0];
}

export async function updatePostTitle(prevState, formData) {
  // console.log(formData);
  const title = formData.get("title");
  const postId = formData.get("post_id");
  if (!title) {
    return { error: "* Title cannot be empty" };
  }
  const result = await executeQuery({
    query: "CALL UpdatePostTitle(?,?)",
    values: [postId, title],
  });
  revalidatePath("/home/post/[id]/", "page");
  return { result: "Edit successful" };
}

export async function updatePostDescription(prevState, formData) {
  const description = formData.get("description");
  const postId = formData.get("post_id");
  if (!description) {
    return { error: "* Description cannot be empty" };
  }
  const result = await executeQuery({
    query: "CALL UpdatePostDescription(?,?)",
    values: [postId, description],
  });
  revalidatePath("/home/post/[id]/", "page");
  return { result: "Edit successful" };
}

export async function getTotalPostsWithTag(tagId) {
  const result = await executeQuery({
    query: "CALL GetTotalPostsWithTag(?)",
    values: [tagId],
  });
  return result[0][0][0];
}

export async function getPostsByTag(tagId, page, postsPerPage) {
  const start = (page - 1) * postsPerPage;
  const result = await executeQuery({
    query: "CALL GetPostsByTag(?,?,?)",
    values: [tagId, start, postsPerPage],
  });
  return result[0][0];
}

export async function getTotalPostsByUser(username) {
  const result = await executeQuery({
    query: "CALL GetTotalPostsByUser(?)",
    values: [username],
  });
  return result[0][0][0];
}

export async function getPostsByUser(username, page, postsPerPage) {
  const start = (page - 1) * postsPerPage;
  const result = await executeQuery({
    query: "CALL GetPostsByUser(?,?,?)",
    values: [username, start, postsPerPage],
  });
  return result[0][0];
}

export async function getTotalPostsLikedByUser(username) {
  const result = await executeQuery({
    query: "CALL GetTotalPostsLikedByUser(?)",
    values: [username],
  });
  return result[0][0][0];
}

export async function getPostsLikedByUser(username, page, postsPerPage) {
  const start = (page - 1) * postsPerPage;
  const result = await executeQuery({
    query: "CALL GetPostsLikedByUser(?,?,?)",
    values: [username, start, postsPerPage],
  });
  return result[0][0];
}

export async function getPostsPerTag() {
  const result = await executeQuery({
    query: "CALL GetPostsPerTag()",
  });
  return result[0][0];
}

export async function getTotalPostsByQuery(query) {
  const result = await executeQuery({
    query: "CALL GetTotalPostsByQuery(?)",
    values: [query],
  });
  return result[0][0][0];
}

export async function getPostsByQuery(query, page, postsPerPage) {
  const start = (page - 1) * postsPerPage;
  const result = await executeQuery({
    query: "CALL GetPostsByQuery(?,?,?)",
    values: [query, start, postsPerPage],
  });
  return result[0][0];
}

export async function deletePost(formData) {
  const postId = formData.get("post_id");
  // console.log(postId);
  const result = await executeQuery({
    query: "CALL DeletePost(?)",
    values: [postId],
  });
  redirect("/home");
}

export async function getTotalPosts() {
  const result = await executeQuery({
    query: "CALL GetTotalPosts()",
  });
  return result[0][0][0];
}

export async function getTotalUsers() {
  const result = await executeQuery({
    query: "CALL GetTotalUsers()",
  });
  return result[0][0][0];
}

export async function getTotalImages() {
  const result = await executeQuery({
    query: "CALL GetTotalImages()",
  });
  return result[0][0][0];
}

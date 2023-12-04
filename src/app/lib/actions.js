"use server";

import { executeQuery } from "@/app/lib/db";
// import { put,list, del  } from '@vercel/blob';
import fs from "fs";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { getJwtSecretKey, verifyJwtToken } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function registerUser(prevState, formData) {
  console.log(formData);
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
  const result = await executeQuery({
    query: "CALL RegisterUser(?, ?)",
    values: [username, passwordHash],
  });
  const status = result[0][0][0].result;
  if (status === "Success") {
    return redirect("/login");
  } else if (status === "Username exists") {
    return { error: "* Username exists" };
  }
  // console.log(status);
  return { error: "* Database error during registration, contact Ankit" };
}

export async function loginUser(prevState, formData) {
  const username = formData.get("username");
  const password = formData.get("password");
  // console.log(username, password);
  const result = await executeQuery({
    query: "CALL GetUserHash(?)",
    values: [username],
  });
  if (!result[0][0][0]) {
    return { error: "* Invalid username or password" };
  }
  // console.log(result[0][0][0]);
  const match = await bcrypt.compare(password, result[0][0][0].hash);
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

export async function createTodo(prevState, formData) {
  // console.log(formData.get('text'));
  // console.log("go");
  try {
    revalidatePath("/test");
    redirect("/test");
  } catch (e) {
    return { message: "Failed to create" };
  }
}

export async function newPost(formData) {
  const title = formData.get("title");
  const description = formData.get("description");
  const tags = formData.getAll("tags");
  const lat = formData.get("lat");
  const lng = formData.get("lng");
  if (!title || !description) {
    return { error: "* Title and description are required" };
  }
  const imageFiles = formData.getAll("images");
  console.log(imageFiles);
  if (!imageFiles || imageFiles.length === 0) {
    return { error: "* An Image is required" };
  }

  // files should be less than 5MB

  for (const imageFile of imageFiles) {
    if (imageFile.size > 5 * 1024 * 1024) {
      return { error: "* Image size should be less than 5MB" };
    }
  }

  // upload images/image to s3 and get the urls

  const imageList = [];

  for (const imageFile of imageFiles) {
    const fileExtension = imageFile.name.split(".").pop();
    const filePath = `${uuidv4()}.${fileExtension}`;
    const client = new S3Client({ region: process.env.AWS_REGION });
    const buffer = Buffer.from(await imageFile.arrayBuffer());
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

  console.log(payload);

  console.log({
    postId: postId,
    title: title,
    description: description,
    tags: tags,
    imageList: imageList,
    username: username,
    lat: lat,
    lng: lng,
  });

  await executeQuery({
    query: "CALL CreatePost(?,?,?,?,POINT(?,?))",
    values: [postId, username, title, description, lat, lng],
  });

  for (const imageUrl of imageList) {
    await executeQuery({
      query: "CALL CreatePostImage(?,?)",
      values: [imageUrl, postId],
    });
  }

  for (const tag of tags) {
    await executeQuery({
      query: "CALL CreatePostTag(?,?)",
      values: [postId, tag],
    });
  }

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

    console.log(result);

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


export async function updateUserData(prevState,formData){
  const password =formData.get("password");
  const bio = formData.get("bio");
  const file = formData.get("avatar");
  const username = formData.get("username");

  console.log(formData);
  

  if (password){
    if (password.length < 8) {
      return { error: "* Password must be at least 8 characters long" };
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const result_2 = await executeQuery({
      query: "CALL UpdateUserPassword(?,?)",
      values: [username,passwordHash],
    });
  }

  if (file.size > 0){
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
      values: [username,avatar],
    });
  }

  if(bio){
    const result = await executeQuery({
      query: "CALL UpdateUserBio(?,?)",
      values: [username,bio],
    });
  }


  revalidatePath("/home/user/");
  redirect("/home/user/") ;
}

export async function logout() {
  cookies().delete("AUTH_TOKEN");
  redirect("/login");
}

export async function getAllTags() {
  const result = await executeQuery({
    query: "CALL GetAllTags()",
  });
  //   console.log(result);
  return result[0][0];
}

export async function createTag(tag, user) {
  const result = await executeQuery({
    query: "CALL CreateTag(?,?)",
    values: [tag, user],
  });
  revalidateTag("tags");
  return result[0][0];
}

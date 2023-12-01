"use server";

import { executeQuery } from "@/app/lib/db";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { getJwtSecretKey } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function registerUser(prevState, formData) {
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

export async function logout() {
  cookies().delete("AUTH_TOKEN");
  redirect("/login");
}

export async function getAllTags(){
  const result = await executeQuery({
    query: "CALL GetAllTags()",
  });
  console.log(result);
  return result[0][0];
}

export async function createTag(tag,user){
  const result = await executeQuery({
    query: "CALL CreateTag(?,?)",
    values: [tag,user],
  });
  revalidateTag("tags");
  return result[0][0];
}
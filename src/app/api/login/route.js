import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { getJwtSecretKey } from "@/lib/auth";

export async function POST(req) {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    });

    const data = await req.formData();
    const username = data.get("username");
    const password = data.get("password");

    // get user details for username
    const [rows] = await connection.execute(
      "SELECT * FROM User WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      // Username not found
      return new NextResponse(
        JSON.stringify({ error: "Invalid username or password" }),
        { status: 401 }
      );
    }

    const user = rows[0];
    const passwordHashString = user.password.toString("utf8");
    const passwordMatch = await bcrypt.compare(password, passwordHashString);

    if (!passwordMatch) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid username or password" }),
        { status: 401 }
      );
    }
    await connection.end();
    const token = await new SignJWT({ username: user.username })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(getJwtSecretKey()); 
    
    const response = NextResponse.json(null,{
      status: 302,
      headers: {
        Location: "/home",
        "Set-Cookie": `AUTH_TOKEN=${token}; Path=/; HttpOnly;`,
      },
    })
    // response.cookies.set("token", token);
    return response;

    // return new NextResponse(null, );
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

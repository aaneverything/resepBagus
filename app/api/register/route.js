import { NextResponse } from "next/server";
import { createUser, getAllUsers } from "../../../lib/db"; // pastikan `getAllUsers` sudah ada

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({
        success: false,
        message: "Name, email, and password are required",
      }, { status: 400 });
    }

    // 🔍 Cek apakah email sudah terdaftar
    const users = await getAllUsers(); // ambil semua user dari database/mock
    const emailExists = users.find(user => user.email === email);

    if (emailExists) {
      return NextResponse.json({
        success: false,
        message: "Email already registered",
      }, { status: 409 }); // 409 Conflict
    }

    const newUser = {
      id: Math.random().toString(36).substring(2, 12),
      name,
      email,
      password,
      createdAt: new Date()
    };

    await createUser(newUser);

    return NextResponse.json({
      success: true,
      data: newUser,
      message: "User registered successfully"
    }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error"
    }, { status: 500 });
  }
}

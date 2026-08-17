import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          code: "VALIDATION_ERROR",
          message: "Email and password are required"
        },
        {
          status: 400
        }
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/users?email=${email}`
    );

    const users = await response.json();

    if (users.length === 0) {
      return NextResponse.json(
        {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password"
        },
        {
          status: 401
        }
      );
    }

    const user = users[0];

    if (user.status === "LOCKED") {
      return NextResponse.json(
        {
          code: "ACCOUNT_LOCKED",
          message: "Account is locked"
        },
        {
          status: 423
        }
      );
    }

    if (user.status === "DISABLED") {
      return NextResponse.json(
        {
          code: "ACCOUNT_DISABLED",
          message: "Account disabled"
        },
        {
          status: 403
        }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password"
        },
        {
          status: 401
        }
      );
    }

    return NextResponse.json(
      {
        code: "LOGIN_SUCCESS",
        user: {
          id: user.id,
          email: user.email
        }
      },
      {
        status: 200
      }
    );
  } catch {
    return NextResponse.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong"
      },
      {
        status: 500
      }
    );
  }
}
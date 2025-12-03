import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/types/user";

/**
 * Mock user data
 */
const mockUsers: User[] = [
  {
    id: "1",
    email: "john@example.com",
    username: "johndoe",
    fullName: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    role: "admin",
    status: "active",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    email: "jane@example.com",
    username: "janesmith",
    fullName: "Jane Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    role: "user",
    status: "active",
    createdAt: "2024-02-20T14:45:00Z",
    updatedAt: "2024-02-20T14:45:00Z",
  },
  {
    id: "3",
    email: "bob@example.com",
    username: "bobwilson",
    fullName: "Bob Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
    role: "moderator",
    status: "inactive",
    createdAt: "2024-03-10T09:15:00Z",
    updatedAt: "2024-03-10T09:15:00Z",
  },
];

/**
 * Helper function to simulate delay
 */
async function simulateDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * GET /api/users
 * Returns list of mock users
 *
 * Query params:
 * - error: "true" to simulate error response
 * - delay: number in ms to simulate loading (default: 1000)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const shouldError = searchParams.get("error") === "true";
  const delay = Number(searchParams.get("delay")) || 1000;

  // Simulate network delay
  await simulateDelay(delay);

  // Simulate error response
  if (shouldError) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      data: null,
      message: "Failed to fetch users. Server error occurred.",
      errorCode: "USER_FETCH_ERROR",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }

  // Success response
  const response: ApiResponse<User[]> = {
    success: true,
    data: mockUsers,
    message: "Users fetched successfully",
  };

  return NextResponse.json(response);
}

/**
 * POST /api/users
 * Creates a new mock user
 *
 * Query params:
 * - error: "true" to simulate error response
 * - delay: number in ms to simulate loading (default: 1500)
 *
 * Body: { email, username, fullName, role?, avatar? }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const shouldError = searchParams.get("error") === "true";
  const delay = Number(searchParams.get("delay")) || 1500;

  // Simulate network delay
  await simulateDelay(delay);

  // Simulate error response
  if (shouldError) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      data: null,
      message: "Failed to create user. Validation error.",
      errorCode: "USER_CREATE_ERROR",
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  try {
    const body = await request.json();
    const { email, username, fullName, role = "user", avatar } = body;

    // Validate required fields
    if (!email || !username || !fullName) {
      const validationError: ApiResponse<null> = {
        success: false,
        data: null,
        message: "Missing required fields: email, username, fullName",
        errorCode: "VALIDATION_ERROR",
      };
      return NextResponse.json(validationError, { status: 400 });
    }

    // Create new mock user
    const newUser: User = {
      id: String(Date.now()),
      email,
      username,
      fullName,
      avatar:
        avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      role,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response: ApiResponse<User> = {
      success: true,
      data: newUser,
      message: "User created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch {
    const parseError: ApiResponse<null> = {
      success: false,
      data: null,
      message: "Invalid JSON body",
      errorCode: "PARSE_ERROR",
    };
    return NextResponse.json(parseError, { status: 400 });
  }
}

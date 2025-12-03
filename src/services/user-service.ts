import apiClient from "@/services/api-client";
import type { User, UserRole } from "@/types/user";

const USERS_BASE_URL = "/users";

/**
 * Lấy thông tin user theo ID.
 * Backend nên cung cấp endpoint: GET /users/{id}
 */
export async function getUser(userId: string): Promise<User> {
  const url = `${USERS_BASE_URL}/${userId}`;
  console.log("url", url);

  const response = await apiClient.get<User>(url);
  return response.data;
}

export interface GetUsersParams {
  keyword?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Lấy danh sách user (có thể kèm filter/paging tuỳ backend).
 * Ví dụ backend: GET /users?keyword=&page=&pageSize=
 */
export async function getUsers(params: GetUsersParams = {}): Promise<User[]> {
  const url = `${USERS_BASE_URL}`;
  console.log("url", url);

  const response = await apiClient.get<User[]>(USERS_BASE_URL, {
    params,
  });
  return response.data;
}

/**
 * Input for creating a new user
 */
export interface CreateUserInput {
  email: string;
  username: string;
  fullName: string;
  role?: UserRole;
  avatar?: string;
}

/**
 * Tạo user mới.
 * Backend nên cung cấp endpoint: POST /users
 */
export async function createUser(data: CreateUserInput): Promise<User> {
  const response = await apiClient.post<User>(USERS_BASE_URL, data);
  return response.data;
}

/**
 * SWR key generators cho user endpoints.
 * Có thể dùng với useFetch / useFetchWithFetcher để cache theo key.
 */
export const userKeys = {
  all: () => "/users" as const,
  detail: (id: string) => `/users/${id}` as const,
  current: () => "/users/me" as const,
  create: () => "/users/create" as const,
};

/**
 * API Response Types
 */

export interface ApiResponse<T> {
  status: string
  code: number
  message: string
  data: T
  total: number
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginUser {
  username: string
  role_id: number
  vendor_id: number
}

export interface LoginData {
  accessToken: string
  refreshToken: string
  user: LoginUser
}

export type LoginResponse = ApiResponse<LoginData>

export interface RefreshTokenRequest {
  username: string
  refreshToken: string
}

export interface RefreshTokenData {
  accessToken: string
  refreshToken: string
}

export type RefreshTokenResponse = ApiResponse<RefreshTokenData>

export type LogoutResponse = ApiResponse<null>

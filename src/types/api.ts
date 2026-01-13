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

export interface TenderApiItem {
  id: number
  name: string
  date: string
  requester_name: string
  description: string
  total_product: number
  total_participant: number
  status?: number
}

export type TenderListResponse = ApiResponse<TenderApiItem[]>

export interface CreateProductRequest {
  product_name: string
  brand: string
  specification: string
  uom: string
  quantity: number
  term_of_payment: string
  last_price: number
  id: number
}

export interface CreateProductResponse {
  id: number
  product_name: string
  brand: string
  specification: string
  uom: string
  quantity: number
  term_of_payment: string
  last_price: number
}

export type CreateProductApiResponse = ApiResponse<CreateProductResponse>

export interface VendorOption {
  id: number
  name: string
  email: string
  address?: string
  pic_name?: string
  phone_number?: string
  payment_terms?: string
  delivery_time_days?: number
}

export type VendorOptionsResponse = ApiResponse<VendorOption[]>

export interface CreateTenderRequest {
  name: string
  date: string
  requester_name: string
  description: string
  total_participant: number
  total_product: number
}

export interface CreateTenderResponse {
  created_on: string
  modified_on: string
  id: number
  name: string
  date: string
  requester_name: string
  description: string
  status: number
  created_by: string
  modified_by: string
}

export type CreateTenderApiResponse = ApiResponse<CreateTenderResponse>

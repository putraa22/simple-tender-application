/**
 * Auth Types
 */

export interface User {
  username: string
  role_id: number
  vendor_id: number
}

export interface LocationState {
  from?: {
    pathname: string
  }
}

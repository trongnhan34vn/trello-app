export interface ApiResponse {
  success: boolean,
  code: string,
  message: string,
}

export interface SuccessResponse<T> extends ApiResponse {
  success: true
  data: T
}

export interface ErrorResponse extends ApiResponse {
  success: false;
}
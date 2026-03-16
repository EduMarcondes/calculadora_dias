import type { ApiResponse } from "../types/api-response.js";

export const successResponse = <TData>(data: TData): ApiResponse<TData> => ({
  success: true,
  data,
  error: null
});

export const errorResponse = (message: string): ApiResponse => ({
  success: false,
  data: null,
  error: message
});

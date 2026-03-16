export type ApiResponse<TData = unknown> = {
  success: boolean;
  data: TData | null;
  error: string | null;
};

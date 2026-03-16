export type ApiResponse<TData> = {
  success: boolean;
  data: TData | null;
  error: string | null;
};

export type CalculationType = "calendar" | "business";

export type Holiday = {
  id: number;
  date: string;
  description: string;
};

export type CalculateResponse = {
  endDate: string;
};

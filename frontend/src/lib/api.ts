import type { ApiResponse, CalculateResponse, CalculationType, Holiday } from "@/types/api";

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const parseApiResponse = async <TData>(response: Response): Promise<TData> => {
  const payload = (await response.json()) as ApiResponse<TData>;

  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(payload.error ?? "Falha na requisicao.");
  }

  return payload.data;
};

export const calculateEndDate = async (
  startDate: string,
  days: number,
  type: CalculationType
): Promise<string> => {
  const response = await fetch(`${apiBaseUrl}/calculate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ startDate, days, type })
  });

  const data = await parseApiResponse<CalculateResponse>(response);
  return data.endDate;
};

export const listHolidays = async (): Promise<Holiday[]> => {
  const response = await fetch(`${apiBaseUrl}/holidays`);
  return parseApiResponse<Holiday[]>(response);
};

export const createHoliday = async (date: string, description: string): Promise<Holiday> => {
  const response = await fetch(`${apiBaseUrl}/holidays`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ date, description })
  });

  return parseApiResponse<Holiday>(response);
};

export const deleteHoliday = async (id: number): Promise<void> => {
  const response = await fetch(`${apiBaseUrl}/holidays/${id}`, {
    method: "DELETE"
  });

  await parseApiResponse<{ removed: boolean }>(response);
};

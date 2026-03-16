import { z } from "zod";

export const holidayCreateSchema = z.object({
  date: z.iso.date("Data do feriado invalida. Use o formato YYYY-MM-DD."),
  description: z.string().trim().min(1).max(120)
});

export const holidayIdSchema = z.object({
  id: z.coerce.number().int().positive()
});

export type HolidayCreateInput = z.infer<typeof holidayCreateSchema>;

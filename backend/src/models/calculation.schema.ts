import { z } from "zod";

export const calculationSchema = z.object({
  startDate: z.iso.date("Data inicial invalida. Use o formato YYYY-MM-DD."),
  days: z
    .number()
    .int("A quantidade de dias deve ser um numero inteiro.")
    .min(1, "A quantidade de dias deve ser maior que zero."),
  type: z.enum(["calendar", "business"], "Tipo de calculo invalido.")
});

export type CalculationInput = z.infer<typeof calculationSchema>;

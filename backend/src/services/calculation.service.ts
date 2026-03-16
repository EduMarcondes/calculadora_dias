import { HolidayRepository } from "../repositories/holiday.repository.js";
import { HttpError } from "../errors/http-error.js";

type CalculationType = "calendar" | "business";

const formatToIsoDate = (date: Date): string => date.toISOString().split("T")[0] ?? "";

const isWeekend = (date: Date): boolean => {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
};

const addUtcDays = (date: Date, days: number): Date => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

export class CalculationService {
  constructor(private readonly holidayRepository: HolidayRepository) {}

  private async loadHolidaySet(): Promise<Set<string>> {
    const holidays = await this.holidayRepository.findAll();
    return new Set(holidays.map((holiday) => formatToIsoDate(holiday.date)));
  }

  private isBusinessDay(date: Date, holidaySet: Set<string>): boolean {
    if (isWeekend(date)) {
      return false;
    }

    return !holidaySet.has(formatToIsoDate(date));
  }

  async calculateEndDate(startDate: string, days: number, type: CalculationType): Promise<string> {
    if (days < 1) {
      throw new HttpError(400, "A quantidade de dias deve ser maior que zero.");
    }

    const start = new Date(`${startDate}T00:00:00.000Z`);

    if (type === "calendar") {
      return formatToIsoDate(addUtcDays(start, days));
    }

    const holidaySet = await this.loadHolidaySet();
    let cursor = new Date(start);
    let businessDaysCount = 0;

    // Itera dia a dia ate atingir a quantidade de dias uteis solicitada.
    while (businessDaysCount < days) {
      cursor = addUtcDays(cursor, 1);

      if (!this.isBusinessDay(cursor, holidaySet)) {
        continue;
      }

      businessDaysCount += 1;
    }

    return formatToIsoDate(cursor);
  }
}

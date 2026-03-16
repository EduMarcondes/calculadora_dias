import type { Holiday } from "@prisma/client";
import { HttpError } from "../errors/http-error.js";
import { HolidayRepository } from "../repositories/holiday.repository.js";

export class HolidayService {
  constructor(private readonly holidayRepository: HolidayRepository) {}

  async listHolidays(): Promise<Holiday[]> {
    return this.holidayRepository.findAll();
  }

  async createHoliday(date: string, description: string): Promise<Holiday> {
    const parsedDate = new Date(`${date}T00:00:00.000Z`);
    const existingHoliday = await this.holidayRepository.findByDate(parsedDate);

    if (existingHoliday) {
      throw new HttpError(409, "Ja existe feriado cadastrado para esta data.");
    }

    return this.holidayRepository.create(parsedDate, description);
  }

  async removeHoliday(id: number): Promise<void> {
    const holiday = await this.holidayRepository.findById(id);

    if (!holiday) {
      throw new HttpError(404, "Feriado nao encontrado.");
    }

    await this.holidayRepository.deleteById(id);
  }
}

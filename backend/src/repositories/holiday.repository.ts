import type { Holiday } from "@prisma/client";
import { prisma } from "../database/prisma.js";

export class HolidayRepository {
  async findAll(): Promise<Holiday[]> {
    return prisma.holiday.findMany({
      orderBy: { date: "asc" }
    });
  }

  async findByDate(date: Date): Promise<Holiday | null> {
    return prisma.holiday.findUnique({
      where: { date }
    });
  }

  async findById(id: number): Promise<Holiday | null> {
    return prisma.holiday.findUnique({
      where: { id }
    });
  }

  async create(date: Date, description: string): Promise<Holiday> {
    return prisma.holiday.create({
      data: {
        date,
        description
      }
    });
  }

  async deleteById(id: number): Promise<void> {
    await prisma.holiday.delete({
      where: { id }
    });
  }
}

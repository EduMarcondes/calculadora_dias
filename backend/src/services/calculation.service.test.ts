import { describe, expect, it, vi } from "vitest";
import { HolidayRepository } from "../repositories/holiday.repository.js";
import { CalculationService } from "./calculation.service.js";
import { HttpError } from "../errors/http-error.js";

describe("CalculationService", () => {
  it("deve somar dias normalmente no tipo calendar", async () => {
    const repository = {
      findAll: vi.fn().mockResolvedValue([])
    } as unknown as HolidayRepository;

    const service = new CalculationService(repository);

    const result = await service.calculateEndDate("2026-03-01", 5, "calendar");

    expect(result).toBe("2026-03-06");
    expect(repository.findAll).not.toHaveBeenCalled();
  });

  it("deve ignorar sabado, domingo e feriado no tipo business", async () => {
    const repository = {
      findAll: vi.fn().mockResolvedValue([
        {
          id: 1,
          date: new Date("2026-03-03T00:00:00.000Z"),
          description: "Feriado de teste"
        }
      ])
    } as unknown as HolidayRepository;

    const service = new CalculationService(repository);

    const result = await service.calculateEndDate("2026-03-01", 5, "business");

    expect(result).toBe("2026-03-09");
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  it("deve falhar quando days for 0", async () => {
    const repository = {
      findAll: vi.fn().mockResolvedValue([])
    } as unknown as HolidayRepository;

    const service = new CalculationService(repository);

    await expect(service.calculateEndDate("2026-03-01", 0, "business")).rejects.toBeInstanceOf(HttpError);
  });
});

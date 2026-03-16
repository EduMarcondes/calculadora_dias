import type { NextFunction, Request, Response } from "express";
import { holidayCreateSchema, holidayIdSchema } from "../models/holiday.schema.js";
import { HolidayService } from "../services/holiday.service.js";
import { errorResponse, successResponse } from "../utils/api-response.js";

export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  listHolidays = async (_request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const holidays = await this.holidayService.listHolidays();
      response.status(200).json(successResponse(holidays));
    } catch (error) {
      next(error);
    }
  };

  createHoliday = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const parsedBody = holidayCreateSchema.safeParse(request.body);

    if (!parsedBody.success) {
      response.status(400).json(errorResponse(parsedBody.error.issues[0]?.message ?? "Entrada invalida."));
      return;
    }

    try {
      const holiday = await this.holidayService.createHoliday(parsedBody.data.date, parsedBody.data.description);
      response.status(201).json(successResponse(holiday));
    } catch (error) {
      next(error);
    }
  };

  deleteHoliday = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const parsedParams = holidayIdSchema.safeParse(request.params);

    if (!parsedParams.success) {
      response.status(400).json(errorResponse("Parametro id invalido."));
      return;
    }

    try {
      await this.holidayService.removeHoliday(parsedParams.data.id);
      response.status(200).json(successResponse({ removed: true }));
    } catch (error) {
      next(error);
    }
  };
}

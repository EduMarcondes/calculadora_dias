import type { NextFunction, Request, Response } from "express";
import { calculationSchema } from "../models/calculation.schema.js";
import { CalculationService } from "../services/calculation.service.js";
import { errorResponse, successResponse } from "../utils/api-response.js";

export class CalculationController {
  constructor(private readonly calculationService: CalculationService) {}

  calculate = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const parsedBody = calculationSchema.safeParse(request.body);

    if (!parsedBody.success) {
      response.status(400).json(errorResponse(parsedBody.error.issues[0]?.message ?? "Entrada invalida."));
      return;
    }

    try {
      const endDate = await this.calculationService.calculateEndDate(
        parsedBody.data.startDate,
        parsedBody.data.days,
        parsedBody.data.type
      );

      response.status(200).json(successResponse({ endDate }));
    } catch (error) {
      next(error);
    }
  };
}

import { Router } from "express";
import { CalculationController } from "../controllers/calculation.controller.js";
import { HolidayController } from "../controllers/holiday.controller.js";
import { HolidayRepository } from "../repositories/holiday.repository.js";
import { CalculationService } from "../services/calculation.service.js";
import { HolidayService } from "../services/holiday.service.js";
import { successResponse } from "../utils/api-response.js";

const holidayRepository = new HolidayRepository();
const holidayService = new HolidayService(holidayRepository);
const calculationService = new CalculationService(holidayRepository);

const holidayController = new HolidayController(holidayService);
const calculationController = new CalculationController(calculationService);

export const appRouter = Router();

appRouter.get("/health", (_request, response) => {
  response.status(200).json(successResponse({ status: "ok" }));
});

appRouter.post("/calculate", calculationController.calculate);
appRouter.get("/holidays", holidayController.listHolidays);
appRouter.post("/holidays", holidayController.createHoliday);
appRouter.delete("/holidays/:id", holidayController.deleteHoliday);

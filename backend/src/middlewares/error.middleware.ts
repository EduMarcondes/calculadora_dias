import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { isHttpError } from "../errors/http-error.js";
import { errorResponse } from "../utils/api-response.js";
import { logger } from "../utils/logger.js";

export const errorMiddleware = (error: unknown, _request: Request, response: Response, _next: NextFunction): void => {
  if (error instanceof ZodError) {
    response.status(400).json(errorResponse(error.issues[0]?.message ?? "Entrada invalida."));
    return;
  }

  if (isHttpError(error)) {
    response.status(error.statusCode).json(errorResponse(error.message));
    return;
  }

  logger.error({ error }, "Erro nao tratado no backend.");
  response.status(500).json(errorResponse("Erro interno do servidor."));
};
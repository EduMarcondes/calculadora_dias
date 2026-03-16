import cors from "cors";
import express from "express";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { appRouter } from "./routes/index.js";
import { errorResponse } from "./utils/api-response.js";
import { logger } from "./utils/logger.js";

export const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

app.disable("x-powered-by");
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origem nao permitida por CORS."));
    }
  })
);
app.use(express.json());
app.use((request, response, next) => {
  const start = Date.now();

  response.on("finish", () => {
    logger.info(
      {
        method: request.method,
        path: request.originalUrl,
        statusCode: response.statusCode,
        durationMs: Date.now() - start
      },
      "Requisicao processada."
    );
  });

  next();
});
app.use(appRouter);

app.use((_request, response) => {
  response.status(404).json(errorResponse("Rota nao encontrada."));
});

app.use(errorMiddleware);

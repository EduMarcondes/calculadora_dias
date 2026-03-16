import pino from "pino";

export const logger = pino({
  name: "calculadora-dias-backend",
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  timestamp: pino.stdTimeFunctions.isoTime
});

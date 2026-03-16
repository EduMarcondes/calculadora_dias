import "dotenv/config";
import { app } from "./app.js";
import { prisma } from "./database/prisma.js";
import { logger } from "./utils/logger.js";

const port = Number(process.env.PORT ?? 3000);

const bootstrap = async (): Promise<void> => {
  try {
    await prisma.$connect();

    app.listen(port, () => {
      logger.info({ port }, "Servidor backend iniciado.");
    });
  } catch (error) {
    logger.error({ error }, "Falha ao iniciar backend.");
    process.exit(1);
  }
};

await bootstrap();

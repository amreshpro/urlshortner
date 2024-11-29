import app from "./src/app";
import { logger } from "./src/utils/logging";
import EnvConfig from "./src/config/EnvConfig";
import Database from "./src/db/index";

const startServer = async () => {
  const PORT = EnvConfig.PORT;

  try {
    //   await connectDB();
    await Database.connect();

    app
      .listen(PORT, () => {
        logger.info(`Listening on  http://localhost:${PORT}`);
      })
      .on("error", (err) => {
        console.log("err", err.message);
        process.exit(1);
      });
  } catch (err) {
    logger.error("Error happened: ", err);
    process.exit(1);
  }
};

void startServer();

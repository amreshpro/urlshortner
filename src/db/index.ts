import mongoose from "mongoose";
import EnvConfig from "../config/EnvConfig"; // Assuming you store your environment variables here
import { logger } from "../utils/logging";

const mongoUri = EnvConfig.DATABASE_URL || "";

export default class Database {
  private static instance: typeof mongoose | null = null;

  // Connect to MongoDB
  public static async connect() {
    if (Database.instance) {
      return Database.instance;
    }

    try {
      // Mongoose options for a better performance & stability
      const options: mongoose.ConnectOptions = {
        autoIndex: true, // Enable auto-creation of indexes, useful for production
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4, // Use IPv4, skip trying IPv6
      };

      const connection = await mongoose.connect(mongoUri, options);
      logger.info("Successfully connected to MongoDB");

      // Assign the connection instance
      Database.instance = connection;

      // Mongoose event listeners for scalability and monitoring
      mongoose.connection.on("connected", () => {
        logger.info("Mongoose connected to database");
      });

      mongoose.connection.on("error", (err) => {
        logger.error(`Mongoose connection error: ${err}`);
      });

      mongoose.connection.on("disconnected", () => {
        logger.warn("Mongoose disconnected from database");
      });

      return Database.instance;
    } catch (error) {
      logger.error("Database connection failed", error);
      throw error; // Throw error to notify application
    }
  }

  // Disconnect from MongoDB
  public static async disconnect() {
    if (!Database.instance) {
      return;
    }

    try {
      await mongoose.disconnect();
      Database.instance = null;
      logger.info("Successfully disconnected from MongoDB");
    } catch (error) {
      logger.error("Error while disconnecting from MongoDB", error);
    }
  }
}

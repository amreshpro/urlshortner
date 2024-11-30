import express, { urlencoded } from "express";
import expressRateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import loggerMiddleware from "./middleware/logger";
import globalErrorHandler from "./middleware/errors";
import userRouter from "./routes/user";
import authRouter from "./routes/auth";
import cors from "cors";
import swagger from "./docs/swagger.json";
import helmet from "helmet";
import { authenticateJWT } from "./middleware/jwt";
import { authorize } from "./middleware/auth/roles";
import urlShortnerRouter from "./routes/url";

const app = express();

// middleware
app.use(express.json());
app.use(urlencoded({ extended: true }));
// Swagger UI route
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// logger middleware
app.use(loggerMiddleware);
app.use(cors());

// Routes
app.use("/api/v1/user", authenticateJWT, authorize(), userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/urls", authenticateJWT, urlShortnerRouter);

app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swagger));

// default
app.get("/", (req, res, next) => {
  res.redirect("/api/v1/docs");
  next();
});

const limiter = expressRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.use(helmet());
// global error handler ( must be after routes)
app.use(globalErrorHandler);

export default app;

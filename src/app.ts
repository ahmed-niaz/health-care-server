import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandlers";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";

const app: Application = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Health Care Server is on 🤪",
  });
});

// todo: application routes
app.use("/api/v1", router);

app.use(globalErrorHandler);

// todo:  not found while the wrong path.
app.use(notFound);

// admin routes
// app.use("/api/v1/admin", adminRoutes);

export default app;

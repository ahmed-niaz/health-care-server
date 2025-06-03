import express, { Application, Request, Response } from "express";
import cors from "cors";
import { userRoutes } from "./app/modules/users/user.routes";
import { testRoutes } from "./app/modules/test/test.routes";
import { adminRoutes } from "./app/modules/admin/admin.routes";

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Health Care Server is on 🤪",
  });
});

// test routes
app.use("/api/test", testRoutes);

// user routes
app.use("/api/v1/user", userRoutes);

// admin routes
app.use("/api/v1/admin", adminRoutes);

export default app;

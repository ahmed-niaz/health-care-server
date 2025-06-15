import { Router } from "express";
import { userRoutes } from "../modules/users/user.routes";
import { adminRoutes } from "../modules/admin/admin.routes";

const router = Router();

// Define module route types
interface ModuleRoute {
  path: string;
  route: Router;
}

// All module routes
const moduleRoutes: ModuleRoute[] = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/admin",
    route: adminRoutes,
  },
];

moduleRoutes.forEach((value) => router.use(value.path, value.route));

export default router;

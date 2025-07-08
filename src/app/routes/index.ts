import { Router } from "express";
import { userRoutes } from "../modules/users/user.routes";
import { adminRoutes } from "../modules/admin/admin.routes";
import { authRoutes } from "../modules/auth/auth.router";
import { specialtiesRoutes } from "../modules/specialties/specialties.routes";
import { doctorRoutes } from "../modules/doctor/doctor.routes";

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
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/specialties",
    route: specialtiesRoutes,
  },
  {
    path: "/doctor",
    route: doctorRoutes,
  },
];

moduleRoutes.forEach((value) => router.use(value.path, value.route));

export default router;

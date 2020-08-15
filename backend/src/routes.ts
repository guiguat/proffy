import express from "express";
import ClassesController from "./controllers/ClassesController";
import ConnectionsController from "./controllers/ConnectionsController";
import AuthController from "./controllers/AuthController";
import db from "./database/connection";
import authMiddleware from "./middlewares/auth";
import UserController from "./controllers/UserController";

const authController = new AuthController();

const routes = express.Router();

routes.post("/classes", ClassesController.create);
routes.get("/classes", ClassesController.index);
routes.put("/classes", authMiddleware, ClassesController.update);

routes.post("/connections", ConnectionsController.create);
routes.get("/connections", ConnectionsController.index);

routes.post("/user", UserController.create);
routes.get("/user/:id", UserController.index);

routes.get("/auth", authController.login);
routes.get("/auth/reset_password", authController.forgotPassword);
routes.post("/auth/reset_password", authController.resetPassword);

//just for testing
routes.get("/me", authMiddleware, async (req, res) => {
  try {
    const { userId }: any = req;
    const user = await db("user").select("*").where("id", userId);
    return res.json({ user });
  } catch (err) {
    return res.status(400).json({ error: "Can't get user information" });
  }
});

export default routes;

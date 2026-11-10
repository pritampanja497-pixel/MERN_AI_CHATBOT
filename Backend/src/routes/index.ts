import { Router } from "express";
import userRoutes from "./userRoutes.js";
import chatRoutes from "./chatRoutes.js";

const appRouter = Router();

appRouter.use("/user", userRoutes);
appRouter.use("/chat", chatRoutes);
appRouter.use("/chats", chatRoutes);

export default appRouter;
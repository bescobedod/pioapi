// DevolucionRouter
import { Router } from "express";
import { container } from "tsyringe";
import authMiddleware from "../../middlewares/authMiddleware";
import validateFields from "../../middlewares/validateFields";
import DevolucionController from "../../controllers/Devolucion/DevolucionController";
import DevolucionQueryController from "../../controllers/Devolucion/DevolucionQueryController";
import {
  DevolucionCreateDto,
  fileConfigDevolucionCreateDto,
} from "../../dtos/Devolucion/DevolucionCreateDto";

const DevolucionRouter = Router();
const devolucionController = container.resolve(DevolucionController);
const devolucionQueryController = container.resolve(DevolucionQueryController);

DevolucionRouter.use(authMiddleware);

DevolucionRouter.post(
  "/create",
  validateFields(DevolucionCreateDto, fileConfigDevolucionCreateDto),
  devolucionController.createDevolucion.bind(devolucionController),
);

DevolucionRouter.get(
  "/user",
  devolucionQueryController.getDevolucionesByUser.bind(
    devolucionQueryController,
  ),
);

DevolucionRouter.get(
  "/:id",
  devolucionQueryController.getDevolucionDetalleById.bind(
    devolucionQueryController,
  ),
);

export default DevolucionRouter;

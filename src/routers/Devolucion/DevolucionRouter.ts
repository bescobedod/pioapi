// DevolucionRouter
import { Router } from "express";
import { container } from "tsyringe";
import authMiddleware from "../../middlewares/authMiddleware";
import validateFields from "../../middlewares/validateFields";
import DevolucionController from "../../controllers/Devolucion/DevolucionController";
import { DevolucionCreateDto, fileConfigDevolucionCreateDto } from "../../dtos/Devolucion/DevolucionCreateDto";

const DevolucionRouter = Router()
const devolucionController = container.resolve(DevolucionController)

DevolucionRouter.use(authMiddleware)

DevolucionRouter.post(
    '/create',
    validateFields(DevolucionCreateDto, fileConfigDevolucionCreateDto),
    devolucionController.createDevolucion.bind(devolucionController)
)

export default DevolucionRouter
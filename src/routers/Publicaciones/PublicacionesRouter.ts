import { Router } from "express";
import { container } from "tsyringe";
import PublicacionesController from "../../controllers/Publicaciones/PublicacionesController";
import authMiddleware from "../../middlewares/authMiddleware";

const router = Router();
const controller = container.resolve(PublicacionesController);

// Middleware de autenticación requerido para saber quién ve qué
router.use(authMiddleware as any);

router.get("/dashboard", controller.getDashboardFeed.bind(controller) as any);
router.get("/historial", controller.getHistoryFeed.bind(controller) as any);
router.get("/categorias", controller.getCategories.bind(controller) as any);
router.post("/leido", controller.markAsRead.bind(controller) as any); // Legacy
router.post("/estado", controller.changeStatus.bind(controller) as any); // V3
router.post("/", controller.createPublication.bind(controller) as any);

export default router;

import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { JsonResponse, RequestAuth } from "../../types/ResponseTypes";
import { handleSend } from "../../utils/HandlerFactory";
import PublicacionesService from "../../services/Publicaciones/PublicacionesService";
import { Transaction } from "sequelize";

@injectable()
export default class PublicacionesController {
  constructor(
    @inject(PublicacionesService)
    private publicacionesService: PublicacionesService,
  ) {}

  async getDashboardFeed(req: RequestAuth, res: Response<JsonResponse<any>>) {
    await handleSend(
      res,
      async () => {
        const id_users = req.user?.id_users;
        const id_rol = req.user?.id_rol;
        if (!id_users) throw new Error("Usuario no identificado.");
        return await this.publicacionesService.getDashboardFeed(
          Number(id_users),
          id_rol ? Number(id_rol) : undefined,
        );
      },
      "Publicaciones obtenidas correctamente",
      false,
      "PIOAPP",
    );
  }

  async getHistoryFeed(req: RequestAuth, res: Response<JsonResponse<any>>) {
    await handleSend(
      res,
      async () => {
        const id_users = req.user?.id_users;
        const id_rol = req.user?.id_rol;
        const id_categoria = req.query.id_categoria;
        if (!id_users) throw new Error("Usuario no identificado.");
        return await this.publicacionesService.getHistoryFeed(
          Number(id_users),
          id_categoria ? Number(id_categoria) : undefined,
          id_rol ? Number(id_rol) : undefined,
        );
      },
      "Historial de publicaciones obtenido correctamente",
      false,
      "PIOAPP",
    );
  }

  async markAsRead(req: RequestAuth, res: Response<JsonResponse<any>>) {
    await handleSend(
      res,
      async (t) => {
        const id_users = req.user?.id_users;
        const { id_publicacion } = req.body;

        if (!id_users) throw new Error("Usuario no identificado.");
        if (!id_publicacion)
          throw new Error("Se requiere el ID de la publicación.");

        await this.publicacionesService.markPublicationAsRead(
          Number(id_publicacion),
          Number(id_users),
          t as Transaction,
        );
        return { success: true };
      },
      "Publicación marcada como leída",
      true, // isWithRollback para transacción
      "PIOAPP",
    );
  }

  async getCategories(req: RequestAuth, res: Response<JsonResponse<any>>) {
    await handleSend(
      res,
      async () => {
        return await this.publicacionesService.getCategories();
      },
      "Categorías listadas",
      false,
      "PIOAPP",
    );
  }

  async createPublication(req: RequestAuth, res: Response<JsonResponse<any>>) {
    await handleSend(
      res,
      async () => {
        const { id_categoria_publicacion, titulo, mensaje, archivos } =
          req.body;
        if (!id_categoria_publicacion || !titulo || !mensaje) {
          throw new Error("Faltan campos obligatorios para la publicación.");
        }

        const newPub =
          await this.publicacionesService.createPublicationAndNotify(
            {
              id_categoria_publicacion: Number(id_categoria_publicacion),
              titulo,
              mensaje,
            },
            archivos,
          );

        return newPub;
      },
      "Publicación creada y notificaciones enviadas correctamente",
      false,
      "PIOAPP",
    );
  }
}

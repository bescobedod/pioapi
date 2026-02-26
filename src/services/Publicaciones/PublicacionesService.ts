import { injectable, inject } from "tsyringe";
import { Transaction } from "sequelize";
import PublicacionesRepository from "../../repositories/PublicacionesRepository";
import TokenNotificationPushRepository from "../../repositories/TokenNotificationPushRepository";
import { Expo } from "expo-server-sdk";
import {
  dataMessageNotificacion,
  sendNotificationsMessage,
} from "../../utils/Notificaciones/NotificacionesPushUtils";

@injectable()
export default class PublicacionesService {
  constructor(
    @inject(PublicacionesRepository) private repo: PublicacionesRepository,
    @inject(TokenNotificationPushRepository)
    private tokenRepo: TokenNotificationPushRepository,
  ) {}

  async getDashboardFeed(id_usuario: number, id_rol?: number) {
    return await this.repo.getUnreadPublications(id_usuario, id_rol);
  }

  async getHistoryFeed(
    id_usuario: number,
    id_categoria?: number,
    id_rol?: number,
  ) {
    return await this.repo.getPublicationsHistory(
      id_usuario,
      id_categoria,
      id_rol,
    );
  }

  async markPublicationAsRead(
    id_publicacion: number,
    id_usuario: number,
    t: Transaction,
  ) {
    try {
      await this.repo.markAsRead(id_publicacion, id_usuario, t);
      return true;
    } catch (error: any) {
      if (error.name === "SequelizeUniqueConstraintError") {
        // Si ya la marcó como leída no hay problema, simplemente ignoramos el duplicado
        return true;
      }
      throw error;
    }
  }

  async changePublicationStatus(
    id_publicacion: number,
    id_usuario: number,
    estado: number,
    t: Transaction,
  ) {
    await this.repo.changeStatus(id_publicacion, id_usuario, estado, t);
    return true;
  }

  async getCategories() {
    return await this.repo.getAllCategories();
  }

  async createPublicationAndNotify(
    data: { id_categoria_publicacion: number; titulo: string; mensaje: string },
    archivosData?: {
      url_archivo: string;
      nombre_archivo: string;
      tipo: string;
    }[],
  ) {
    const pub = await this.repo.createPublication(data, archivosData);

    try {
      // 1. Instanciar expo
      const expo = new Expo();
      // 2. Traer todos los tokens de todos los usuarios
      //    (En un sistema gigante se usaría paginación o colas. Dado el alcance, traemos todo temporalmente)
      //    Nota: `TokenNotificationPushModel` se puede consultar pidiendo a Sequelize crudo,
      //    pero requeriremos model/repo para ello.
      //    Temporal workaround: consultar todos los tokens a traves de TokenNotificationPushModel
      const TokenModel =
        require("../../models/pioapp/tables/TokenNotificationPushModel").default;
      const allTokens = await TokenModel.findAll({
        attributes: ["token_push"],
        raw: true,
      });

      if (allTokens.length > 0) {
        const mensajesFormat = dataMessageNotificacion(
          allTokens,
          "token_push",
          {
            title: pub.titulo,
            body: pub.mensaje,
          },
        );

        if (mensajesFormat.length > 0) {
          await sendNotificationsMessage(expo, mensajesFormat);
        }
      }
    } catch (e) {
      console.error("Error al enviar notificaciones push de publicación:", e);
    }

    return pub;
  }
}

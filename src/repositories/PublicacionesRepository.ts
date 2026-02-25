import { injectable } from "tsyringe";
import fs from "fs";
import PublicacionesModel from "../models/pioapp/tables/PublicacionesModel";
import CategoriasPublicacionModel from "../models/pioapp/tables/CategoriasPublicacionModel";
import PublicacionesArchivosModel from "../models/pioapp/tables/PublicacionesArchivosModel";
import UsuarioPublicacionesVistasModel from "../models/pioapp/tables/UsuarioPublicacionesVistasModel";
import { Op, Transaction, QueryTypes } from "sequelize";

@injectable()
export default class PublicacionesRepository {
  // Devuelve las publicaciones activas que el usuario NO ha visto
  async getUnreadPublications(
    id_usuario: number,
    id_rol?: number,
  ): Promise<any[]> {
    if (!PublicacionesModel.sequelize)
      throw new Error("Database not initialized");
    const query = `SELECT * FROM app.fn_get_publicaciones_no_vistas(:id_usuario, :id_rol)`;
    const results = await PublicacionesModel.sequelize.query(query, {
      replacements: { id_usuario, id_rol: id_rol || null },
      type: QueryTypes.SELECT,
    });
    return results as any[];
  }

  // Devuelve el historial de publicaciones activas (opcional por categoría)
  async getPublicationsHistory(
    id_usuario: number,
    id_categoria?: number,
    id_rol?: number,
  ): Promise<any[]> {
    if (!PublicacionesModel.sequelize)
      throw new Error("Database not initialized");
    const query = `SELECT * FROM app.fn_get_publicaciones_historial(:id_usuario, :id_categoria, :id_rol)`;
    const results = await PublicacionesModel.sequelize.query(query, {
      replacements: {
        id_usuario,
        id_categoria: id_categoria || null,
        id_rol: id_rol || null,
      },
      type: QueryTypes.SELECT,
    });
    return results as any[];
  }

  async markAsRead(
    id_publicacion: number,
    id_usuario: number,
    t: Transaction,
  ): Promise<UsuarioPublicacionesVistasModel> {
    return await UsuarioPublicacionesVistasModel.create(
      { id_publicacion, id_usuario },
      { transaction: t },
    );
  }

  async getAllCategories(): Promise<CategoriasPublicacionModel[]> {
    return await CategoriasPublicacionModel.findAll({
      where: { estado: true },
      order: [["nombre", "ASC"]],
    });
  }

  async createPublication(
    data: {
      id_categoria_publicacion: number;
      titulo: string;
      mensaje: string;
      estado?: boolean;
    },
    archivosData?: {
      url_archivo: string;
      nombre_archivo: string;
      tipo: string;
    }[],
    t?: Transaction,
  ): Promise<PublicacionesModel> {
    const pub = await PublicacionesModel.create(
      data,
      t ? { transaction: t } : undefined,
    );

    if (archivosData && archivosData.length > 0) {
      const archivosAInsertar = archivosData.map((a) => ({
        ...a,
        id_publicacion: pub.id_publicacion,
      }));
      await PublicacionesArchivosModel.bulkCreate(
        archivosAInsertar,
        t ? { transaction: t } : undefined,
      );
    }

    return pub;
  }
}

import { Transaction } from "sequelize";
import IDevolucionRepository from "../interface/IDevolucionRepository";
import DevolucionModel from "../models/pioapp/tables/DevolucionModel";
import { injectable } from "tsyringe";
import { sequelizeInit } from "../config/database";
import { QueryTypes } from "sequelize";

@injectable()
export default class DevolucionRepository implements IDevolucionRepository {
  async create(
    data: Partial<DevolucionModel>,
    t: Transaction | null = null,
    raw: boolean = false,
  ): Promise<DevolucionModel> {
    const result = await DevolucionModel.create(data, {
      transaction: t,
    });
    if (!result)
      throw new Error(`Error al crear el encabezado de la devolucion.`);
    return raw ? result.get({ plain: true }) : result;
  }

  async getDevolucionesByUserId(userId: bigint | number): Promise<any[]> {
    const sequelize = sequelizeInit("PIOAPP");
    const results = await sequelize.query(
      `SELECT * FROM app.fn_get_devoluciones_por_usuario(:userId)`,
      {
        replacements: { userId },
        type: QueryTypes.SELECT,
      },
    );
    return results;
  }

  async getDevolucionDetalle(idDevolucion: number): Promise<any[]> {
    const sequelize = sequelizeInit("PIOAPP");
    const results = await sequelize.query(
      `SELECT * FROM app.fn_get_devolucion_detalle(:idDevolucion)`,
      {
        replacements: { idDevolucion },
        type: QueryTypes.SELECT,
      },
    );
    return results;
  }

  async getDevolucionById(idDevolucion: number): Promise<any | null> {
    const result = await DevolucionModel.findOne({
      where: { id_devolucion: idDevolucion },
      raw: true,
    });
    return result;
  }
}

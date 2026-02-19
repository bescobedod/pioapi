import { Transaction } from "sequelize";
import ILogRecepcionRepository from "../interface/ILogRecepcionRepository";
import LogRecepcionModel from "../models/pioapp/tables/LogRecepcionModel";

export default class LogRecepcionRepository implements ILogRecepcionRepository {
  async create(
    data: Partial<LogRecepcionModel>,
    t: Transaction | null = null,
    raw: boolean = false,
  ): Promise<LogRecepcionModel> {
    const result = await LogRecepcionModel.create(data, { transaction: t });
    if (!result) throw new Error(`Error al crear el log de recepcion.`);
    return raw ? result.get({ plain: true }) : result;
  }
}

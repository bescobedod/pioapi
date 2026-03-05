import { Transaction } from "sequelize";
import DevolucionModel from "../models/pioapp/tables/DevolucionModel";

export default interface IDevolucionRepository {
  create(
    data: Partial<DevolucionModel>,
    t: Transaction | null,
    raw: boolean,
  ): Promise<DevolucionModel>;
  getDevolucionesByUserId(userId: bigint | number): Promise<any[]>;
  getDevolucionDetalle(idDevolucion: number): Promise<any[]>;
  getDevolucionById(idDevolucion: number): Promise<any | null>;
}

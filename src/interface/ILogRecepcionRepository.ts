import { Transaction } from "sequelize";
import LogRecepcionModel from "../models/pioapp/tables/LogRecepcionModel";

export default interface ILogRecepcionRepository {
  create(
    data: Partial<LogRecepcionModel>,
    t: Transaction | null,
    raw: boolean,
  ): Promise<LogRecepcionModel>;
}

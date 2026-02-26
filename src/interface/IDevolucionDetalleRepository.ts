import { Transaction } from "sequelize";
import DevolucionDetalleModel from "../models/pioapp/tables/DevolucionDetalleModel";

export default interface IDevolucionDetalleRepository {

    create(data:Partial<DevolucionDetalleModel>, t:Transaction|null, raw:boolean) : Promise<DevolucionDetalleModel>;

}
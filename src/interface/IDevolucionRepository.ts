import { Transaction } from "sequelize";
import DevolucionModel from "../models/pioapp/tables/DevolucionModel";

export default interface IDevolucionRepository {

    create(data:Partial<DevolucionModel>, t:Transaction|null, raw:boolean) : Promise<DevolucionModel>;

}
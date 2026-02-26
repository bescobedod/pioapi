import { Transaction } from "sequelize";
import IDevolucionDetalleRepository from "../interface/IDevolucionDetalleRepository";
import DevolucionDetalleModel from "../models/pioapp/tables/DevolucionDetalleModel";
import { injectable } from "tsyringe";

@injectable()
export default class DevolucionDetalleRepository implements IDevolucionDetalleRepository {

    async create(data: Partial<DevolucionDetalleModel>, t: Transaction | null = null, raw: boolean = false): Promise<DevolucionDetalleModel> {
        const result = await DevolucionDetalleModel.create(data, {
            transaction: t
        })
        if(!result) throw new Error(`Error al crear el detalle de la devolucion.`)
        return raw ? result.get({ plain: true }) : result
    }

}
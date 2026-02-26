import { Transaction } from "sequelize";
import IDevolucionRepository from "../interface/IDevolucionRepository";
import DevolucionModel from "../models/pioapp/tables/DevolucionModel";
import { injectable } from "tsyringe";

@injectable()
export default class DevolucionRepository implements IDevolucionRepository {

    async create(data: Partial<DevolucionModel>, t: Transaction | null = null, raw: boolean = false): Promise<DevolucionModel> {
        const result = await DevolucionModel.create(data, {
            transaction: t
        })
        if(!result) throw new Error(`Error al crear el encabezado de la devolucion.`)
        return raw ? result.get({ plain: true }) : result
    }

}
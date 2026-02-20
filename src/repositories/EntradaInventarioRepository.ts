import { injectable } from "tsyringe";
import IEntradaInventarioRepository from "../interface/IEntradaInventarioRepository";
import tEntradaInventarioModel from "../models/pdv/tables/tEntradaInventarioModel";
import { col, fn, literal, Op, Transaction } from "sequelize";

@injectable()
export default class EntradaInventarioRepository implements IEntradaInventarioRepository {

    async create(data: Partial<tEntradaInventarioModel>, t:Transaction | null = null, error: boolean = true, raw:boolean = false): Promise<tEntradaInventarioModel | null> {
        const result = await tEntradaInventarioModel.create(data, { transaction: t })
        if(!result && error) throw new Error("Error al crear la entrada inventario.");
        return raw ? result.get({ plain: true }) : result
    }

    async findEntradaInventario(filters: Partial<tEntradaInventarioModel>, error: boolean = true, raw: boolean = false): Promise<tEntradaInventarioModel | null> {
        const result = await tEntradaInventarioModel.findOne({
            where: { ...filters },
            raw
        })
        if(!result && error) throw new Error("Error no se econtro ninguna entrada inventario.");
        return result
    }

    async updateByIdEntradaInventario(idEntradaInventario: number, data: Partial<tEntradaInventarioModel>, error: boolean = true, t: Transaction | null = null): Promise<number> {
        const [filasActualizadas] = await tEntradaInventarioModel.update(data, {
            where: {
                idEntradaInventario: idEntradaInventario
            },
            transaction: t
        })
        if(filasActualizadas <= 0 && error) throw new Error(`Error al editar la entrada con idEntradaInventario -> ${idEntradaInventario}`);
        return filasActualizadas
    }

    async getRecepcionesValidDay(empresa: string, tienda: string, raw: boolean = false): Promise<tEntradaInventarioModel[]> {
        const registros = await tEntradaInventarioModel.findAll({
            attributes: {
              include: [
                [
                  fn(
                    'CONCAT',
                    col('serie'),
                    literal("'-'"),
                    col('numero'),
                    literal("'-'"),
                    col('fecha')
                  ),
                  'title_resumen'
                ]
              ]
            },
            where: {
              empresa,
              tienda,
              serie: {
                [Op.in]: ['AG2', 'AG3']
              },
              anulado: {
                [Op.ne]: 1
              },
              fecha: {
                [Op.between]: [
                  literal("DATEADD(HOUR, -24, GETDATE())"),
                  literal("GETDATE()")
                ]
              }
            },
            raw
        })

        return registros
    }

}
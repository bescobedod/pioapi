import { injectable } from "tsyringe";
import ArticulosRutaRecepcionView from "../models/grupopinulito/views/ArticulosRutaRecepcionView";
@injectable()
export default class ArticulosRutaRecepcionViewRepository {
  async getAllByNumeroAndSerie(
    numero: number,
    serie: string,
    raw: boolean = false,
  ): Promise<ArticulosRutaRecepcionView[]> {
    const result = await ArticulosRutaRecepcionView.findAll({
      where: { numero: numero, serie: serie },
      order: [["codigo_articulo", "DESC"]],
      raw,
    });
    return result;
  }
}

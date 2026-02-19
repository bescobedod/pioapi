import { JsonResponse, RequestAuth } from "../../types/ResponseTypes";
import { Response } from "express";
import { handleSend } from "../../utils/HandlerFactory";
import { inject, injectable } from "tsyringe";
import ArticulosRutaViewRepository from "../../repositories/ArticulosRutaViewRepository";
import {
  PedidosRutaDtoType,
  PedidosRutaRecepcionDtoType,
} from "../../dtos/Rutas/PedidosRutaDto";
import { ListArticulosRutaDtoType } from "../../dtos/Rutas/ListArticulosRutaDto";
import ArticulosRutaService from "../../services/Rutas/ArticulosRutaService";
import ArticulosRutaRecepcionViewRepository from "../../repositories/ArticulosRutaRecepcionViewRepository";

@injectable()
export default class ArticulosRutaController {
  constructor(
    @inject(ArticulosRutaViewRepository)
    private articulosRutaViewRepository: ArticulosRutaViewRepository,
    @inject(ArticulosRutaRecepcionViewRepository)
    private articulosRutaRecepcionViewRepository: ArticulosRutaRecepcionViewRepository,
    @inject(ArticulosRutaService)
    private articulosRutaService: ArticulosRutaService,
  ) {}

  async listArticulosRuta(
    req: RequestAuth<PedidosRutaDtoType>,
    res: Response<JsonResponse<any[]>>,
  ) {
    await handleSend(
      res,
      async () => {
        const result =
          await this.articulosRutaViewRepository.getAllByPedidoAndSerie(
            req.body.id_pedido,
            req.body.serie,
          );
        return result;
      },
      "Articulos listados correctamente.",
    );
  }

  async listArticulosRutaRecepcion(
    req: RequestAuth<PedidosRutaRecepcionDtoType>,
    res: Response<JsonResponse<any[]>>,
  ) {
    await handleSend(
      res,
      async () => {
        const result =
          await this.articulosRutaRecepcionViewRepository.getAllByNumeroAndSerie(
            req.body.numero,
            req.body.serie,
          );
        return result;
      },
      "Articulos listados correctamente.",
    );
  }

  async listEntradaArticulosTiendaPOS(
    req: RequestAuth<ListArticulosRutaDtoType>,
    res: Response<JsonResponse<any>>,
  ) {
    await handleSend(
      res,
      async () => {
        const result =
          await this.articulosRutaService.getListArtExternalServicePOS(
            req.body,
          );
        return result;
      },
      "Articulos Entrada listados correctamente.",
    );
  }
}

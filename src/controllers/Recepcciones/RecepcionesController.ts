import { inject, injectable } from "tsyringe";
import { handleSend } from "../../utils/HandlerFactory";
import {
  JsonResponse,
  RequestAuth,
  userToken,
} from "../../types/ResponseTypes";
import { Response } from "express";
import { saveRecepcionDtoType } from "../../dtos/recepciones/SaveRecepcionDto";
import RecepcionesServices from "../../services/Recepciones/RecepcionesServices";
import EntradaInventarioRepository from "../../repositories/EntradaInventarioRepository";
import { GetRecepcionesValidDayDtoType } from "../../dtos/recepciones/GetRecepcionesValidDayDto";

@injectable()
export default class RecepcionesController {
  constructor(
    @inject(RecepcionesServices)
    private recepcionesServices: RecepcionesServices,
    @inject(EntradaInventarioRepository) private entradaInventarioRepository:EntradaInventarioRepository
  ) {}

  async uploadRecepccionesClient(
    req: RequestAuth<saveRecepcionDtoType>,
    res: Response<JsonResponse<any>>,
  ) {
    await handleSend(
      res,
      async (t) => {
        const result = await this.recepcionesServices.saveRecepcionService(
          req.body,
          req.user as userToken,
          t,
        );
        return result;
      },
      "Recepccion creada correctamente.",
      true,
      "PIOAPP",
    );
  }

  async getRecepcionesValidDay(req:RequestAuth<GetRecepcionesValidDayDtoType>, res:Response<JsonResponse<any>>) {
    await handleSend(res, async(t) => {
      const result = await this.entradaInventarioRepository.getRecepcionesValidDay(
        req.body.empresa,
        req.body.tienda
      )
      return result
    }, "Recepciones listadas correctamente.")
  }
}

import { inject, injectable } from "tsyringe";
import { JsonResponse, RequestAuth, userToken } from "../../types/ResponseTypes";
import { handleSend } from "../../utils/HandlerFactory";
import { Response } from "express";
import { DevolucionCreateDtoType, DevolucionCreateDtoTypeFiles } from "../../dtos/Devolucion/DevolucionCreateDto";
import DevolucionService from "../../services/Devolucion/DevolucionService";
import { Transaction } from "sequelize";
import { devolucionQueue } from "../../queue/Devolucion/DevolucionQueue";

@injectable()
export default class DevolucionController {

    constructor(
        @inject(DevolucionService) private devolucionService:DevolucionService
    ) {}

    async createDevolucion(req:RequestAuth<DevolucionCreateDtoType>, res:Response<JsonResponse<any>>) {
        await handleSend(res, async() => {
            await devolucionQueue.add("createDevolucionJob", {
                data: { ...req.body, detalle_devolucion: JSON.parse(req.body.detalle_devolucion as any) },
                files: req.files,
                user: req.user
            }, {
                removeOnComplete: true,
                removeOnFail: {
                    age: 86400
                }
            })
            return null
        }, "Devolucion enviada a procesamiento.")
    }

}
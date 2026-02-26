import { inject, injectable } from "tsyringe";
import { DevolucionCreateDtoType, DevolucionCreateDtoTypeFiles } from "../../dtos/Devolucion/DevolucionCreateDto";
import { Transaction } from "sequelize";
import DevolucionRepository from "../../repositories/DevolucionRepository";
import { userToken } from "../../types/ResponseTypes";
import FileServices from "../S3/FileServices";
import DevolucionDetalleRepository from "../../repositories/DevolucionDetalleRepository";
import { handleTransaction } from "../../utils/DB/TransactionsHelpers";

@injectable()
export default class DevolucionService {

    constructor(
        @inject(DevolucionRepository) private devolucionRepository:DevolucionRepository,
        @inject(FileServices) private fileServices:FileServices,
        @inject(DevolucionDetalleRepository) private devolucionDetalleRepository:DevolucionDetalleRepository 
    ) {}

    async createDevolucionService(data:DevolucionCreateDtoType, files:DevolucionCreateDtoTypeFiles, user:userToken):Promise<any> { 
        return await handleTransaction(async(t) => {
            const fotografiaTemperatura = await this.fileServices.fileUploadSingle(
                files.foto_temperatura, 'devoluciones'
            )
            const urlVideoComprobante = await this.fileServices.fileUploadSingle(
                files.video_comprobante, 'devoluciones'
            )
            const encabezadoDevolucion = await this.devolucionRepository.create({
                empresa: data.empresa,
                tienda: data.tienda,
                idEntradaInventario: data.idEntradaInventario,
                id_devolucion_estado: 1,
                fotografia_temperatura: fotografiaTemperatura.urlS3 ?? "",
                url_video_comprobante: urlVideoComprobante.urlS3 ?? "",
                userCreatedAt: Number(user.id_users)
            }, t, true)
            await Promise.all(
                data.detalle_devolucion.map(el => this.devolucionDetalleRepository.create({
                    id_devolucion: encabezadoDevolucion.id_devolucion,
                    ItemCode: el?.ItemCode ?? "",
                    nombreProducto: el?.nombreProducto ?? "",
                    cantidadReal: el.cantidadReal,
                    cantidadDevolver: el.cantidadDevolver,
                    userCreatedAt: Number(user.id_users)
                }, t))
            )
            return encabezadoDevolucion
        }, 'PIOAPP')
    }

}
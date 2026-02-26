import { Worker } from "bullmq";
import { connectionRedisBullMq } from "../../config/redisClient";
import IWorker from "../../interface/Worker/IWorker";
import { inject, injectable } from "tsyringe";
import DevolucionService from "../../services/Devolucion/DevolucionService";
import { DataJobCrearDevolucion } from "../../types/WorkerDevolucion/WorkerDevolucionType";
import { reviveFiles } from "../../utils/FilesHelpers";
import HandleLogData from "../../types/Logs/HandleLogData";
import logger from "../../logs/logger";

@injectable()
export default class DevolucionWorker implements IWorker {

    private worker:Worker|null = null;

    constructor (
        @inject(DevolucionService) private devolucionService:DevolucionService
    ) {}

    start(): void {
        this.worker = new Worker(
            "devolucionQueue",
            async (job) => {
                const { data, files, user } = job.data as DataJobCrearDevolucion
                const filesBuffer = reviveFiles(files)
                const result = await this.devolucionService.createDevolucionService(
                    data,
                    filesBuffer,
                    user
                )
                console.log(result)
            },
            {
                connection: connectionRedisBullMq,
            }
        )

        this.worker.on('completed', (job) => {
            console.log(`Job ${job.id} completado`)
        })

        this.worker.on('failed', (job, err) => {
            console.error(`Job ${job?.id} falló:`, err)
            logger.error("Error en el Job de creacion de devolucion.", {
                type: 'devolucionJob',
                message: err?.message ?? "",
                stack: err?.stack ?? "",
                name: err?.name ?? "",
                isWithRollBack: true,
                connection: 'PIOAPP',
                commitController: false,
                errorRaw: err
            } as HandleLogData)
        })
    }

}
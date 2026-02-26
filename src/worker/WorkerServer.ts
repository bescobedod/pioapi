import { container } from "tsyringe";
import DevolucionWorker from "./Devolucion/DevolucionWorker";
import IWorker from "../interface/Worker/IWorker";

export default class WorkerServer {

    static WorkerModule () {
        return [
            DevolucionWorker
        ]
    }

    static initWorkers() {
        for(const Module of this.WorkerModule()) {
            const instance = container.resolve<IWorker>(Module)
            instance.start()
        }
    }

}
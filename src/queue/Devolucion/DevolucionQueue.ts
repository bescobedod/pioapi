import { Queue } from "bullmq";
import { connectionRedisBullMq } from "../../config/redisClient";

export const devolucionQueue = new Queue("devolucionQueue", {
    connection: connectionRedisBullMq
})
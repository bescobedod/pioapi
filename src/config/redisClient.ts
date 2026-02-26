import { createClient } from 'redis'
import IORedis from 'ioredis'

//redis Ioredis connect to bullmQ Colas
export const connectionRedisBullMq = new IORedis({ 
    maxRetriesPerRequest: null, 
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
})

//redis client connect initalize cache
const redisClient = createClient({
    url: `${process?.env?.REDIS_URL||""}`
})

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
})

export const connectRedis = async() => {
    if(redisClient.isOpen) return
    await redisClient.connect()
    console.log(`Redis connected`)
}

export default redisClient
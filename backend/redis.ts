import config from '../config.json';
import Redis from 'ioredis';
import zlib from 'zlib';
import util from 'util';

import { server } from './app'

const redis = new Redis(config.redis)

const deflate = util.promisify(zlib.deflate)
const inflate = util.promisify(zlib.inflate)

let redisActive = false

redis.on('ready', () => {
  redisActive = true
})

redis.on('end', () => {
  redisActive = false
})

redis.on('error', (err) => {
  redisActive = false
  server.log.error(`Redis error: ${err}`)
})

export const set = async (key: string, val: string) => {
  if (!redisActive) return
  const zipped = await deflate(JSON.stringify(val))
  redis.set(key, zipped)
}

export const get = async (key: string) => {
  if (!redisActive) return null
  const zipped = await redis.getBuffer(key)
  if (!zipped) return null
  return JSON.parse((await inflate(zipped)).toString())
}
const Redis = require("ioredis");
const env = require("../config/env");
const logger = require("./logger");

let client = null;
let warned = false;

function getRedisClient() {
  if (!env.REDIS_URL) return null;
  if (!client) {
    client = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 2,
      connectTimeout: 3000,
      enableOfflineQueue: false,
      lazyConnect: true,
    });
    client.on("error", (err) => {
      if (!warned) {
        logger.warn({ err: err.message }, "Redis connection error in matgreen-backend");
        warned = true;
      }
    });
    client.on("ready", () => {
      warned = false;
    });
  }
  return client;
}

async function runRedisCommand(command, ...args) {
  const redis = getRedisClient();
  if (!redis) return null;
  try {
    if (redis.status === "wait") {
      await redis.connect();
    }
    return await redis.call(command, ...args);
  } catch (err) {
    if (!warned) {
      logger.warn({ command, err: err.message }, "Redis command failed");
      warned = true;
    }
    return null;
  }
}

module.exports = {
  getRedisClient,
  runRedisCommand,
};

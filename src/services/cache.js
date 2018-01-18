const Redis = require('ioredis');

const keyPrefix = 'cache-97305a42-1:'; // random prefix to avoid collisions
const redis = new Redis(process.env.REDIS_URL, { keyPrefix });

const cache = {
  async fetch(key, promise) {
    let result = await redis.get(key);

    if (!result) {
      result = JSON.stringify({ value: Promise.resolve(promise) });
      console.log(`[cache] ${result}`);
      redis.set(key, result);
    }

    return JSON.parse(result).value;
  },
  async clear(key) {
    return redis.del(key);
  },
};

module.exports = cache;

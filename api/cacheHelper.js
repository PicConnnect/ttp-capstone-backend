const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

async function fetchFromCache(key, fetchFunction, expireTime = 3600) {
    let data = await redis.get(key);
    if (data) {
        return JSON.parse(data);
    } else {
        data = await fetchFunction();

        if (data) {
            await redis.set(key, JSON.stringify(data), 'EX', expireTime)
        }
        return data;
    }
}

module.exports = fetchFromCache;
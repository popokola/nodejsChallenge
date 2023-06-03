const { Redis } =  require('@upstash/redis')
const { Ratelimit } = require('@upstash/ratelimit');

const redis = new Redis({
  url: process.env.REDIS_URl,
  token: process.env.REDIS_TOKEN,
  onConnectionError: (err) => {
    console.log('Redis connection error: ' + err);
  },
});



exports.redis = redis;

exports.ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(15, "10 s"),
    //analytics: true,
    //prefix: "@upstash/ratelimit",
});


const { ratelimit } = require('../libs/redis.js');

exports.rateLimiter =  async function (req, res, next) {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const key = `rateLimit:${ip}`;
    const { remaining, reset, limit, success, pending } = await ratelimit.limit(`mw_${key}`);

    await pending;

    if (!success) {
        return res.status(429).json({
            error: "Too many requests per minute",
            headers: {
                "Retry-After": reset,
                "X-RateLimit-Limit": limit,
            },
        });
    } 

    next();
}
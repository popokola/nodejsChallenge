const rateLimit = require('express-rate-limit')
const { createClient } = require('redis')

/*
const client = createClient ({
    url : "redis://default:4d00078dc5394b76adda92cdb360b653@eu2-suitable-shrimp-31405.upstash.io:31405"
});*/

//client.connect();

exports.limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});






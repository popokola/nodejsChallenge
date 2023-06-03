let connexions = new Set();
let currentId = 0;
//const { redis } = require("./redis");
const Redis = require('ioredis');

function sse() {
  return function (req, res, next) {
    const redisSubscriber = new Redis(process.env.REDIS_CONN_URl);
    res.sseSetup = function () {

      if (req.httpVersionMajor === 1) {
        res.setHeader('Connection', 'keep-alive');
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
    
      connexions.add(res);

      // Create a new Redis subscriber
      redisSubscriber.subscribe('my-channel');

  
      
      // Event listener for receiving messages from Redis
      redisSubscriber.on('message', (channel, message) => {
        // Send the message to the client through SSE
        res.write(`data: ${message}\n\n`);
      });
    
      

      const intervalId = setInterval(() => {
        res.write(':\n\n');
      }, 1000);

      res.on('close', () => {
        clearInterval(intervalId);
        res.end();
        connexions.delete(res);
        redisSubscriber.unsubscribe('my-channel');
        redisSubscriber.quit();
      });
    };

    res.sendSSE = function (data, eventName) {

        const dataString = 
            `id: ${currentId++}\n` +
            `data: ${JSON.stringify(data)}\n` +
            `nbConnexions: ${connexions.size}\n` +
            (eventName ? `event: ${eventName}\n\n` : '\n');


            /*
        connexions.forEach(conn => {
            conn.write(dataString);
        });
        */

        //const redisClient = new Redis("redis://default:4d00078dc5394b76adda92cdb360b653@eu2-suitable-shrimp-31405.upstash.io:31405");
        redisSubscriber.publish('my-channel', JSON.stringify(dataString));
      
        redisSubscriber.quit();
    };

    next();
  };
}

module.exports = sse;

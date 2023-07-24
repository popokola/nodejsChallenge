const Redis = require('ioredis');

let connexions = new Set();
let currentId = 0;
let redisSubscriber = null;
let redisPublisher = new Redis(process.env.REDIS_CONN_URl);

function sse() {
  return function (req, res, next) {
    res.sseSetup = function () {
      if (req.httpVersionMajor === 1) {
        res.setHeader('Connection', 'keep-alive');
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');

      connexions.add(res);

      if (!redisSubscriber) {
        // Create a new Redis subscriber only if it doesn't exist
        redisSubscriber = new Redis(process.env.REDIS_CONN_URl);

        // Event listener for receiving messages from Redis
        redisSubscriber.on('message', (channel, message) => {
          // Send the message to the client through SSE
          connexions.forEach((conn) => {
            conn.write(`data: ${message}\n\n`);
          });
        });
      }

      const channel = 'my-channel';

      // Subscribe to the Redis channel
      redisSubscriber.subscribe(channel);

      const intervalId = setInterval(() => {
        res.write(':\n\n');
      }, 1000);

      res.on('close', () => {
        clearInterval(intervalId);
        res.end();
        connexions.delete(res);
        if (connexions.size === 0) {
          redisSubscriber.unsubscribe(channel);
          redisSubscriber.quit();
          redisSubscriber = null;
        }
      });
    };

    res.sendSSE = function (data, eventName) {
      const messageObject = {
        id: currentId++,
        data,
        nbConnexions: connexions.size,
        event: eventName
      };

      const messageString = JSON.stringify(messageObject);

      // Publish the message to the Redis channel using the publisher instance
      redisPublisher.publish('my-channel', messageString);
    };

    next();
  };
}

module.exports = sse;

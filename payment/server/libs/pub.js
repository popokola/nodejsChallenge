const Redis = require('ioredis');
const sseConnections = new Map();
const redisSubscriber = new Redis(process.env.REDIS_CONN_URl);

// Function to create or retrieve a Redis subscriber
exports.createRedisSubscriber = (channelId, res) => {
    const existingConnection = Array.from(sseConnections.values()).find(
      (connectionData) => connectionData.channelId === channelId
    );
  
    if (existingConnection) {
      sseConnections.set(res, existingConnection);
      return existingConnection.redisSubscriber;
    }
  
    const redisSubscriber = new Redis(process.env.REDIS_CONN_URl);
    sseConnections.set(res, { channelId, redisSubscriber });
    return redisSubscriber;
};
  
// Function to subscribe to a Redis channel
exports.subscribeToChannel = (redisSubscriber, channel) => {
  redisSubscriber.subscribe(channel);
}

// Function to register a message listener for Redis
exports.registerMessageListener = (redisSubscriber, channel, channelId, res, intervalId) => {
  const messageListener = (receivedChannel, message) => {
    if (receivedChannel === channel) {
      const messageObject = JSON.parse(message);
      if (messageObject.userId == channelId) {
        res.write(`data: ${message}\n\n`);
      }
    }
  };
  redisSubscriber.on('message', messageListener);
  sseConnections.get(res).messageListener = messageListener;
}

// Function to register the close handler for SSE connections
exports.registerCloseHandler = (redisSubscriber, channel, res, intervalId) => {
  res.on('close', () => {
    clearInterval(intervalId);
    res.end();

    const connectionData = sseConnections.get(res);
    if (connectionData) {
      const { redisSubscriber, messageListener } = connectionData;
      redisSubscriber.unsubscribe(channel);
      redisSubscriber.removeListener('message', messageListener);
      redisSubscriber.quit();
      sseConnections.delete(res);
    }
  });
}



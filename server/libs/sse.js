let connexions = new Set();
let currentId = 0;
const cluster = require("cluster");

function sse() {
  return function (req, res, next) {
    res.sseSetup = function () {
     
      if (req.httpVersionMajor === 1) {
        res.setHeader('Connection', 'keep-alive');
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
    
      connexions.add(res);
      

      const intervalId = setInterval(() => {
        res.write(':\n\n');
      }, 1000);

      res.on('close', () => {
        clearInterval(intervalId);
        res.end();
        connexions.delete(res);
      });
    };

    res.sendSSE = function (data, eventName) {
        const dataString = 
            `id: ${currentId++}\n` +
            `data: ${JSON.stringify(data)}\n` +
            `nbConnexions: ${connexions.size}\n` +
            (eventName ? `event: ${eventName}\n\n` : '\n');


        connexions.forEach(conn => {
            conn.write(dataString);
        });
    };

    next();
  };
}

module.exports = sse;

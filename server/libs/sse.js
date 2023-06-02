let connexions = new Set();
let currentId = 0;

function sse() {
  return function (req, res, next) {
    res.sseSetup = function () {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      });
      if (req.httpVersionMajor === 1) {
        res.setHeader('Connection', 'keep-alive');
      }
    
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

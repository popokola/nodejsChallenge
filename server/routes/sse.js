const { Router } = require("express");

module.exports = function () {
    const router = Router();
    let connexions = new Set();
    let currentId = 0;

    router.get('/sse', async (req, res) => {
        // Configure SSE headers
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });

        connexions.add(res);
    
        // Send SSE events at regular intervals
        const intervalId = setInterval(() => {
           
            const dataString = 
                `id: ${currentId++}\n` +
                `event: update${process.pid}\n` +
                `data: ${new Date().toISOString()}\n\n`;
            
            connexions.forEach(conn => {
                conn.write(dataString);
            });

        }, 1000);
        
        // Close the SSE connection when the client closes the connection
        res.on('close', () => {
            console.log('Client closed the connection' + process.pid);
            clearInterval(intervalId);
            res.end();
            connexions.delete(res);
        });


    });

    return router;
}
import WebSocket from 'ws';

const ws = new WebSocket('wss://pumpportal.fun/api/data');

// Data structure to store trades
const trades = [];

// Define the token CA to monitor
const TOKEN_CA = "91WNez8D22NwBssQbkzjy4s2ipFrzpmn5hfvWVe2aY5p";

ws.on('open', function open() {
    const payload = {
        method: "subscribeTokenTrade",
        keys: [TOKEN_CA] // Watching the specified token
    };
    ws.send(JSON.stringify(payload));
});

ws.on('message', function message(data) {
    const parsedData = JSON.parse(data);
    if (parsedData.method === "updateTokenTrade") {
        const { side, timestamp } = parsedData; // Assuming 'side' indicates buy/sell
        trades.push({ side, timestamp: Date.now() });

        // Remove trades older than 5 minutes
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        while (trades.length > 0 && trades[0].timestamp < fiveMinutesAgo) {
            trades.shift();
        }

        // Calculate buys and sells
        const buys = trades.filter(trade => trade.side === 'buy').length;
        const sells = trades.filter(trade => trade.side === 'sell').length;

        console.log(`Buys: ${buys}, Sells: ${sells}`);

        // Determine Pou's state
        const pouState = buys > sells ? "fed" : "hungry";
        console.log(`Pou is ${pouState}`);
    }
});

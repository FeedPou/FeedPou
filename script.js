import WebSocket from 'ws';

const pou = document.getElementById('pou');
const pouStatusSmall = document.getElementById('pou-status-small');

let buys = 0;
let sells = 0;
let marketCap = 0;
let ws;

// Hardcoded token address
const tokenAddress = '91WNez8D22NwBssQbkzjy4s2ipFrzpmn5hfvWVe2aY5p';

// Function to update Pou's state and size
function updatePou() {
  // Determine Pou's size and state
  if (marketCap < 300000) {
    // Baby Pou
    if (buys > sells) {
      pou.src = 'baby_pou_fed.png'; // Baby Pou fed version
      pouStatusSmall.textContent = 'Pou is fed';
    } else {
      pou.src = 'baby_pou_hungry.png'; // Baby Pou hungry version
      pouStatusSmall.textContent = 'Pou is hungry';
    }
    pou.style.width = '200px';
  } else {
    // Adult Pou
    if (buys > sells) {
      pou.src = 'pou_fed.png'; // Adult Pou fed version
      pouStatusSmall.textContent = 'Pou is fed';
    } else {
      pou.src = 'pou_hungry.png'; // Adult Pou hungry version
      pouStatusSmall.textContent = 'Pou is hungry';
    }
    pou.style.width = '300px';
  }
}

// Function to connect to the API and track data
function startTracking() {
  ws = new WebSocket('wss://pumpportal.fun/api/data');

  ws.onopen = () => {
    const payload = {
      method: 'subscribeTokenTrade',
      keys: [tokenAddress], // Hardcoded token address
    };
    ws.send(JSON.stringify(payload));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.method === 'updateTokenTrade') {
      const { side } = data;
      if (side === 'buy') buys += 1;
      else if (side === 'sell') sells += 1;

      // Simulate market cap for demo (replace with real data if available)
      marketCap = Math.random() * 500000;

      // Update Pou state
      updatePou();
    }
  };

  // Fetch updates every 30 seconds
  setInterval(() => {
    updatePou();
    buys = 0;
    sells = 0;
  }, 30000);
}

// Start tracking immediately (no user input required)
startTracking();

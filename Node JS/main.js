const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
      }
});

let bettingMatches = new Map();

function padTo2Digits(num) {
  return String(num).padStart(2, '0');
}


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "x-requested-with, content-type");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    next();
});

// Define a route that accepts POST requests with JSON data
app.use(express.json());
app.post('/bettingMatches', (req, res) => {
  // Extract the data from the request body and create a new BettingData object
  matchID = req.body.MatchID;
  const now = new Date();
  const newBettingData = {
    PlayerHome: req.body.PlayerHome,
    PlayerAway: req.body.PlayerAway,
    OddsHome: req.body.OddsHome,
    OddsAway: req.body.OddsAway,
    Payout: req.body.Payout,
    PlayTime: req.body.PlayTime,
    TS: now.getTime(),
    Time: now.getHours() + ":" + padTo2Digits( now.getMinutes() ) + ":" + padTo2Digits( now.getSeconds() ),
    URL: req.body.URL
  };
  bettingMatches.set(matchID, newBettingData);
  //console.log(newBettingData)
  res.status(201).send('New betting match added successfully.');
});

function getTimeDifferenceInMinutes(timestamp1, timestamp2) {
  const differenceInMilliseconds = Math.abs(timestamp1 - timestamp2);
  const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
  return differenceInMinutes;
}

io.on('connection', (socket) => {
  setInterval(async () => {
    try {
      //const response = await axios.get('https://api.coindesk.com/v1/bpi/currentprice.json');
      //const price = response.data.bpi.USD.rate_float;
      const now = new Date().getTime();
      //if log is older than 3 minutes
      bettingMatches.forEach( (val, key) => {
        if (getTimeDifferenceInMinutes(now, val.TS) > 3){
          bettingMatches.delete(key);
        }
      });
      socket.emit("bettingData", JSON.stringify(Object.fromEntries(bettingMatches)));
    } catch (error) {
      console.error(error);
    }
  }, 1000);
});


server.listen(8000, () => {
  console.log('Server started on port 8000');
});
const fs = require(`fs`);
const http = require(`http`);
const WebSocket = require(`ws`); // npm i ws

const board = [
  [
    "card back",
    "card rank-2 spades",
    "card rank-3 spades",
    "card rank-4 spades",
    "card rank-5 spades",
    "card rank-10 diams",
    "card rank-q diams",
    "card rank-k diams",
    "card rank-a diams",
    "card back",
  ],

  [
    "card rank-6 clubs",
    "card rank-5 clubs",
    "card rank-4 clubs",
    "card rank-3 clubs",
    "card rank-2 clubs",
    "card rank-4 spades",
    "card rank-5 spades",
    "card rank-6 spades",
    "card rank-7 spades",
    "card rank-a clubs",
  ],

  [
    "card rank-7 clubs",
    "card rank-a spades",
    "card rank-2 diams",
    "card rank-3 diams",
    "card rank-4 diams",
    "card rank-k clubs",
    "card rank-q clubs",
    "card rank-10 clubs",
    "card rank-8 spades",
    "card rank-k clubs",
  ],

  [
    "card rank-8 clubs",
    "card rank-k spades",
    "card rank-6 clubs",
    "card rank-5 clubs",
    "card rank-4 clubs",
    "card rank-9 hearts",
    "card rank-8 hearts",
    "card rank-9 clubs",
    "card rank-9 spades",
    "card rank-6 spades",
  ],

  [
    "card rank-9 clubs",
    "card rank-q spades",
    "card rank-7 clubs",
    "card rank-6 hearts",
    "card rank-5 hearts",
    "card rank-2 hearts",
    "card rank-7 hearts",
    "card rank-8 clubs",
    "card rank-10 spades",
    "card rank-10 clubs",
  ],

  [
    "card rank-a spades",
    "card rank-7 hearts",
    "card rank-9 diams",
    "card rank-a hearts",
    "card rank-4 hearts",
    "card rank-3 hearts",
    "card rank-k hearts",
    "card rank-10 diams",
    "card rank-6 hearts",
    "card rank-2 diams",
  ],

  [
    "card rank-k spades",
    "card rank-8 hearts",
    "card rank-8 diams",
    "card rank-2 clubs",
    "card rank-3 clubs",
    "card rank-10 hearts",
    "card rank-q hearts",
    "card rank-q diams",
    "card rank-5 hearts",
    "card rank-3 diams",
  ],

  [
    "card rank-q spades",
    "card rank-9 hearts",
    "card rank-7 diams",
    "card rank-6 diams",
    "card rank-5 diams",
    "card rank-a clubs",
    "card rank-a diams",
    "card rank-k diams",
    "card rank-4 hearts",
    "card rank-4 diams",
  ],

  [
    "card rank-10 spades",
    "card rank-10 hearts",
    "card rank-q hearts",
    "card rank-k hearts",
    "card rank-a hearts",
    "card rank-3 spades",
    "card rank-2 spades",
    "card rank-2 hearts",
    "card rank-3 hearts",
    "card rank-5 diams",
  ],

  [
    "card back",
    "card rank-9 spades",
    "card rank-8 spades",
    "card rank-7 spades",
    "card rank-6 spades",
    "card rank-9 diams",
    "card rank-8 diams",
    "card rank-7 diams",
    "card rank-6 diams",
    "card back",
  ],
];

const positionBoard = [
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
];

const deck = [
  "card rank-a spades",
  "card rank-2 spades",
  "card rank-3 spades",
  "card rank-4 spades",
  "card rank-5 spades",
  "card rank-6 spades",
  "card rank-7 spades",
  "card rank-8 spades",
  "card rank-9 spades",
  "card rank-10 spades",
  "card rank-j spades",
  "card rank-q spades",
  "card rank-k spades",
  "card rank-a clubs",
  "card rank-2 clubs",
  "card rank-3 clubs",
  "card rank-4 clubs",
  "card rank-5 clubs",
  "card rank-6 clubs",
  "card rank-7 clubs",
  "card rank-8 clubs",
  "card rank-9 clubs",
  "card rank-10 clubs",
  "card rank-j clubs",
  "card rank-q clubs",
  "card rank-k clubs",
  "card rank-a diams",
  "card rank-2 diams",
  "card rank-3 diams",
  "card rank-4 diams",
  "card rank-5 diams",
  "card rank-6 diams",
  "card rank-7 diams",
  "card rank-8 diams",
  "card rank-9 diams",
  "card rank-10 diams",
  "card rank-j diams",
  "card rank-q diams",
  "card rank-k diams",
  "card rank-a hearts",
  "card rank-2 hearts",
  "card rank-3 hearts",
  "card rank-4 hearts",
  "card rank-5 hearts",
  "card rank-6 hearts",
  "card rank-7 hearts",
  "card rank-8 hearts",
  "card rank-9 hearts",
  "card rank-10 hearts",
  "card rank-j hearts",
  "card rank-q hearts",
  "card rank-k hearts",
];

const divideDeckIntoPieces = (deck) => {
  let shuffled = deck
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  const result = new Array(Math.ceil(shuffled.length / 6))
    .fill()
    .map((_) => shuffled.splice(0, 6));
  // console.log(result);
  return result;
};

// code to read file
const readFile = (fileName) =>
  new Promise((resolve, reject) => {
    fs.readFile(fileName, `utf-8`, (readErr, fileContents) => {
      if (readErr) {
        reject(readErr);
      } else {
        resolve(fileContents);
      }
    });
  });

// code to create a server
const server = http.createServer(async (req, resp) => {
  console.log(`browser asked for ${req.url}`);
  if (req.url == `/mydoc`) {
    const clientHtml = await readFile(`client.html`);
    resp.end(clientHtml);
  } else if (req.url == `/myjs`) {
    const clientJs = await readFile(`client.js`);
    resp.end(clientJs);
  } else if (req.url == `/sequence.css`) {
    const sequenceCss = await readFile(`sequence.css`);
    resp.end(sequenceCss);
  } else {
    resp.end(`not found`);
  }
});

// to listen for clients
server.listen(8000);

// creating a web socket
const wss = new WebSocket.Server({ port: 8080 });

let numberofplayers = 0;

const players = new Map();

function sendNextDeck() {
  for(let client of players.keys()) {
    let myInfo = players.get(client);
    if(myInfo["mydeck"].length > 0) {
      return false;
    }
  }
  return true;
}

function get5by5Board(row, col, b) {
  let new_board = [];
  for(let i=row; i<row+5; i++) {
      new_board.push(b[i].slice(col, col+5))
  }
  return new_board;
}

function check5by5Board(b) {
  for(let i=0; i<b.length; i++) {
      let row_seq = true;
      let col_seq = true;
      for(let j=0; j<b.length-1; j++) {
          if(b[i][j] === "-" || (b[i][j] != b[i][j+1])) {
              row_seq = false;
          }
          if(b[j][i] === "-" || (b[j][i] != b[j+1][i])) {
              col_seq = false;
          }
      }
      if(row_seq || col_seq) {
          return true;
      }
      let dia1_seq = true;
      let dia2_seq = true;
      let index = 4;
      for(let i=0; i<b.length-1; i++) {
          if(b[i][i] === "-" || (b[i][i] != b[i+1][i+1])) {
              dia1_seq = false;
          }
          if(b[i][index] === "-" || (b[i][index] != b[i+1][index-1])) {
              dia2_seq = false;
          }
          index = index - 1;
      }
      if(dia1_seq || dia2_seq) {
          return true;
      }
  }
  return false;
}

function isWinner(b) {
  for(let i=0; i<6; i++) {
      for(let j=0; j<6; j++) {
          // console.log(get5by5Board(i, j, b));
          // console.log(check5by5Board(get5by5Board(i, j, b)));
          if(check5by5Board(get5by5Board(i, j, b))) {
              return true;
          }
      }
  }
  return false;
}

deckpieces = divideDeckIntoPieces(deck);
let secondDeckSent = false;

let next = 1;



wss.on("connection", (ws) => {

  if (numberofplayers == 4) {
    ws.send(JSON.stringify({
      type: "gamefull",
      serverMessage : "Sorry, game is already full no more players can join the game"
    }))
    return
  }
  
  numberofplayers = numberofplayers + 1;

  let id = numberofplayers;
  let color = "green";
  if(id%2 === 0) {
    color = "blue";
  }
  // console.log("id : ", id)
  let playerInfo = {"myid" : id, "mycolor":color, "mydeck" : deckpieces[id-1]};
  players.set(ws, playerInfo);

    ws.on('message', (msg) => {
		// console.log(`received: ${msg}`)
    const message = JSON.parse(msg)
    if (message.type == "validclick") {
      next = next % 4 + 1
      let myInfo = players.get(ws);
      playerInfo = {"myid" : myInfo["myid"], "mycolor":myInfo["mycolor"], "mydeck" : message.newer};
      players.set(ws, playerInfo);
      positionBoard[message.columnnumber][message.index] = message.color;


      if (isWinner(positionBoard)) {
        // console.log("in wineer")
        for(let c of players.keys()) {
          let cInfo = players.get(c);
          if((cInfo["myid"] === (next - 1) % 4) || (cInfo["myid"] === (next + 1) % 4)) {
            // console.log("here1")
            c.send(JSON.stringify({
              type: "gameover",
              positionBoard,
              serverMessage : "Congratulations Your Team Won The Game!!!"
            }))
          }
          else {
            // console.log("here1")
            c.send(JSON.stringify({
              type: "gameover",
              positionBoard,
              serverMessage : "Your Team Lost The Game!!!"
            }))
          }
            
        }
      }

      else if(secondDeckSent === true && sendNextDeck()) {
        console.log("in draw " + secondDeckSent === false + " " + sendNextDeck())
        console.log("in draw")
        for(let client of players.keys()) {
          client.send(JSON.stringify({
            type: "drawn",
            positionBoard,
            serverMessage : "Game Has Drawn!!!"
          }))
      }
    }

    else if(secondDeckSent === false && sendNextDeck()) {
      console.log("in seconddeck " + secondDeckSent === false + " " + sendNextDeck())
      console.log("in seconddeck")
      secondDeckSent = true
      for(let c of players.keys()) {
        let cInfo = players.get(c);
        // console.log("c[myid] : " + cInfo["myid"])
        cInfo = {"myid" : cInfo["myid"], "mycolor":cInfo["mycolor"], "mydeck" : deckpieces[cInfo["myid"]+3]};
        players.set(c, cInfo);
        c.send(JSON.stringify({
          type: "seconddeck",
          positionBoard,
          next,
          newdeck: cInfo["mydeck"],
          isTurn: cInfo["myid"] === next ? true : false,
          // serverMessage
        }))
      }
    }
    else {

      for(let client of players.keys()) {
        let myInfo = players.get(client);

        let serverMessage = "You are player " + myInfo["myid"];
        if (myInfo["myid"] === next ? true : false)
        {
          serverMessage = serverMessage + " and it's your turn";
        }
        else
        {
          serverMessage = serverMessage + " and it's player " + next + " turn";
        }

        // if(secondDeckSent === false && sendNextDeck())
        // {
        //   secondDeckSent = true;
        //   // next = next % 4 + 1
        //   for(let c of players.keys()) {
        //     let cInfo = players.get(c);
        //     console.log("c[myid] : " + cInfo["myid"])
        //     cInfo = {"myid" : cInfo["myid"], "mycolor":cInfo["mycolor"], "mydeck" : deckpieces[cInfo["myid"]+3]};
        //     players.set(ws, cInfo);
        //     c.send(JSON.stringify({
        //       type: "seconddeck",
        //       positionBoard,
        //       next,
        //       newdeck: cInfo["mydeck"],
        //       isTurn: cInfo["myid"] === next ? true : false,
        //       // serverMessage
        //     }))
        //   }
        //   break;
        // }
        // else
        // {
          client.send(JSON.stringify({
          type: "validclick",
          positionBoard,
          next,
          newdeck: myInfo["mydeck"],
          isTurn: myInfo["myid"] === next ? true : false,
          serverMessage
        }))
        // }
        
      }

    }
    }
  })

  if(numberofplayers == 4) {
    for(let client of players.keys()) {
    let myInfo = players.get(client);

    let serverMessage = "You are player " + myInfo["myid"];
    if (myInfo["myid"] === next ? true : false)
    {
      serverMessage = serverMessage + " and it's your turn";
    }
    else
    {
      serverMessage = serverMessage + " and it's player " + next + " turn";
    }

    client.send(JSON.stringify({
      type: 'newboard',
      board,
      positionBoard,
      newdeck: myInfo["mydeck"],
      color: myInfo["mycolor"],
      next,
      isTurn: myInfo["myid"] === next ? true : false,
      serverMessage
    }))
  }
  }
  else {
    for(let client of players.keys()) {
      let myInfo = players.get(client);
      client.send(JSON.stringify({
          type: "waiting",
          color: myInfo["mycolor"],
          serverMessage : "Waiting for " + (4-numberofplayers) + " more players to join the game"
        }))
      }
  }
});
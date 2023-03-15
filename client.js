const ws = new WebSocket(`ws://localhost:8080`);

const Sequence = () => {
  const [board, setBoard] = React.useState([[]]);
  const [positionBoard, setPositionBoard] = React.useState([[]]);
  const [cards, setCards] = React.useState([]);
  const [color, setColor] = React.useState("");
  const [isMyTurn, setIsMyTurn] = React.useState(false);
  const [serverMessage, setServerMessage] = React.useState("");
  const [gameOver, setGameOver] = React.useState(false);

  let diamondSign = "♦";
  let heartSign = "♥";
  let spadesSign = "♠";
  let clubsSign = "♣";


  ws.onmessage = (event) => {
    console.log(`received: ${event.data}`)
    const msg = JSON.parse(event.data)
    if (msg.type===`newboard`){
      setBoard(msg.board)
      setPositionBoard(msg.positionBoard)
      setCards(msg.newdeck)
      setColor(msg.color)
      setIsMyTurn(msg.isTurn)
      setServerMessage(msg.serverMessage)
    }
    else if (msg.type==="validclick"){
      setPositionBoard(msg.positionBoard)
      setCards(msg.newdeck)
      setIsMyTurn(msg.isTurn)
      setServerMessage(msg.serverMessage)
    }
    else if (msg.type==="waiting"){
      setColor(msg.color)
      setServerMessage(msg.serverMessage)
    }
    else if (msg.type==="gamefull"){
      setServerMessage(msg.serverMessage)
    }
    else if (msg.type==="seconddeck"){
      setPositionBoard(msg.positionBoard)
      setCards(msg.newdeck)
      setIsMyTurn(msg.isTurn)
    }
    else if (msg.type==="gameover"){
      setPositionBoard(msg.positionBoard)
      setServerMessage(msg.serverMessage)
      setGameOver(true)
    }
    else if (msg.type==="drawn"){
      setPositionBoard(msg.positionBoard)
      setServerMessage(msg.serverMessage)
      setGameOver(true)
    }
  }

  function getIndexOfJack() {
    for(let i=0; i<cards.length; i++) {
      if(cards[i].slice(10,11) === "j") {
        return i;
      }
    }
    return -1;
  }

  function getRank(element) {
    let rank = element.slice(10,11)
    if (element.slice(11,12) >= "0" && element.slice(11,12) <= "9")
    {
      rank = element.slice(10,12)
    }
    return rank;
  }

  function sendEventToServer(columnnumber, index) {
    if(gameOver) {
      setServerMessage("game over")
      return
    }
    if(isMyTurn === false) {
      setServerMessage("It's not your turn please wait for your turn")
      return
    }

    let jackIndex = getIndexOfJack();
    if(cards.includes(board[columnnumber][index]) || jackIndex != -1) {
      const indexOfCards = cards.indexOf(board[columnnumber][index]);
      let newer = cards
      if (indexOfCards > -1) {
        newer.splice(indexOfCards, 1);
      }
      else {
        newer.splice(jackIndex, 1);
      }
      setCards(newer);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
        type:"validclick",
        columnnumber,
        index,
        color,
        newer
      }))
      }
      
    }
    else
    {
      setServerMessage("Invalid click please try again")
    }
  }

  function getCardType(element) {
    if(element.includes("spades")) {
      return "spades";
    }
    else if (element.includes("diams")) {
      return "diams"
    }
    else if (element.includes("clubs")) {
      return "clubs";
    }
    else {
      return "hearts";
    }
  }

  function getSpan(element, rank) {
    let cardtype = getCardType(element);
    if(cardtype === "spades") {
      return (
        <div className={element}>
            <span className="rank">{rank}</span><span className="suit">♠</span>
        </div>);
    }
    else if(cardtype === "diams") {
      return (
        <div className={element}>
            <span className="rank">{rank}</span><span className="suit">♦</span>
        </div>);
    }
    else if(cardtype === "clubs") {
      return (
        <div className={element}>
            <span className="rank">{rank}</span><span className="suit">♣</span>
        </div>);
    }
    else {
      return (
        <div className={element}>
            <span className="rank">{rank}</span><span className="suit">♥</span>
        </div>);
    }
  }

  function getSpadesCard(element, rank, columnnumber, index) {
    return (
      <div onClick={() => sendEventToServer(columnnumber, index)} >
        <li>
          {getSpan(element, rank)}
        </li>
      </div>
    );
  }

  function getSpanOfMyCards(element, rank) {
    let cardtype = getCardType(element);
    if(cardtype === "spades") {
      return (
      <a className={element}><span className="rank">{rank}</span><span className="suit">♠</span></a>
      );
    }
    else if(cardtype === "diams") {
      return (
      <a className={element}><span className="rank">{rank}</span><span className="suit">♦</span></a>
      );
    }
    else if(cardtype === "clubs") {
      return (
      <a className={element}><span className="rank">{rank}</span><span className="suit">♣</span></a>
      );
    }
    else {
      return (
      <a className={element}><span className="rank">{rank}</span><span className="suit">♥</span></a>
      );
    }
  }

  function getMyCards(element) {
    // let cardtype = getCardType(element);
    let rank = getRank(element);
    return (
      <li>
        {getSpanOfMyCards(element, rank)}
      </li>
    );
  }

  function getColumn(column, columnnumber) {
    return (
      column.map((element, index) => {

        if (positionBoard.length > 1) {
          let classOfCard = positionBoard[columnnumber][index];
          if(classOfCard != "-") {
            return (
          <div onClick={() => sendEventToServer(columnnumber, index)}>
            <li>
              <div className="card">
                <div className={classOfCard}>
                </div>
              </div>
            </li>
          </div>
          )
          }
          
        }
        
        if(element === "card back") {
          return (
            <div>
              <li>
                <div className="card back"><span className="rank"></span></div>
              </li>
            </div>
          );
        }
        else
        {
          let rank = getRank(element);
          return getSpadesCard(element, rank, columnnumber, index)
        }                
      })
    )
  }

  return (
    <div>
      <div className="container">
        {
          board.map((column, columnnumber) => (
            <div>
              <div className="playingCards fourColours rotateHand">
                <ul className="table">
                  {
                    getColumn(column, columnnumber)
                  }
                </ul>
              </div>
            </div>
          ))
        }
      </div>
      <div className="container">
        <div>
          <h1>Your Cards:</h1>
        </div>
        {
          <div className="playingCards fourColours rotateHand">
            <ul className="table">{cards.map((element) => { return getMyCards(element);})}
            </ul>
          </div>
        }
        <div className = "text_box"> {serverMessage} </div>
        <div className = {"color " + color} ></div>
      </div>
    </div>
  );
};

ReactDOM.render(<Sequence />, document.querySelector(`#root`));

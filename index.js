import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square value = {this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

function calculateWinner(square) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]

  for (let i = 0; i < lines.length; i++){
    const [a, b, c] = lines[i];
    if(square[a] && square[a] === square[b] && square[a] === square[c]){
      return square[a];
    }
  }
  return null;
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
          history: [{
            squares: Array(9).fill(null)
          }],
          stepNumber: 0,
          xIsNext: true};
  }

  handleChange(i){
    const hist = this.state.history.slice(0,this.state.stepNumber + 1);
    const curr = hist[this.stepNumber];
    const sq = curr.squares.slice();
    if(sq[i] || calculateWinner(sq)){
      return;
    }
    sq[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({history: hist.concat([{squares: sq}]),
                    stepNumber: hist.length,
                    xIsNext: !this.state.xIsNext});
  }

  jumpTo(move){
    this.setState({stepNumber: move,
                    xIsNext: (move % 2 === 0)
                  });
  }

  render() {
    const hist = this.state.history;
    const curr = hist[hist.length - 1];
    const winner = calculateWinner(curr.squares);

    const moves = hist.map((step,move) =>{
      const desc = move ?
        'Go to move #' + move :
        'Go to Start';
      return(
        <li key = {move}>
          <button onClick={this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }
    else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          {status}
          <Board squares = {curr.squares} onClick = {(i) => this.handleChange(i)} />
        </div>
        <div className="game-info">
          <div></div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        <img src={this.props.element} alt="" style={{ display: this.props.display }} />
      </button>
    );
  }
}

class Board extends React.Component {

  constructor(props) {
    super(props);
    this.totalSquares = this.props.width * this.props.height;
    this.state = {
      squares: [],
      actorLocation: Math.floor(Math.random() * (this.totalSquares - 0) + 0),
      gameInitialized: false,
      moves: 0,
      yMoves: 0,
      xMoves: 0,
      lastMove: '+y'
    };
  }

  componentDidUpdate() {
    setTimeout(() => {
      this.checkForMazes();
    }, 200);
  }

  handleClick(i) {
    if (i === this.state.actorLocation) this.checkForMazes();
  }

  moveY(direction) {
    if (
      direction === '+'
      && (this.state.actorLocation + 1 - this.props.height) > 0
    ) {
      console.log('Moving in +y directions');
      let newSquares = this.state.squares.slice();
      newSquares[this.state.actorLocation] = {
        element: '', display: 'none'
      };
      newSquares[this.state.actorLocation - this.props.height] = {
        element: 'actor.png', display: 'block'
      };

      this.setState(
        {
          gameInitialized: true,
          actorLocation: this.state.actorLocation - this.props.height, squares: newSquares,
          moves: this.state.moves + 1,
          yMoves: this.state.yMoves + 1,
          xMoves: 0,
          lastMove: '+y'
        }
      );
    } else if (
      direction === '-' &&
      (this.state.actorLocation + this.props.height) < this.totalSquares
    ) {
      console.log('Moving in -y direction');
      let newSquares = this.state.squares.slice();
      newSquares[this.state.actorLocation] = {
        element: '', display: 'none'
      };
      newSquares[this.state.actorLocation + this.props.height] = {
        element: 'actor.png', display: 'block'
      };
      this.setState(
        {
          gameInitialized: true,
          actorLocation: this.state.actorLocation + this.props.height,
          squares: newSquares,
          moves: this.state.moves + 1, yMoves: this.state.yMoves + 1, xMoves: 0, lastMove: '-y'
        }
      );
    } else {
      this.state.lastMove === '+y'
        ? this.moveY('-')
        : this.state.lastMove === '-y'
          ? this.moveY('+')
          : this.setState({ lastMove: '+y' });
    }
  }

  moveX(direction) {
    if (
      direction === '+'
      && (this.state.actorLocation + 2) % this.props.width !== 1
      && (this.state.actorLocation + 1) < this.totalSquares
    ) {
      console.log('Moving in +x directions');
      let newSquares = this.state.squares.slice();
      newSquares[this.state.actorLocation] = {
        element: '', display: 'none'
      };
      newSquares[this.state.actorLocation + 1] = {
        element: 'actor.png', display: 'block'
      };
      this.setState(
        {
          gameInitialized: true,
          actorLocation: this.state.actorLocation + 1,
          squares: newSquares,
          moves: this.state.moves + 1,
          xMoves: this.state.xMoves + 1,
          yMoves: 0,
          lastMove: '+x'
        }
      );
    } else if (
      direction === '-'
      && (this.state.actorLocation) % this.props.width !== 0
      && (this.state.actorLocation - 1) >= 0
    ) {
      console.log('Moving in -x direction');
      let newSquares = this.state.squares.slice();
      newSquares[this.state.actorLocation] = {
        element: '', display: 'none'
      };
      newSquares[this.state.actorLocation - 1] = {
        element: 'actor.png', display: 'block'
      };
      this.setState(
        {
          gameInitialized: true,
          actorLocation: this.state.actorLocation - 1,
          squares: newSquares,
          moves: this.state.moves + 1,
          xMoves: this.state.xMoves + 1,
          yMoves: 0,
          lastMove: '-x'
        }
      );
    } else {
      this.state.lastMove === '+x'
        ? this.moveX('-')
        : this.state.lastMove === '-x'
          ? this.moveX('+')
          : this.setState({ lastMove: '+x' });
    }
  }

  getActorRange() {
    let actorLoc = this.state.actorLocation;
    let actorRange = [];
    for (let i = 0; i < this.props.height; i++) {
      if (
        actorLoc >= (i * this.props.width)
        && actorLoc < (i * this.props.width) + this.props.width
      ) {
        actorRange = [
          (i * this.props.width),
          (i * this.props.width) + this.props.width
        ];
      }

    }
    console.log('ActorRange: ', actorRange);
    return actorRange
  }

  numberInRange(x, range) {
    return x >= range[0] && x < range[1];
  }

  decideMove(mazeLocations) {
    console.log('Maze Locations: ', mazeLocations);
    let distance = Math.abs(
      mazeLocations[0] - this.state.actorLocation
    );
    let actorRange = this.getActorRange();
    if (
      distance < this.props.width
      && mazeLocations[0] < this.state.actorLocation
      && this.numberInRange(mazeLocations[0], actorRange)
    ) {
      this.moveX('-');
    } else if (
      distance < this.props.width
      && mazeLocations[0] < this.state.actorLocation
      && !this.numberInRange(mazeLocations[0], actorRange)
    ) {
      this.moveY('+');
    } else if (
      distance < this.props.width
      && mazeLocations[0] > this.state.mazeLocation
      && this.numberInRange(mazeLocations[0], actorRange)
    ) {
      this.moveX('+');
    } else if (
      distance < this.props.width
      && mazeLocations[0] > this.state.actorLocation
      && !this.numberInRange(mazeLocations[0], actorRange)
    ) {
      this.moveY('-');
    } else if (
      distance >= this.props.width
      && mazeLocations[0] < this.state.actorLocation
    ) {
      this.moveY('+');
    } else {
      this.moveY('-');
    }
  }

  checkForMazes() {
    console.log('checking for mazes: ', this.state);
    let mazes = this.state.squares.filter(square => {
      return square.element === 'maze.png';
    });
    console.log('Total mazes: ', mazes);
    if (mazes.length === 0) {
      alert('Game over. Total maze gotten: ' + this.state.moves);
    } else {
      this.decideMove(mazes.map((maze) => maze.value));
    }
  }

  renderSquare(i, element, display) {
    return <Square key={i}
      value={i} element={this.state.squares[i].element} displayElement={this.state.squares[i].display}
      onClick={() => this.handleClick(i)}
    />;
  }

  renderRows(squares) {
    return (
    <div className ="board-row">
     {squares}
    </div>
    );
  }

  renderBoard() {
    let board = [];
    let rows = [];
    for (let i = 0, squareNumber = 0; i < this.props.height; i++) {
      for (let j = 0; j < this.props.width; j++) {
        rows.push(
          this.renderSquare(
            squareNumber
          )
        );
        squareNumber++;
      }
      board.push(this.renderRows(rows));
      rows = [];
    }
    return board;
  }

  render() {
    if (!this.state.gameInitialized) {
      let luckySquares = [];
      for (let i = 0; i < Math.floor(Math.sqrt(this.totalSquares)) + 1; i++) {
        luckySquares.push(
          Math.floor(Math.random() * (this.totalSquares))
        );
      };
      console.log('calculating luck squares: ', luckySquares);
      let squareNumber = 0;
      for (let i = 0; i < this.props.height; i++) {
        for (let j = 0; j < this.props.width; j++) {
          let element = squareNumber === this.state.actorLocation ? "actor.png" : luckySquares.includes(squareNumber) ? "maze.png" : "";
          let display = luckySquares.includes(squareNumber) || squareNumber === this.state.actorLocation ? "block" : "none";
          this.state.squares.push({ element, display, value: squareNumber });
          squareNumber++;
        }
      }
    }
    return (
      <div>
        {this.renderBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  sanitizeInput(input, dimension) {
    let output;
    output = parseInt(input);
    if (Number.isNaN(output)) {
      return {
        valid: false,
        msg: `${input} not valid. 
        Please enter a valid number ${dimension}`
      };
    } else if (output < 0) {
      return {
        valid: false,
        msg: `${input} not valid. 
          Enter a positive number ${dimension}`
      };
    } else {
      return {
        valid: true,
        output
      };
    }

  }
  render() {
    let width = this.sanitizeInput(
      prompt("Please enter board width"),
      'width'
    );
    while (!width.valid) {
      width = this.sanitizeInput(prompt(width.msg), 'width');
    }

    let height = this.sanitizeInput(
      prompt("Please enter board height"),
      'height'
    );
    while (!height.valid) {
      height = this.sanitizeInput(prompt(height.msg), 'height');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board width={width.output} height={height.output} />
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

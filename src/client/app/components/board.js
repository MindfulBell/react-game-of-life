import React, {Component} from 'react';
import Cell from './cell';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'running',
      generations: 0,
      height: 15,
      width: 30,
      speed: 1000,
      board: [],
      boardWidth: 0
    };

    this.buildBoard = this.buildBoard.bind(this);
  }

  componentWillMount(){
    this.buildBoard(this.state.height, this.state.width);
  }

  buildBoard(h,w){
    const boardsize = w * 15 + w * 2; // 15 is px size of each cell (see style), 2 accounts for borders
    const totalCells = h*w;
    const Cells = [];
    let counter = 0;
    for (let i=0; i<h; i++) {
      for (let j=0; j<w; j++) {
        const alive = Math.random() > .7 ? true : false; // .7 gives more dead than alive cells
        Cells.push(
          <Cell key={counter} alive={alive}/> // re config this to push just a 2darray to state, and then map a board after this from that array
          // so this.state.board will change
          )
        counter++
      }
      counter++
    }
    this.setState({height: h, width: w, board: Cells, boardWidth: boardsize})
  }

  render() {
    return (
      <div>
        <div id='ctrl-buttons'>
          <button>Run</button>
          <button>Pause</button>
          <button>Clear</button>
        </div>
        <div>
          Generations: {this.state.generations}
        </div>
        <div id='board' style={{width: this.state.boardWidth}}>
          {this.state.board}
        </div>
        <div id='size-button'>
          <button onClick={(e)=>{this.buildBoard(15,30)}}>15 x 30</button>
          <button onClick={(e)=>{this.buildBoard(25,40)}}>25 x 40</button>
          <button onClick={(e)=>{this.buildBoard(40,60)}}>40 x 60</button>
        </div>
      </div>
    );
  }
}

export default Board;
import React, {Component} from 'react';
import Cell from './cell';

// TO DO: How do I get it to incremenet properly with a timer/setInterval? 
// it works on a click of a button...

// wrap the neighbors of cells on the edge...?

// buttons to run/pause/clear

// draw your pattern instead of click?

// styling


class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'running',
      generations: 0,
      height: 4,
      width: 4,
      speed: 1000,
      board: [],
      boardWidth: 0
    };

    this.buildBoard = this.buildBoard.bind(this);
    this.addCell = this.addCell.bind(this);
    // this.updateBoard = this.updateBoard.bind(this);
    this.generation = this.getNextGeneration.bind(this);
    this.checkNeighbors = this.checkNeighbors.bind(this);

  }

  // board has initial state
  // passed alive/dead to cells randomly
  // cells determine who their neighbors are

  componentWillMount(){
    this.buildBoard(this.state.height, this.state.width);    
  }

  buildBoard(h,w){
    const boardsize = w * 15 + w * 2; // 15 is px size of each cell (see style), 2 accounts for borders
    const totalCells = h*w;
    const Cells = [];
    let counter = -1;
    for (let i=0; i<h; i++) {
      for (let j=0; j<w; j++) {
        counter++
        const alive = Math.random() > .7 ? true : false;
        Cells.push([counter, alive]) //counter used to help determine 'position' for later
          
          /*structure of Board: [
          [#, true],[#, false],[#, false],[#, true]...,
          [#, true],[#, false],[#, false],[#, true]...,
          [#, true],[#, false],[#, false],[#, true]...,
          [#, true],[#, false],[#, false],[#, true]...,
          [#, true],[#, false],[#, false],[#, true]...
          ]*/                 
      }      
    }
    this.setState({height: h, width: w, board: Cells, boardWidth: boardsize})
  }

  addCell(cellPos){
    let newBoard = this.state.board.map((cell, ind)=>{
      return ind === cellPos ? [cell[0], !cell[1]] : cell
    })
    this.setState({
      board: newBoard
    })
  }

  checkNeighbors(arr){
    //check neighbors alive and return how many
    let alive = 0;
    arr.forEach((neighbor)=>{
      alive = neighbor[1] ? alive+1 : alive;
    })
    return alive;
  }  

  // updateBoard(newBoard){
  //   this.setState({
  //     board: newBoard
  //   })
  // }

  getNextGeneration(){
    let newBoard = this.state.board.map((cell,_,arr)=>{
      let neighbors = [];    
      let width = this.state.width;      
      neighbors.push(
        arr[cell[0]-width-1],
        arr[cell[0]-width],
        arr[cell[0]-width+1],
        arr[cell[0]-1],
        arr[cell[0]+1],
        arr[cell[0]+width-1],
        arr[cell[0]+width],
        arr[cell[0]+width+1])      
      neighbors = neighbors.filter((cell)=>{
        return cell !== undefined
    })
      let aliveNeighbors = this.checkNeighbors(neighbors)

      // killing it
      if (cell[1] && (aliveNeighbors < 2 || aliveNeighbors > 3 )) {
        return [cell[0], false]
      }      
      //being reborn
      else if (!cell[1] && aliveNeighbors === 3) {
        return [cell[0], true]
      }
      else {
        return cell
      }
    });  

    

    // let topLft = 0;
    // let topRt = width-1;
    // let botLft = height*width-width;
    // let botRt = height*width-1;
    // let edgeRows = width*(height-1);
    // let edgeCols = (height-1);

    //WRAPPING NEIGHBORS?

    // //corners
    // switch (cell[0]) {
    //   //corner
    //   case topLft:
    //   case topRt:
    //   case botLft:
    //   case botRt:
    //     neighbors.push()
    // }

    // //top row
    // if (cell[0] >= topLft && cell[0] <= topRt) {
    //   neighbors.push(
    //   board[cell[0]+edgeRows-1],
    //   board[cell[0]+edgeRows],
    //   board[cell[0]+edgeRows+1]
    //   )
    // }
    // //bottom row
    // if (cell[0] > botLft && cell[0] < botRt) {
    //   neighbors.push(
    //   board[cell[0]-edgeRows-1],
    //   board[cell[0]-edgeRows],
    //   board[cell[0]-edgeRows+1]
    //   )
    // }
    // //left col
    // if (cell[0]%width === 0) {
    //   neighbors.push(
    //   board[cell[0]+edgeCols-width],
    //   board[cell[0]+edgeCols],
    //   board[cell[0]+edgeCols+width]
    //   )
    // }
    // //right col
    // if ((cell[0]+1)%width === 0){
    //   neighbors.push(
    //   board[cell[0]-edgeCols-width],
    //   board[cell[0]-edgeCols],
    //   board[cell[0]-edgeCols+width]
    //   )
    // }
    //go through each cell to check if alive/dead
    this.setState({board: newBoard})
    return newBoard;
  }

  render() {
    let boardView = this.state.board.map((cell)=>{
      return (
        <Cell 
        position={cell[0]}
        key={cell[0]} 
        alive={cell[1]} 
        addCell={this.addCell}
        />
        )
    })
    return (
      <div>
        <div id='ctrl-buttons'>
          <button onClick={(e)=>{this.getNextGeneration()}}>Run</button>
          <button>Pause</button>
          <button>Clear</button>
        </div>
        <div>
          Generations: {this.state.generations}
        </div>
        <div id='board' style={{width: this.state.boardWidth}}>
          {boardView}
        </div>
        <div id='size-button'>
          <button onClick={(e)=>{this.buildBoard(15,30)}}>15 x 30</button>
          <button onClick={(e)=>{this.buildBoard(25,40)}}>25 x 40</button>
          <button onClick={(e)=>{this.buildBoard(40,60)}}>40 x 60</button>
        </div>
      </div>
    );
  }

  componentDidMount(){
    this.inc = setInterval(this.getNextGeneration, this.state.speed)
  }
}

export default Board;
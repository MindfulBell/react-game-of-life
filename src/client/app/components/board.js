import React, {Component} from 'react';
import Cell from './cell';

// wrap the neighbors of cells on the edge...?

// draw your pattern instead of click?

// styling


class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      running: true,
      generations: 0,
      height: 25,
      width: 40,
      speed: 80,
      board: [],
      boardWidth: 0
    };

    this.buildBoard = this.buildBoard.bind(this);
    this.addCell = this.addCell.bind(this);
    this.getNextGeneration = this.getNextGeneration.bind(this);
    this.checkNeighbors = this.checkNeighbors.bind(this);
    this.handleBtn = this.handleBtn.bind(this);

  }

  // board has initial state
  // passed alive/dead to cells randomly
  // cells determine who their neighbors are

  componentWillMount(){
    this.buildBoard(this.state.height, this.state.width, .7);    
  }

  buildBoard(h, w, ratio){
    const boardsize = w * 15 + w * 2; // 15 is px size of each cell (see style), 2 accounts for borders
    const totalCells = h*w;
    const Cells = [];
    let counter = -1;
    for (let i=0; i<h; i++) {
      for (let j=0; j<w; j++) {
        counter++
        const alive = Math.random() > ratio ? true : false;
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
    this.setState({height: h, width: w, board: Cells, boardWidth: boardsize, generations: 0})
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

  getNextGeneration(){
    let genContinue = false;
    let width = this.state.width;
    let height = this.state.height;
    let topLft = 0;
    let topRt = width-1;
    let botLft = height*width-width;
    let botRt = height*width-1;
    let edgeRows = width*(height-1);
    let edgeCols = (height-1);
    let newBoard = this.state.board.map((cell,_,arr)=>{
      let neighbors = [];    
      neighbors.push(
        arr[cell[0]-width-1],
        arr[cell[0]-width],
        arr[cell[0]-width+1],
        arr[cell[0]-1],
        arr[cell[0]+1],
        arr[cell[0]+width-1],
        arr[cell[0]+width],
        arr[cell[0]+width+1])
      //top row
    if (cell[0] >= topLft && cell[0] <= topRt) {
      neighbors.push(
        arr[cell[0]+edgeRows-1],
        arr[cell[0]+edgeRows],
        arr[cell[0]+edgeRows+1]
        )
    }
      //bot row
    if (cell[0] > botLft && cell[0] < botRt) {
      neighbors.push(
        arr[cell[0]-edgeRows-1],
        arr[cell[0]-edgeRows],
        arr[cell[0]-edgeRows+1]
        )
    }
    //left col
    if (cell[0]%width === 0) {
      neighbors.push(
        arr[cell[0]+edgeCols-width],
        arr[cell[0]+edgeCols],
        arr[cell[0]+edgeCols+width]
        )
    }
    //right col
    if ((cell[0]+1)%width === 0){
      neighbors.push(
        arr[cell[0]-edgeCols-width],
        arr[cell[0]-edgeCols],
        arr[cell[0]-edgeCols+width]
        )
    }
    // corners???
    
      neighbors = neighbors.filter((cell)=>{
        return cell !== undefined
    })
    
      let aliveNeighbors = this.checkNeighbors(neighbors)

      // killing it
      if (cell[1] && (aliveNeighbors < 2 || aliveNeighbors > 3 )) {
        genContinue = true;
        return [cell[0], false]
      }      
      // being reborn
      else if (!cell[1] && aliveNeighbors === 3) {
        genContinue = true;
        return [cell[0], true]
      }
      else {
        return cell
      }
    });
    if (genContinue) {
      this.setState({
      board: newBoard, 
      generations: this.state.generations + 1});
    }
  }
  
  handleBtn(btn){
    switch(btn) {
      case 'Run':
        if (!this.state.running) {
          this.inc = setInterval(this.getNextGeneration, this.state.speed)
          this.setState({running: true})
        }
        break;
      case 'Pause':
        clearInterval(this.inc)
        this.setState({running: false})
        break;
      case 'Clear':
        clearInterval(this.inc)
        this.setState({running: false})
        this.buildBoard(this.state.height, this.state.width, 1)
    }
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
          <button className='btn btn-primary' onClick={(e)=>{this.handleBtn('Run')}}>Run</button>
          <button className='btn btn-primary' onClick={(e)=>{this.handleBtn('Pause')}}>Pause</button>
          <button className='btn btn-danger' onClick={(e)=>{this.handleBtn('Clear')}}>Clear</button>
        </div>
        <div>
          <h4>Generations: {this.state.generations}</h4>
        </div>
        <div id='board' style={{width: this.state.boardWidth}}>
          {boardView}
        </div>
        <div id='size-button'>
          <button className='btn btn-info' onClick={(e)=>{this.buildBoard(15,30)}}>15 x 30</button>
          <button className='btn btn-info' onClick={(e)=>{this.buildBoard(25,40)}}>25 x 40</button>
          <button className='btn btn-info' onClick={(e)=>{this.buildBoard(40,60)}}>40 x 60</button>
        </div>
      </div>
    );
  }
  componentDidMount(){
    if (this.state.running) {
      this.inc = setInterval(this.getNextGeneration, this.state.speed);
    }
  }
}

export default Board;
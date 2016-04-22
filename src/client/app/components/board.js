import React, {Component} from 'react';
import Cell from './cell';

/* CONWAY'S GAME OF LIFE,  INFO HERE: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life 

1. Build initial board in willMount
2. Start interval of getNextGeneration in didMount that is responsible for it functioning
  2a. in getNextGeneration, build arr of neighbors for each cell to determine if it lives/dies     
3. pass alive/dead to individual cell and it changes its style accordingly (background color)

*/


class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      running: true,
      generations: 0,
      height: 30,
      width: 30,
      speed: 80,
      board: [],
      pixelWidth: 0
    };

    // main functions
    this.buildBoard = this.buildBoard.bind(this);
    this.addCell = this.addCell.bind(this);
    this.getNextGeneration = this.getNextGeneration.bind(this);
    this.checkNeighbors = this.checkNeighbors.bind(this);
    this.handleBtn = this.handleBtn.bind(this);

  }

  // build initial board, .8 for more empty than alive
  componentWillMount(){
    this.buildBoard(this.state.height, this.state.width, .8);    
  }

  //build board function
  buildBoard(h, w, ratio){
    const boardsize = w * 15 + w * 2; // 15 is px size of each cell (see style), 2 accounts for borders
    const totalCells = h*w;
    const Cells = [];
    let counter = -1;
    for (let i=0; i<h; i++) {
      for (let j=0; j<w; j++) {
        counter++
        const alive = Math.random() > ratio ? true : false;
        Cells.push([counter, alive]) 
        //counter used to help determine 'position' for later, could use index, but this felt better for dev          
          /*structure of Board: [
          [#, true],[#, false],[#, false],[#, true]...,
          [#, true],[#, false],[#, false],[#, true]...,
          [#, true],[#, false],[#, false],[#, true]...,
          [#, true],[#, false],[#, false],[#, true]...,
          [#, true],[#, false],[#, false],[#, true]...
          ]*/                 
      }      
    }
    this.setState({height: h, width: w, board: Cells, pixelWidth: boardsize, generations: 0})
  }

  //callback for when user clicks on an empty cell (i.e. building their own setup)
  addCell(cellPos){
    let newBoard = this.state.board.map((cell, ind)=>{
      return ind === cellPos ? [cell[0], !cell[1]] : cell
    })
    this.setState({
      board: newBoard
    })
  }
  //check neighbors alive and return how many, used in getNextGeneration
  checkNeighbors(arr){
    let alive = 0;
    arr.forEach((neighbor)=>{
      alive = neighbor[1] ? alive+1 : alive;
    })
    return alive;
  }  

  //probably could be refactored, a lot of variables for just building neighbors
  //I went for an infinite 'wrapping' board, i.e. rightmost col neighbors the leftmost col
  //made it more verbose
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
    
    //filter out any undefineds from above mapping
      neighbors = neighbors.filter((cell)=>{
        return cell !== undefined
    })
    
      let aliveNeighbors = this.checkNeighbors(neighbors)

      // killing the cell (this is Game of Life rule)
      if (cell[1] && (aliveNeighbors < 2 || aliveNeighbors > 3 )) {
        genContinue = true;
        return [cell[0], false]
      }      
      // being reborn (other game of life rule)
      else if (!cell[1] && aliveNeighbors === 3) {
        genContinue = true;
        return [cell[0], true]
      }
      else {
        return cell
      }
    });
    // flag genContinue necessary to stop the generations ticking
    if (genContinue) {
      this.setState({
      board: newBoard, 
      generations: this.state.generations + 1});
    }
  }
  
  //button clicks to pause, clear, get a new random board, and run
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
        break;
      case 'Random':
        this.buildBoard(this.state.height, this.state.width, .8)
        break;
    }
  }

  render() {
    // the actual view built from the state of board, made up of Cell components
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
          <button className='btn btn-primary' onClick={(e)=>{this.handleBtn('Clear')}}>Clear</button>
          <button className='btn btn-warning' onClick={(e)=>{this.handleBtn('Random')}}>
            <i className="fa fa-random" aria-hidden="true"></i>
          </button>
        </div>
        <div>
          <h4>Generations: {this.state.generations}</h4>
        </div>
        <div id='board' style={{width: this.state.pixelWidth}}>
          {boardView}
        </div>
        <div id='size-button'>
          <button className='btn btn-info' onClick={(e)=>{this.buildBoard(15,15)}} 
          style={this.state.height === 15 ? {borderBottom: '6px solid white'}:{}}>15 x 15</button>
          <button className='btn btn-info' onClick={(e)=>{this.buildBoard(30,30)}}
          style={this.state.height === 30 ? {borderBottom: '6px solid white'}:{}}>30 x 30</button>
          <button className='btn btn-info' onClick={(e)=>{this.buildBoard(40,40)}}
          style={this.state.height === 40 ? {borderBottom: '6px solid white'}:{}}>40 x 40</button>
        </div>
      </div>
    );
  }

  //interval initializing
  componentDidMount(){
    if (this.state.running) {
      this.inc = setInterval(this.getNextGeneration, this.state.speed);
    }
  }
}

export default Board;
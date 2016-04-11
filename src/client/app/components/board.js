import React, {Component} from 'react';
import Cell from './cell';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'running',
      height: 10,
      width: 10
    };
  }

  render() {
    //build array of cells here
    const size = this.state.height*this.state.width;
    const Cells = [];
    for (let i=0; i<size; i++) {
      Cells.push(
        <Cell key={i}/>
      )
    }
    return (
      <div id='board'>
        {Cells}
      </div>
    );
  }
}

export default Board;
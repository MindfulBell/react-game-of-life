import React, {Component} from 'react';

class Cell extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(cellPos){
    console.log(cellPos)
    this.props.addCell(cellPos)
  }

  render() {
    return (
      <div id='cell'
      onClick={(e) =>{this.handleClick(this.props.position)}}
      style={this.props.alive ? {backgroundColor: 'orange'}:{}}>
      </div>
    );
  }
}

  export default Cell;
import React, {Component} from 'react';

class Cell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alive: false
    };
  }

  //LifeCycle stuff

  render() {
    return (
      <div id='cell'
      onClick={(e) =>{this.setState({alive: !this.state.alive})}}
      style={this.state.alive ? {backgroundColor: 'orange'}:{}}>
      </div>
    );
  }
}

export default Cell;
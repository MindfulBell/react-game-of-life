import React, {Component} from 'react';

class Cell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alive: this.props.alive
    };
  }

  //LifeCycle stuff
  //background color is the variable that changes based on alive/dead
  //so is that what changes within the lifecycle?
  

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
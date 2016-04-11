import React, {Component} from 'react';
import {render} from 'react-dom';
import Board from './components/board';
require("../public/css/style.scss");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };
  }

  render() {
    return (
      <div>
        <h1> GAME OF LIFE </h1>
        <Board />
      </div>
    );
  }
}

render(
  <App/>, document.getElementById('app'));

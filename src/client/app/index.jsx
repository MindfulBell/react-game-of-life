import React, {Component} from 'react';
import {render} from 'react-dom';
import Board from './components/board';
require('bootstrap/dist/css/bootstrap.css');
import style from '../public/css/style.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };
  }

  render() {
    return (
      <div className='container container-fluid' style={{textAlign: 'center'}}>
        <h1> GAME OF LIFE </h1>
        <Board />
      </div>
    );
  }
}

render(
  <App/>, document.getElementById('app'));

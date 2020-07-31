import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import * as serviceWorker from './serviceWorker';
import { ButtonToolbar, Dropdown, DropdownButton } from 'react-bootstrap'
class Box extends React.Component {
  selectBox = () => {
    this.props.selectBox(this.props.row, this.props.col); 
  }
  render() {
    return(
      <div
        className={this.props.boxClass}
        id={this.props.id}
        onClick={this.selectBox}
      ></div>
    )
  }
}

class Grid extends React.Component {
  render() {
    const width = (this.props.cols * 14); 
    var rowsArr = []; 

    var boxClass = ""; 
    for (var i = 0; i < this.props.rows; i++) {

      for (var j = 0; j < this.props.cols; j++) {
          let boxId = i + "_" + j; 

          boxClass = this.props.gridFull[i][j] ? "box on" : "box off"; 
          rowsArr.push(
              <Box
              boxClass={boxClass}
              key={boxId}
              boxId={boxId}
              row={i}
              col={j}
              selectBox={this.props.selectBox}
              />
          ); 
      }
  }
    return (
      <div className="grid" style={{width: width}}>
        {rowsArr}
      </div>
    )
  }
}

class Buttons extends React.Component {
  
  handleSelect = (evt) => {
    this.props.gridSize(evt); 
  }

  render() {
    return (
      <div className="center">
        <ButtonToolbar>
          <button className="btn btn-default" onClick={this.props.playButton}>
            Play
          </button>
          <button className="btn btn-default" onClick={this.props.pauseButton}>
            Pause
          </button>
          <button className="btn btn-default" onClick={this.props.clear}>
            Clear
          </button>
          <button className="btn btn-default" onClick={this.props.slow}>
            Slow
          </button>
          <button className="btn btn-default" onClick={this.props.fast}>
            Fast
          </button>
          <button className="btn btn-default" onClick={this.props.seed}>
            Random
          </button><br/><br/>
          <DropdownButton
          title="Size"
          id="size-menu"
          onSelect={this.handleSelect}
          >
            <Dropdown.Item eventKey="1">25x25</Dropdown.Item><br/>
            <Dropdown.Item eventKey="2">40x40</Dropdown.Item><br/>
            <Dropdown.Item eventKey="3">50x50</Dropdown.Item>
          </DropdownButton>
        </ButtonToolbar>
      </div>
    )
  }
}

class Main extends React.Component {
  constructor() {
    super(); 
    this.speed = 100; 
    this.rows = 30; 
    this.cols = 50; 
    
    this.state = {
      generation: 0, 
      gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
    }
  }
  selectBox = (row,col) => {
    let gridCopy = arrayClone(this.state.gridFull)
    gridCopy[row][col] = !gridCopy[row][col];
    this.setState({
      gridFull: gridCopy, 
    }) 
  }

  seed = () => {
    let gridCopy = arrayClone(this.state.gridFull)
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (Math.floor(Math.random() * 4) === 1) {
          gridCopy[i][j] = true; 
        }
      }
    }
    this.setState({
      gridFull:gridCopy,
    })
  }

  playButton = () => {
    clearInterval(this.intervalID)
    this.intervalID = setInterval(this.play, this.speed)
  }

// this play function will for the rules of the Game Of Life to set into play
  play = () => {
    let g = this.state.gridFull; 
    let g2 = arrayClone(this.state.gridFull); 
    // I will need to do another nested loops set to check the neighbors of each 
    // current alive cell, I will need to do this with my "double buffer"
    // i will also keep a count of the current number of live neighbors

    for (let i = 0; i < this.rows; i++) {

      for (let j = 0; j < this.cols; j++) {
        let count = 0; 
        if (i > 0) if (g[i-1][j]) count++; 
        if (i > 0 && j > 0) if (g[i-1][j-1]) count++; 
        if (i > 0 && j < this.cols -1) if (g[i-1][j+1]) count++; 
        if (j < this.cols -1) if (g[i][j +1]) count ++;
        if (j > 0) if(g[i][j-1]) count++; 
        if (i < this.rows -1) if (g[i +1][j]) count ++; 
        if (i < this.rows - 1 && j > 0) if (g[i + 1][j -1]) count ++; 
        if (i < this.rows - 1 && this.cols - 1) if (g[i + 1][j + 1]) count++; 
        if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false; 
        if (!g[i][j] && count ===3) g2[i][j] = true; 
      }
    }

    this.setState({
      gridFull: g2, 
      generation: this.state.generation + 1
    })

  }

  pauseButton = () => {
    clearInterval(this.intervalID)
  }

  slow = () => {
    this.speed= 1000; 
    this.playButton();
  }

  fast = () => {
    this.speed = 100; 
    this.playButton(); 
  }

  clear = () => {
    var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false)); 
    this.setState({
      gridFull: grid,
      generation: 0,
    })
  }

  gridSize = (size) => {
    switch (size) {
      case "1":
        this.cols = 25; 
        this.rows = 25; 
      break;
      case "2":
        this.cols = 45; 
        this.rows = 45;
      break; 
      default:
        this.cols = 50; 
        this.rows = 50; 
    }
  }

  componentDidMount() {
    this.seed(); 
    // this.playButton(); // don't turn on until pause button is made 
  }
  render() {
    return (
      <div>
        <h1>The Game of Life</h1><br/>
        <h1>By John Conway</h1>
        <Grid 
        rows={this.rows}
        cols={this.cols}
        gridFull={this.state.gridFull}
        selectBox={this.selectBox}
        />
        <Buttons
        playButton={this.playButton}
        pauseButton={this.pauseButton}
        slow={this.slow}
        fast={this.fast}
        clear={this.clear}
        gridSize={this.gridSize}
        seed={this.seed}
        />
        <h2>Generations: {this.state.generation}</h2><br/>
        <div>
          <h2>Welcome To Conway's Game Of Life</h2>
          <Rules />
        </div>
      </div>
    )
  }
}

class Rules extends React.Component {

  render() {

    return (
      <div className="rules">
        <p>The rules are quite simple, but first an overview. The game of life is a class of discrete model known as Cellular Automaton, CA, and is made up of a grid of cells whose behavior is governed by a simple set of rules</p><br/>
        <p>In the Game Of Life, these rules examine each cell of the grid. For each cell, it counts that cell's eight neighbors (up, down, left, right, and diagonals), and then act on that result</p>
        <ul>
          <li>If the cell is alive and has 2 or 3 neighbors, then it remains alive.</li>
          <li>If the cell is alive and has less than 2 neighbors, that cell dies as if by underpopulation.</li>
          <li>if the cell is alive and has more than 3 neighbors, that cell dies as if by overpopulation.</li>
          <li> If the cell is dead and has exactly 3 neightbors, then it comes to life. Else if remains dead.</li>
        </ul>

        <br/><p>From the following rules above, you can notice the cells create unique patterns as they traverse.</p>
        <br/><p>In this simulation of the Game Of Life, You can toggle cells alive on the grid by clicking on the grids. You can toggle cells dead by clicking on alive cell to terminate. You are also given the option to slow the simulation down or continue on the current speed with fast button. You can also randomly generate cells to be alive by clicking on random. Lastly You can select the size of grid you prefer to use, however you must generate that cell with seeds to see it displayed.</p>
      </div>
    )
  }
}
function arrayClone(arr) {
  return JSON.parse(JSON.stringify(arr))
}

ReactDOM.render(
  <React.StrictMode>
    <Main/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

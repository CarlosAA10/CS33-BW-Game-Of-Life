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
          </button>
          <DropdownButton
          title="Grid Size"
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
        this.cols = 40; 
        this.rows = 40;
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
        <h1>The Game of Life</h1>
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
        <h2>Generations: {this.state.generation}</h2>
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

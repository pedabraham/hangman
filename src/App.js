import React from 'react';
import logo from './logo.svg';
import './App.css';

function Letter(props){
  /*props
    character, char
    components-
      letter
  */
  return(
    <span className="square">
      <div className="char">
        {props.char}
      </div>
      <div className="line">
      </div>
      </span>
  )
}

function Word(props){
  /*props
    word, arry of characters
    components-
      letter
  */
  const palabra = props.word
  const htmlWord = palabra.map((char,i)=>{
    return(
      <Letter char={char} />
    )
  })
  return(
    <div className="Word">
      {htmlWord}
    </div>
  )
}

function Bullet(){

}

function Strikes(props){
  /*
    Components
      Bullet
  */
}

function Textbox(props){

}

class Game extends React.Component{
  /*
    components
      textbox
      strikes
      word
  */
  constructor(props) {
    super(props);

  }
}


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Word word={["m"," ","n","",'s','i','ó','n']}/>
      </header>

    </div>
  );
}

export default App;

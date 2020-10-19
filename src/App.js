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

function Bullet(props){
  /*props
  state- on or off
  */
  const empty = props.valid ? '' : 'empty';

  return(
    <span className={'Bullet ' + (empty)}>
    </span>
  )
}

function Strikes(props){
  /*
  props
    record
  Components
    Bullet
  */
  const html_strike = props.record.map((e,i)=>{
    return(
      <Bullet valid={e}/>
    )
  })
  return(
    <div className="Strikes">
      {html_strike}
    </div>
  )
}

class Textbox extends React.Component{
  /*
  props
  verify letter funtion.
  */
  constructor(props){
    super(props);
    this.state = {
      submitedText:'',
      text:''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event){
    const char = event.target.value;
    if(char.length>1){
      this.setState({text: char[1]});
    }else{
      this.setState({text: char});
    }

  }

  handleSubmit(event){
    event.preventDefault();
    const text = this.state.text;
    this.setState({submitedText:text, text:''})
  }

  render(){
    return(
    <div>
      <form onSubmit={this.handleSubmit}>
        <input
          className="char textbox"
          id="new-char"
          onChange={this.handleChange}
          value={this.state.text}
        />
        <button>
          Verify
        </button>
      </form>
    </div>)
  }
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
        <div>
        <Bullet valid={true}/>
        <Bullet valid={false}/>
        </div>
        <Word word={["m"," ","n","",'s','i','ó','n']}/>
        <Textbox />
      </header>

    </div>
  );
}

export default App;

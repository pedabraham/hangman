import React from 'react';
import logo from './logo.svg';
import './App.css';
import {dictionary} from './words.js'

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
    const text = this.state.text.toLowerCase();
    if (text != '' && text != ' '){
      this.props.check_letter(text)
    }
    this.setState({submitedText:text, text:''})
  }

  render(){
    return(
    <div>
      <form onSubmit={this.handleSubmit}>
        <input
          autoComplete="off"
          autoFocus
          className="char textbox"
          id="new-char"
          onChange={this.handleChange}
          value={this.state.text}
        />
        <button className="Verify">
          Verify
        </button>
      </form>
    </div>)
  }
}

function NewGame(props){
  return (
    <>
      <div className="GameOver">
        {props.message}
      </div>
      <button autoFocus="on" className="New_game" onClick={props.New_game}>
        New game
      </button>
    </>
  )
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
    this.strike_total = 4
    const initWord = this.init_game()
    this.state = {
      strike_record : 0,
      word : initWord,
      rigth_letters: 0,
    }
    this.handle_input = this.handle_input.bind(this)
    this.New_game = this.New_game.bind(this)
  }

  //get word to start game
  init_game(){
    //inizilizar palabra ubicar pocisiones de la letra en la palabra y
    const random_number = Math.round(Math.random()*(dictionary.length-1))
    const word_object = this.word_positions(dictionary[random_number])
    return word_object;
    //inizialiar array de la palbra, con una corecta longitud de espacios vacios
  }

  //
  word_positions(word){
    //iterate over string
    let position = {}
    let array = []
    for (var i = 0; i < word.length; i++) {
      if (position[word[i]] === undefined) {
        position[word[i]] = [];
      }
      position[word[i]].push(i);
      array.push('');
    }
    return ({
      position: position,
      array: array
    })
  }

  //translates the strikes count and strike total to an strike array
  strike_array(){
    let array  = []
    // remaining opportinutys in the game
    const ops = this.strike_total - this.state.strike_record
    for (let i = 0; i < this.strike_total; i++) {
      if (i<ops){
        array.push(true)
      }
      else {
        array.push(false)
      }
    }
    return array
  }

  //updates the state of letter
  handle_input(text){
    const word = this.state.word.position
    let arrayW = this.state.word.array
    const strike_record = this.state.strike_record + 1
    let sum_to_rigth_letters = 0
    if (word.hasOwnProperty(text)) {
      for (var i = 0; i < word[text].length; i++) {
        if (arrayW[word[text][i]]!=text) {
          sum_to_rigth_letters++
        }
        arrayW[word[text][i]]=text
      }
      const rigth_letters = this.state.rigth_letters + sum_to_rigth_letters
      this.setState({
        word: {position:word,array:arrayW},
        rigth_letters: rigth_letters
      })
    }
    else{
      this.setState({strike_record:strike_record})
    }
  }

  //update the word and the strike board
  update_game(){

  New_game(){
    const new_word = this.init_game();
    this.setState({
      word : new_word,
      strike_record: 0,
      rigth_letters: 0
    })
  }

  render(){
    let bottom = <Textbox check_letter={this.handle_input}/>;
    if (this.strike_total<= this.state.strike_record) {
      bottom = <NewGame message="Game Over" New_game={this.New_game}/>
    }
    let arrayWlen = this.state.word.array.length
    if (arrayWlen <= this.state.rigth_letters){
      bottom = <NewGame message="You Win" New_game={this.New_game}/>
    }


    return (
      <>
      <Strikes record={this.strike_array()}/>
      <Word word={this.state.word.array} />
      {bottom}
      </>
    )
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
        <Game />
      </header>

    </div>
  );
}

export default App;

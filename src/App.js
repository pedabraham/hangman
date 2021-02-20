import React from 'react';
//import logo from './logo.svg';
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
    if (text !== '' && text !== ' '){
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
    this.strike_max = 8
    const initWord = this.get_word_data(dictionary[0])
    this.state = {
      strike_count : 0,
      word : initWord,
      rigth_letters: 0,
    }
    this.handle_input = this.handle_input.bind(this)
    this.New_game = this.New_game.bind(this)
  }

  //get word to start game
  fetch_word(){
    //inizilizar palabra ubicar pocisiones de la letra en la palabra y
    //inizialiar array de la palbra, con una corecta longitud de espacios vacios
    fetch('https://guarded-beyond-85157.herokuapp.com')
      .then(response => response.json())
      .then(data => {
        const word_object = this.get_word_data(data.word)
        this.setState({word:word_object})
      })
      .catch((error) => {
        const random_number = Math.round(Math.random()*(dictionary.length-1))
        const word_object = this.get_get_word_data(dictionary[0])
        this.setState({word:word_object})}
      )
  }

  //
  get_word_data(word){
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
      letter_positions: position,
      guessed_letters: array
    })
  }

  //translates the strikes count and strike total to an strike array
  strike_array(){
    let array  = []
    // remaining opportinutys in the game
    const remainingStrikes = this.strike_max - this.state.strike_count
    for (let i = 0; i < this.strike_max; i++) {
      if (i < remainingStrikes){
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
    const letter_positions = this.state.word.letter_positions
    let guessed_letters = this.state.word.guessed_letters
    const strike_count = this.state.strike_count + 1
    let sum_to_rigth_letters = 0
    if (letter_positions.hasOwnProperty(text)) {
      const wasLetterGuessed = guessed_letters.indexOf(text) !== -1
      if (!wasLetterGuessed){
        sum_to_rigth_letters = letter_positions[text].length
        const rigth_letters = this.state.rigth_letters + sum_to_rigth_letters
        this.add_letter_to_word(text)
        this.setState({
          rigth_letters: rigth_letters
        })
      }
    }
    else{
      this.setState({strike_count:strike_count})
    }
  }

  add_letter_to_word(letter){
    const letter_positions = this.state.word.letter_positions
    const guessed_letters = this.state.word.guessed_letters
    const wasLetterGuessed = guessed_letters.indexOf(letter) !== -1
    if (!wasLetterGuessed){
      for(const position of letter_positions[letter]){
        guessed_letters[position] = letter
      }
      this.setState({
        word: {letter_positions:letter_positions, guessed_letters:guessed_letters}
      })
    }
  }

  New_game(){
    this.fetch_word();
    this.setState({
      strike_count: 0,
      rigth_letters: 0
    })
  }

  render(){
    let bottom = <Textbox check_letter={this.handle_input}/>;
    if (this.strike_max<= this.state.strike_count) {
      bottom = <NewGame message="Game Over" New_game={this.New_game}/>
      const letter_positions = this.state.word.letter_positions
      for(const letter in letter_positions){
        this.add_letter_to_word(letter)
      }
    }
    let arrayWlen = this.state.word.guessed_letters.length
    if (arrayWlen <= this.state.rigth_letters){
      bottom = <NewGame message="You Win" New_game={this.New_game}/>
    }


    return (
      <>
      <Strikes record={this.strike_array()}/>
      <Word word={this.state.word.guessed_letters} />
      {bottom}
      </>
    )
  }
}


function App() {
  return (
    <div className="App">
      <header className="App-header">
      <div className="title">Guess the word</div>
        {/*<img src={logo} className="App-logo" alt="logo" />
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
        </a>*/}
        <Game />
      </header>

    </div>
  );
}

export default App;

/* TYPER */
/* global TweenMax */
let playerName = ""
let counter = 60
const TYPER = function () {
  if (TYPER.instance_) {
    return TYPER.instance_
  } 
  TYPER.instance_ = this

  this.WIDTH = window.innerWidth
  this.HEIGHT = window.innerHeight
  this.canvas = null
  this.ctx = null
  document.body.style.background = 'white'

  this.words = []
  this.word = null
  this.wordMinLength = 5
  this.guessedWords = 0
  this.guessedLetters = 0
  this.bonusPoints = 0
  this.consecLetters = 0
  this.penalty = 0
  

  this.size ='140px'
  this.font = 'Courier'
  this.canvas = document.getElementsByTagName('canvas')[0]
  this.ctx = this.canvas.getContext('2d')

  this.init()
}

window.TYPER = TYPER




TYPER.prototype = {
  init: function () {
    // this.canvas = document.getElementsByTagName('canvas')[0]
    // this.ctx = this.canvas.getContext('2d')

    this.canvas.style.width = this.WIDTH + 'px'
    this.canvas.style.height = this.HEIGHT + 'px'

    this.canvas.width = this.WIDTH * 2
    this.canvas.height = this.HEIGHT * 2

    
    this.loadWords()
  },

  loadWords: function () {
    const xmlhttp = new XMLHttpRequest()

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.status === 0)) {
        const response = xmlhttp.responseText
        const wordsFromFile = response.split('\n')

        typer.words = structureArrayByWordLength(wordsFromFile)

        typer.start()
      }
    }

    xmlhttp.open('GET', './lemmad2013.txt', true)
    xmlhttp.send()
  },

  start: function () {
    this.generateWord()
    this.word.Draw()

    window.addEventListener('keypress', this.keyPressed.bind(this))

    window.setInterval(this.loop.bind(this), 1000)
  },

  loop: function () {
    this.word.Draw()
  },
  generateWord: function () {
    const generatedWordLength = this.wordMinLength + parseInt(this.guessedWords / 5)
    const randomIndex = (Math.random() * (this.words[generatedWordLength].length - 1)).toFixed()
    const wordFromArray = this.words[generatedWordLength][randomIndex]

    this.word = new Word(wordFromArray, this.canvas, this.ctx)
  },

  keyPressed: function (event) {
      const letter = String.fromCharCode(event.which)
      if (letter === this.word.left.charAt(0)) {
        this.guessedLetters += 1
        this.consecLetters += 1
        if (this.consecLetters === 10) {
          this.consecLetters = 0
          this.bonusPoints += 10
        }
        let animElement = document.getElementsByClassName('wordCanvas')
        TweenMax.staggerFrom(animElement, 0.3, {
          scale: 0.8
        })
        TweenMax.staggerTo(animElement, 0.3, {
          scale: 1.0
        })
        this.word.removeFirstLetter()

        if (this.word.left.length === 0) {
          this.guessedWords += 1
          this.generateWord()
          let animElement = document.getElementsByClassName('wordCanvas')
          TweenMax.staggerFrom(animElement, 0.2, {
            opacity: 0,
            scale: 0
          })
          TweenMax.staggerTo(animElement, 0.2, {
            opacity: 1,
            scale: 1
          })
        }
        this.word.Draw()
      } else {
        this.penalty += 2
        this.consecLetters = 0
        let currentBg = document.body.style.backgroundColor
        console.log(currentBg)
        let animElement = document.getElementsByClassName('wordCanvas')
        TweenMax.staggerFrom(animElement, 0.3, {
          backgroundColor: 'red'
        })
        TweenMax.staggerTo(animElement, 0.3, {
          backgroundColor: currentBg
        })
        console.log('Wrong letter pressed')
      }
      this.score = this.guessedLetters + this.bonusPoints + this.guessedWords * 10 - this.penalty
      document.getElementById('score').innerHTML ="SCORE: " + this.score
    }

}

/* WORD */
const Word = function (word, canvas, ctx) {
  this.word = word
  this.left = this.word
  this.canvas = canvas
  this.ctx = ctx
}

Word.prototype = {
  Draw: function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.textAlign = 'center'
    this.ctx.font = typer.size +" "+ typer.font
    
    this.ctx.fillText(this.left, this.canvas.width / 2, this.canvas.height / 2)

    /* drawing the counter
    this.ctx.textAlign = 'left'
    this.ctx.font = '40px Arial'
    this.ctx.fillText(typer.counter, 100, 500)
    */
  },

  removeFirstLetter: function () {
    this.left = this.left.slice(1)
  }
}

/* HELPERS */
function structureArrayByWordLength (words) {
  let tempArray = []

  for (let i = 0; i < words.length; i++) {
    const wordLength = words[i].length
    if (tempArray[wordLength] === undefined) tempArray[wordLength] = []

    tempArray[wordLength].push(words[i])
  }

  return tempArray
}

// Skoori salvestamise ja timeri funktsioonid, tuleb mingi "start game"
// trigger teha millega need tööle hakkaksid(nt. siis kui mängija nime sisestanud või mängu peale vajutab menüüs)

/*
function storeScore (name, score) {
  if (window.localStorage.length === 0) {
    let tempArray = []
    let player = [name, score]
    tempArray.push(player)
    localStorage.setItem('tempArray', JSON.stringify(tempArray))
  } else {
    let storage = JSON.parse(localStorage.getItem('tempArray'))
    let newPlayer = [name, score]
    storage.push(newPlayer)
    localStorage.setItem('tempArray', JSON.stringify(storage))
  }
}

let seconds = 0
function timer () {
  ++seconds
  document.getElementById('timer').innerHTML = seconds
}
*/

function nightMode() {
  if (document.querySelector('#nightMode').checked) {
    document.body.style.background = 'SlateGray'
    console.log('night on')
  } else {
    document.body.style.background = 'white'
    console.log('night off')
  }
}



function FontChange() {
  document.getElementById("customButton").addEventListener("click", function(){
    typer.font=document.getElementById("FontChange").value
    typer.size=document.getElementById("SizeChange").value
  })


  console.log()
}

function timerPlayer(){
  document.getElementById("playerSubmit").addEventListener("click", function () {
    
    playerName = document.getElementById("playerName").value
    document.getElementById("replaceName").innerHTML = playerName
    window.location.hash = 'game'
    gameStart()
  })
}

function gameStart(){
  window.addEventListener('hashchange', function(){
    if(window.location.hash === '#game'){
      const typer = new TYPER()
      window.typer = typer
      i = setInterval(function() {
        if(counter != 0 && playerName != ""){
          counter -= 1
        }else if(counter == 0){
          gameEnd()
        }
        document.getElementById('timer').innerHTML = "Time remaining: " + counter
        },1000)
    }else{
      document.getElementById('timer').innerHTML = "Return to game!"
      clearInterval(i)
    }
  })
}

function gameEnd(){
  alert("Game over!\nYou scored " + typer.score + " points")
  window.location.hash = 'stats'

  // reset all variables for new game
  typer.wordMinLength = 5
  typer.guessedWords = 0
  typer.guessedLetters = 0
  typer.bonusPoints = 0
  typer.consecLetters = 0
  typer.penalty = 0
  typer.score = 0
  counter = 60

}

window.onload = function () {
  timerPlayer()
  FontChange()
}

let rankArray = [2,3,4,5,6,7,8,9,10, 'J', 'Q', 'K', 'A']
let suitArray = ['hearts', 'diamonds', 'spades', 'clubs']
let deck = []
let playerCardArray = []
let playerCardDivArray = []

let stack1Array = []
let stack2Array = []
let stack3Array = []
let stack4Array = []
let stack5Array = []
let stack6Array = []
let stack7Array = []

let stack1DivArray = []
let stack2DivArray = []
let stack3DivArray = []
let stack4DivArray = []
let stack5DivArray = []
let stack6DivArray = []
let stack7DivArray = []

let drawnCardsArray = []
let drawnCardsDivArray = []
let drawnCount = 0

const stacks = [stack1Array, stack2Array, stack3Array, stack4Array, stack5Array, stack6Array, stack7Array]
const stackDivs=  [stack1DivArray, stack2DivArray, stack3DivArray, stack4DivArray, stack5DivArray, stack6DivArray, stack7DivArray]

let cardCount = 0
let dealCount = 0
let playerTotal = 0
let dealerTotal = 0
let totalChips = 0
let currentBet = 0
let cardIndex = 1000

let dragTarget
let dropSpot = ''


let playerLose

let clickable = false
let playerTurn = true

const boardWidth = 252
const cardWidth = boardWidth/7
const cardHeight = (cardWidth/2) + cardWidth

const board = document.getElementById('board')
const deckDiv = document.getElementById('deck')
const playerPlaceHolder = deckDiv.querySelector('.cardPlaceHolder')
const userInterface = document.getElementById('userInterface')

const drawnCard = document.getElementById('drawnCard')
const drawBtn = document.getElementById('drawBtn')


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function turnNotification(msgText, parent, acceptText, rejectText, colorData) {
  const messageDiv = document.createElement('div')
  messageDiv.classList.add('turnMessage')
  messageDiv.style.borderColor = colorData;
  messageDiv.style.opacity = 0
  const messageText = document.createElement('p')
  messageText.textContent = msgText
  messageText.classList.add('turnMessageText')
  messageDiv.appendChild(messageText)

  const btnDiv = document.createElement('div')
  btnDiv.setAttribute('class', 'btnDiv')

  if (totalChips > 0) {
    const acceptBtn = document.createElement('button')
    acceptBtn.classList.add('matchButton')
    acceptBtn.innerHTML = `${acceptText} &#10004;`
    acceptBtn.addEventListener('click', (e) => {
      fadeOut(messageDiv, 200, position, position - 20, true)
      newTurn()
    })
    btnDiv.appendChild(acceptBtn)
  }

  const closeBtn = document.createElement('button')
  closeBtn.classList.add('matchButton')
  closeBtn.innerHTML = `${rejectText} &#10006;`
  btnDiv.appendChild(closeBtn)
  
  messageDiv.appendChild(btnDiv)

  parent.appendChild(messageDiv)


  closeBtn.addEventListener('click', (e) => {
    fadeOut(messageDiv, 200, position, position - 20, true)
    reset()

    setTimeout(() => {
      userInterface.style.opacity = 0
      chipsDiv.style.opacity = 0;
      playerScore.style.opacity = 0;
      dealerScore.style.opacity = 0;
    
      showHide(userInterface)
      showHide(chipsDiv)
      showHide(playerScore)
      showHide(dealerScore)
      startGameButton()
    },200)
    
  })

  const position = getComputedStyle(messageDiv).bottom.replace('px', '')

  setTimeout(() => {
    fadeIn(messageDiv, .05, 20)
    slideIn(messageDiv, position - 20, position, 'bottom', 1)
  },1000)

}


function notification(msg, parent, colorData, speed) {
  const messageDiv = document.createElement('div')
  messageDiv.classList.add('message')
  messageDiv.style.opacity = 0
  messageDiv.style.borderColor = colorData
  const messageText = document.createElement('p')
  messageText.textContent = msg
  messageText.classList.add('messageText')
  messageDiv.appendChild(messageText)
  parent.appendChild(messageDiv)

  fadeIn(messageDiv, .05, 20)
  slideIn(messageDiv, 0, 5, 'bottom', 1)
  fadeOut(messageDiv, speed, 5, -10, true)
}


function removeAllMessages() {
  document.querySelectorAll('.message').forEach(elem => {
    fadeOut(elem, 0, 20, 0, true)
  })
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function slideIn(elem, startPosition, endPosition, direction, increment) {
  let position = startPosition
  let directionOption = direction.toString()
  let slideI = setInterval(() => {
    position += increment //1
    elem.style[directionOption] = `${position}px`
    if (position == endPosition) {
      clearInterval(slideI)
    }
  }, 20)
}



function fadeIn(elem, increment, interval) {
  let opacity = 0
  let fadeI = setInterval(() => {
    opacity += increment//.05
    elem.style.opacity = opacity
    if (elem.style.opacity >= 1) {
      clearInterval(fadeI)
    } 
  }, interval) //20
}

function fadeInMultiple(array, increment, interval) {
  let opacity = 0
  let fadeI = setInterval(() => {
    opacity += increment//.05
    for (const elem of array) {elem.style.opacity = opacity}
    if (opacity >= 1) {
      clearInterval(fadeI)
    } 
  }, interval) //20
}

function fadeOut(elem, speed, startPosition, endPosition, bool) {
  setTimeout(() => {
    let opacity = 1
    let bottom = startPosition
    
    let fadeO = setInterval(() => {
      opacity -= .05
      elem.style.opacity = opacity

      if (bottom >= endPosition) {
        bottom -= 1
        elem.style.bottom = `${bottom}px`
      }

      if (elem.style.opacity <= 0) {
        if (bool === true) {
          elem.remove()
        }
        clearInterval(fadeO)
      } 
    }, 20)
  }, speed)
}



function fadeOutMultiple(array, speed, startPosition, endPosition, bool) {
  setTimeout(() => {
    let opacity = 1
    let bottom = startPosition
    
    let fadeO = setInterval(() => {
      opacity -= .05

      for (const elem of array) {
      elem.style.opacity = opacity
      }

      if (bottom >= endPosition) {
        bottom -= 1
        for (const elem of array) {
          elem.style.bottom = `${bottom}px`
          }
      }

      if (opacity <= 0) {
        if (bool === true) {
          for (const elem of array) {
            elem.remove()
          }
        }
        clearInterval(fadeO)
      } 
    }, 20)
  }, speed)
}

function flashingButton(btn) {
  if (btn.classList.contains('flash')) {
    btn.classList.remove('flash')
  }
  else {
    btn.classList.add('flash')
  }
}

function flashingButton2(btn) {
  if (btn.classList.contains('flash2')) {
    btn.classList.remove('flash2')
  }
  else {
    btn.classList.add('flash1')
  }
}

function flashingButton3(btn) {
  if (btn.classList.contains('flash3')) {
    btn.classList.remove('flash3')
  }
  else {
    btn.classList.add('flash3')
  }
}

function flashingButton4(btn) {
  if (btn.classList.contains('flash4')) {
    btn.classList.remove('flash4')
  }
  else {
    btn.classList.add('flash4')
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function showHide(elem) {
  if (elem.classList.contains('show')) {
    elem.classList.remove('show')
    elem.classList.add('hide')
  }
  else {
    elem.classList.remove('hide')
    elem.classList.add('show')
  }
}

function createDeck() {
  for (const suit of suitArray) {
    for (const rank of rankArray) {
      deck.push({
        rank: rank,
        suit: suit
      })
    }
  }
  console.log(deck)
}

function removeFromDeck(elem, array) {
  array.splice(array.indexOf(elem), 1)

}

function chooseRandomCard(array) {
  let randomIndex = Math.floor(Math.random() * array.length)
  return randomIndex
}

function changeCardLabel(textData, colorData, cardLabelsArray) {
  cardLabelsArray.forEach(label => {
    label.innerHTML = textData;
    label.style.color = colorData;
  })
}

function loadCardRank(deckArray, cardDiv, cardArray) {
  const cardLabels = cardDiv.querySelectorAll('.cardLabel')
  if (deck.length > 0) {
    let randomCard = deckArray[chooseRandomCard(deckArray)]
    cardDiv.setAttribute('id', `${randomCard.rank}of${randomCard.suit}`)
    switch(randomCard.suit) {
      case 'spades':
      changeCardLabel(`${randomCard.rank}&#9824`, 'black', cardLabels);
        break;
      case 'clubs':
        changeCardLabel(`${randomCard.rank}&#9827;`, 'black', cardLabels);
        break;
      case 'hearts':
        changeCardLabel(`${randomCard.rank}&#9829;`, 'red', cardLabels);
        break;
      case 'diamonds':
        changeCardLabel(`${randomCard.rank}&#9830;`, 'red', cardLabels);
        break;
    }
    cardArray.push(randomCard)
    removeFromDeck(randomCard, deckArray)
  }
  else {
    switch(drawnCardsArray[drawnCount].suit) {
      case 'spades':
      changeCardLabel(`${drawnCardsArray[drawnCount].rank}&#9824`, 'black', cardLabels);
        break;
      case 'clubs':
        changeCardLabel(`${drawnCardsArray[drawnCount].rank}&#9827;`, 'black', cardLabels);
        break;
      case 'hearts':
        changeCardLabel(`${drawnCardsArray[drawnCount].rank}&#9829;`, 'red', cardLabels);
        break;
      case 'diamonds':
        changeCardLabel(`${drawnCardsArray[drawnCount].rank}&#9830;`, 'red', cardLabels);
        break;
    }
    drawnCount++
    console.log(drawnCardsArray)
    if (drawnCount >= drawnCardsArray.length) {
      drawnCount = 0
    }
    console.log(drawnCount)
  }
}

function createCardLabel(className, frontDiv, labelFrame) {
  const labelDiv = document.createElement('div')
  const label = document.createElement('p')
  label.classList.add('cardLabel')
  labelDiv.classList.add('labelDiv')
  labelDiv.classList.add(className)
  labelDiv.appendChild(label)
  labelFrame.appendChild(labelDiv)
  frontDiv.appendChild(labelFrame)
}

function createCard(deckArray, width, height, parent, cardArray, cardDivArray) {
  const card = document.createElement('div');
  card.classList.add('card');

  const frontOfCard = document.createElement('div')
  frontOfCard.classList.add('frontCard')
  frontOfCard.classList.add('hide')
  const labelFrame = document.createElement('div')
  labelFrame.classList.add('labelFrame')

  if (width > 40) {
    createCardLabel('top', frontOfCard, labelFrame)
    createCardLabel('center', frontOfCard, labelFrame)
    createCardLabel('bottom', frontOfCard, labelFrame)
  }
  else {
    createCardLabel('top', frontOfCard, labelFrame)
    createCardLabel('bottom', frontOfCard, labelFrame)
  }
  
  const backOfCard = document.createElement('div')
  backOfCard.classList.add('backCard')
  backOfCard.classList.add('show')

  frontOfCard.style.width = `${width}px`;
  frontOfCard.style.height = `${height}px`;
  backOfCard.style.width = `${width}px`;
  backOfCard.style.height = `${height}px`;
  card.classList.add(`c${cardCount}`)
  card.appendChild(frontOfCard)
  card.appendChild(backOfCard)
  
  cardCount++

  cardIndex++
  const cardDiv = document.createElement('div')
  cardDiv.style.zIndex = cardIndex
  cardDiv.classList.add('cardDiv')
  cardDiv.style.opacity = 0
  cardDiv.appendChild(card)
  parent.appendChild(cardDiv)
  cardDivArray.push(card)

  loadCardRank(deckArray, card, cardArray)
  
  return cardDiv
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addCardFlip(card, front, back) {
  card.classList.remove('animate')
  void card.offsetWidth;
  void card.offsetHeight;
  
  if (front.classList.contains('hide')) {
    front.classList.add('rotated')
    //loadCardRank(array, card) random card on flip
    //console.log('add rotate !')
  }
  else { 
    front.classList.remove('rotated')
    //console.log('remove rotate !')
  }

  card.classList.add('animate')
  setTimeout(() => {
      showHide(front)
      showHide(back)
   }, 500)

   setTimeout(() => {
    card.classList.remove('animate')
    front.classList.remove('rotated')
  }, 1000)

   
}


function positionCardsLeft(cardDivArray, i) {
  let cardSpace
  if (i < 4 ){
    cardDivArray.forEach(elem => {
      let endPosition1 = (((boardWidth/2) - (cardWidth * Number(`1.${cardDivArray.length + 2}`))) + ((cardWidth) * cardDivArray.indexOf(elem)))
      slideIn(elem.parentNode, endPosition1 + 5, endPosition1, 'left', -1)
    })
  }
  else {
    cardSpace = boardWidth/ cardDivArray.length
    cardDivArray.forEach(elem => {
      elem.style.width = `${cardSpace}px`
      elem.style.height = `${(cardSpace/2) + cardSpace}px`
      let endPosition = ((cardSpace) * cardDivArray.indexOf(elem))
      slideIn(elem.parentNode, endPosition + 5, endPosition, 'left', -1)
      const labels = elem.querySelectorAll('.cardLabel')
      labels.forEach(label => label.style.fontSize = '1.5cqb')
    })
  }
}


function positionCardsBottom(cardDivArray, i) {
  cardDivArray.forEach(elem => {
    if (i > 0) {
      //let position = getComputedStyle(elem.parentNode).left.replace('px', '')   
      let endPosition1 = (cardHeight/2 * cardDivArray.indexOf(elem))
      slideIn(elem.parentNode, endPosition1 + 5, endPosition1, 'top', -1)
    }
    else {
      let endPosition1 = 0
      slideIn(elem.parentNode, endPosition1 + 1, endPosition1, 'top', -1)
    }
  })
}

function positionCard(cardDiv, cardDivArray) {
    let endPosition1 = (cardHeight/2 * cardDivArray.indexOf(cardDiv))
    slideIn(cardDiv, endPosition1 + 5, endPosition1, 'top', -1)
}


function dealCards(numberOfCards, cardNumber, parent, cardArray, cardDivArray, flipBool) {
  numberOfCards += dealCount
  for (let i = cardNumber; i < numberOfCards; i++) {
    dealCount++
    const newCard = createCard(deck, cardWidth,cardHeight, parent, cardArray, cardDivArray)
    setTimeout(() => {
      fadeIn(newCard, .05, 20)
      positionCardsBottom(cardDivArray, i)
    }, 100)
    
    setTimeout(() => {
      if (flipBool) {
        addCardFlip(newCard, newCard.querySelector('.frontCard'), newCard.querySelector('.backCard'))
      }
    }, 100)

    setTimeout(() => {
      createDraggable(newCard, cardArray, cardDivArray, i)
    }, 1099)
  
  }
}

function dealSolitaire() {
  setTimeout(() => {
    for (let i = 1; i <= 7; i++) {
      for (let x = 0; x < i; x++) {
        if (x < i - 1) {
          dealCards(1, x, document.getElementById(`stack${i}`), stacks[i-1], stackDivs[i-1], false);
        }
        else {
          dealCards(1, x, document.getElementById(`stack${i}`), stacks[i-1], stackDivs[i-1], true);
        }
      }
      dealCount = 0
    }
  }, 10)

}


function deal() {

  if (drawnCard.querySelector('.cardDiv') != undefined) {
    fadeOut(drawnCard.querySelector('.cardDiv'),1 ,0 , 1, true)
  }

  setTimeout(() => {
    dealCount = 0
    dealCards(1, 0, drawnCard, drawnCardsArray, drawnCardsDivArray, true)
    console.log(deck.length)
  }, 100)
}


function preventDrop() {
  let cards = document.querySelectorAll('.cardDiv')
  cards.forEach(elem => {
    elem.addEventListener('dragover', (e) => {
      e.preventDefault()
    })
  })  
}

function createDropSpot() {
  let dropSpots = document.querySelectorAll('.cardStack')
  console.log(dropSpots)
  dropSpots.forEach(elem => {
      elem.addEventListener('dragenter', (e) => {
        if (!e.target.classList.contains('cardStack')) {
          dropSpot = e.target.parentNode
          dropSpot.classList.add('flash4')
          console.log(dropSpot)
        }
        else{
            dropSpot = e.target
            dropSpot.classList.add('flash4')
            console.log(dropSpot)
        }
        elem.addEventListener('dragleave', (e) => {
          if (e.target != dropSpot && e.target.parentNode != dropSpot) {
            e.target.classList.remove('flash4')
            console.log(dropSpot)
          }
        })
      })
      
  })
}


function getStackArray(parent, elem, elemDiv) {
    switch(parent.id) {
      case 'stack1':
        stack1Array.push(elem);
        stack1DivArray.push(elemDiv);
        positionCard(elemDiv, stack1DivArray)
        console.log(stack1Array)
        console.log(stack1DivArray)
        break;
      case 'stack2':
        stack2Array.push(elem);
        stack2DivArray.push(elemDiv);
        positionCard(elemDiv, stack2DivArray)
        console.log(stack2Array)
        console.log(stack2DivArray)
        break;
      case 'stack3':
        stack3Array.push(elem);
        stack3DivArray.push(elemDiv);
        positionCard(elemDiv, stack3DivArray)
        console.log(stack3Array)
        console.log(stack3DivArray)
        break;
      case 'stack4':
        stack4Array.push(elem);
        stack4DivArray.push(elemDiv);
        positionCard(elemDiv, stack4DivArray)
        console.log(stack4Array)
        console.log(stack4DivArray)
        break;
      case 'stack5':
        stack5Array.push(elem);
        stack5DivArray.push(elemDiv);
        positionCard(elemDiv, stack5DivArray)
        console.log(stack5Array)
        console.log(stack5DivArray)
        break;
      case 'stack6':
        stack6Array.push(elem);
        stack6DivArray.push(elemDiv);
        positionCard(elemDiv, stack6DivArray)
        console.log(stack6Array)
        console.log(stack6DivArray)
        break;
      case 'stack7':
        stack7Array.push(elem);
        stack7DivArray.push(elemDiv);
        positionCard(elemDiv, stack7DivArray)
        console.log(stack7Array)
        console.log(stack7DivArray)
        break; 
    }
}

function flipNextCard(cardDivArray, i) {
  let nextCard = cardDivArray[i-1]
  if (nextCard != undefined) {
    if (nextCard.querySelector('.frontCard').classList.contains('hide')) {
      addCardFlip(nextCard,nextCard.querySelector('.frontCard'), nextCard.querySelector('.backCard') )
    }
  }
}
  


function createDraggable(elem, cardArray, cardDivArray, i ) {
  elem.setAttribute('draggable', true)
  elem.addEventListener('dragstart', (e) => {
    dragTarget = e.target
    dragTarget.querySelector('.card').style.boxShadow = 'none'
  })

  elem.addEventListener('dragend', (e) => {
    if (dropSpot != e.target.parentNode && dropSpot != '') {
        cardIndex++
        e.target.style.zIndex = cardIndex
        e.target.parentNode.removeChild(e.target)
        dropSpot.appendChild(e.target)
        getStackArray(dropSpot,cardArray[i], e.target)

        console.log(cardDivArray[i-1])
        flipNextCard(cardDivArray, i)
        cardArray.splice(cardArray[i])
        console.log(cardArray)

        cardDivArray.splice(cardDivArray.indexOf())

        e.target.querySelector('.card').style.boxShadow =  '-2px -2px 10px 0px rgba(0,0,0,0.75)';
        dropSpot.classList.remove('flash4')
        dragTarget  = ''
        dropSpot = ''
    }   
  })
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function convertFaceCard(elem, handValue) {
  if (typeof(elem.rank) === 'string' ) {
    switch(elem.rank) {
      case "K":
      case "Q":
      case "J":
        handValue += 10;
        break;
      case "A":
        if (handValue >= 12) {
          handValue += 1;
        }
        else {
          handValue += 11
        }
        break;
    }
  }
  else {
    handValue += elem.rank
  }
  //console.log(handValue)
  return handValue 
}


function countCardValues(array) {
  let handValue = 0
  array.forEach(item => {
    if (item.rank == 'A') {
      array.splice(array.indexOf(item), 1)
      array.push(item)
    }
  })
  array.forEach(elem => {
    handValue = convertFaceCard(elem, handValue)
  })
  return handValue
}



function returnTotal() {
  playerTotal = countCardValues(playerCardArray)
  dealerTotal = countCardValues(dealerCardArray)
  updateScoreDiv()
}


function startGame() {
  reset()
  createDeck()
  playerTurn = true
  createDropSpot()

  setTimeout(() => {
    dealSolitaire()
    showHide(userInterface)
    fadeInMultiple([userInterface], .05, 20)
    
  }, 100)

  setTimeout(() => {
    drawBtn.classList.add('flash4')
    console.log(stacks)
    console.log(stackDivs)
  }, 1200)

}

function startGameButton() {
  const startGameBtn = document.createElement('button')
  startGameBtn.classList.add('startGame')
  startGameBtn.innerHTML = 'Start New Game?'
  document.body.appendChild(startGameBtn)
  playerTurn = false

  startGameBtn.addEventListener('click', (e) => {
    startGame()
    startGameBtn.remove()
  })

}



function reset() {
  deck = []
  playerCardArray = []
  playerCardDivArray = []
  cardCount = 0
  dealCount = 0
  playerTotal = 0
  dealerTotal = 0
  clickable = false
  currentBet = 0
  cardIndex = 1000;

  
  const cardTemp = document.querySelector('.cardDiv')
  if (cardTemp != undefined) {
    const position = getComputedStyle(cardTemp).bottom.replace('px', '')
    fadeOutMultiple(document.querySelectorAll('.cardDiv'), 200, position, position - 50, true)
  }

  document.querySelectorAll('.turnMessage').forEach(elem => {
    elem.remove()
  })

  document.querySelectorAll('.message').forEach(elem => {
    elem.remove()
  })
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function turnHoleCard() {
  const holeCard = dealer.querySelector('.cardDiv') 
  if (holeCard.querySelector('.frontCard').classList.contains('hide')) {
    setTimeout(() => {
      addCardFlip(holeCard, holeCard.querySelector('.frontCard'), holeCard.querySelector('.backCard'))
    }, 200)
  }
}


function dealerTurn() {
  clickable = false
  dealCount = 2
  turnHoleCard()
  playerTurn = false;
  flashingButton4(hit)
  flashingButton4(hold)
  //hit.style.pointerEvents = 'none'
  //hold.style.pointerEvents = 'none'
  

  setTimeout(() => {
    let dealerMove = setInterval(() => {
      returnTotal()
      returnBoolChecks()
      if (checkDealer17(countCardValues(dealerCardArray)) == false) {
        if (dealerBlackJack == false && dealerLose == false) { 
          dealCards(1, dealCount, dealer, dealerCardArray, dealerCardDivArray, true);
          returnTotal()
          returnBoolChecks()
        }
      }
      else {     
        checkWinner()
        createNotifications(dealer, dealerBlackJack, dealerLose, dealerTotal)
        clearInterval(dealerMove)
      }
    }, 350)
    
  }, 700)
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

drawBtn.addEventListener('click', (e) => {
  if (playerTurn == true){
    deal()
  }
})

window.addEventListener('load', (e) => {
  startGameButton()
}) 




// heart = &#9829
// diamond = &#9830
// spade = &#9824
// club = &#9827 !!


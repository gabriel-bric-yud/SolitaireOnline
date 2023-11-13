//////////////////////  GLOBAL CONSTANTS  //////////////////////


const rankArray = ['A','2','3','4','5','6','7','8','9','10', 'J', 'Q', 'K']
const suitArray = ['hearts', 'diamonds', 'spades', 'clubs']

const boardWidth = 252
const cardWidth = boardWidth/7
const cardHeight = (cardWidth/2) + cardWidth

const board = document.getElementById('board')
const deckDiv = document.getElementById('deck')
const tableau = document.querySelector('#tableau')
const foundationDiv = document.querySelector('#foundation')
const playerPlaceHolder = deckDiv.querySelector('.cardPlaceHolder')
const drawnCard = document.getElementById('drawnCard')
const drawBtn = document.getElementById('drawBtn')
const resetButton = document.getElementById('reset')


//////////////////////  GLOBAL VARIABLES  //////////////////////


let deck = []

let stack1 = []
let stack2 = []
let stack3 = []
let stack4 = []
let stack5 = []
let stack6 = []
let stack7 = []

let stack1Divs = []
let stack2Divs = []
let stack3Divs = []
let stack4Divs = []
let stack5Divs = []
let stack6Divs = []
let stack7Divs = []

let foundationClubs = []
let foundationDiamonds = []
let foundationHearts = []
let foundationSpades = []

let foundationClubsDivs = []
let foundationDiamondsDivs = []
let foundationHeartsDivs = []
let foundationSpadesDivs = []

let currentDrawnCards = []
let drawnCards = []
let drawnCardDivs = []

let allStacksArray = [stack1, stack2, stack3, stack4, stack5, stack6, stack7]
let allStackDivsArray=  [stack1Divs, stack2Divs, stack3Divs, stack4Divs, stack5Divs, stack6Divs, stack7Divs]

let cardCount = 0
let cardIndex = 1000
let currentIndex
let drawnCount = 0
let dealCount = 0

let clicked = false
let clickable = false
let playerTurn = true
let extraCards = false

let offSet
let dragTarget
let dropSpot = ''
let dropSpotArray
let foundationSpot = ''
let foundationSpotArray 
let targetTop
let targetRight


//////////////////////  NOTIFICATION FUNCTIONS //////////////////////


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

    const acceptBtn = document.createElement('button')
    acceptBtn.classList.add('matchButton')
    acceptBtn.innerHTML = `${acceptText} &#10004;`
    acceptBtn.addEventListener('click', (e) => {
      fadeOut(messageDiv, 200, position, position - 20, true)
      reset()
      startGame()
    })
    btnDiv.appendChild(acceptBtn)


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
      startGameButton()
    },200)
    
  })

  const position = getComputedStyle(messageDiv).bottom.replace('px', '')

  setTimeout(() => {
    fadeIn(messageDiv, .05, 20)
    slideIn(messageDiv, position - 20, position, 'bottom', 1)
  },300)

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


//////////////////////  SLIDE AND FADE ANIMATION FUNCTIONS  //////////////////////

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


//////////////////////  CREATING DECK AND CARDS FUNCTIONS  //////////////////////


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

function topCardShadow(array, parent) {
  array = parent.querySelectorAll('.cardDiv')
  array.forEach(element => {
    element.querySelector('.card').classList.add('noShadow')
    if (array[array.length-1] == element) {
      element.querySelector('.card').classList.remove('noShadow')
    }
  })
}

function loadCardRank(deckArray, cardDiv, cardArray, cardDivArray) {
  const cardLabels = cardDiv.querySelectorAll('.cardLabel')
  if (deck.length > 0) {
    let randomCard = deckArray[chooseRandomCard(deckArray)]
    cardDiv.setAttribute('id', `${randomCard.rank}of${randomCard.suit}`)
    cardDiv.dataset.rank = randomCard.rank
    cardDiv.dataset.suit = randomCard.suit
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
    cardDivArray.push(cardDiv)
    removeFromDeck(randomCard, deckArray)
  }
  else {
    cardDiv.setAttribute('id', `${drawnCards[drawnCount].rank}of${drawnCards[drawnCount].suit}`)
    cardDiv.dataset.rank = drawnCards[drawnCount].rank
    cardDiv.dataset.suit = drawnCards[drawnCount].suit
    drawnCards.splice(drawnCount, 1, {rank: drawnCards[drawnCount].rank, suit: drawnCards[drawnCount].suit })
    drawnCardDivs.splice(drawnCount, 1, cardDiv)
    switch(drawnCards[drawnCount].suit) {
      case 'spades':
        changeCardLabel(`${drawnCards[drawnCount].rank}&#9824`, 'black', cardLabels);
        break;
      case 'clubs':
        changeCardLabel(`${drawnCards[drawnCount].rank}&#9827;`, 'black', cardLabels);
        break;
      case 'hearts':
        changeCardLabel(`${drawnCards[drawnCount].rank}&#9829;`, 'red', cardLabels);
        break;
      case 'diamonds':
        changeCardLabel(`${drawnCards[drawnCount].rank}&#9830;`, 'red', cardLabels);
        break;
    }
    
    
    drawnCount++

    if (drawnCount >= drawnCards.length) {
      drawnCount = 0
    }
    console.log(drawnCount)
  }
  currentDrawnCards = drawnCard.querySelectorAll('.cardDiv')
  topCardShadow(currentDrawnCards, drawnCard)
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
  
  const labelFrame = document.createElement('div')
  labelFrame.classList.add('labelFrame')

  createCardLabel('top', frontOfCard, labelFrame)
  createCardLabel('bottom', frontOfCard, labelFrame)
  
  const backOfCard = document.createElement('div')
  

  //frontOfCard.style.width = `${width}px`;
  //frontOfCard.style.height = `${height}px`;
  //backOfCard.style.width = `${width}px`;
  //backOfCard.style.height = `${height}px`;
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
  frontOfCard.classList.add('frontCard')
  frontOfCard.classList.add('hide')
  backOfCard.classList.add('backCard')
  backOfCard.classList.add('show')
  cardDiv.style.pointerEvents = 'none'
  parent.appendChild(cardDiv)

  loadCardRank(deckArray, card, cardArray, cardDivArray)
  
  return cardDiv
}


//////////////////////  POSITION AND FLIP CARD FUNCTIONS  //////////////////////


function addCardFlip(card, front, back) {
  card.parentNode.style.pointerEvents = 'all'
  card.classList.contains('flip') ? card.classList.remove('flip') :  card.classList.add('flip')
  setTimeout(() => {
    showHide(front)
    showHide(back)
  }, 300) 
}



function flipNextCard(cardDivArray, i) {
  let nextCard = cardDivArray[i-1]
  if (nextCard != undefined) {
    if (nextCard.querySelector('.frontCard').classList.contains('hide')) {
      addCardFlip(nextCard,nextCard.querySelector('.frontCard'), nextCard.querySelector('.backCard') )
    }
  }
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
      let endPosition1 = (cardHeight/1.6 * cardDivArray.indexOf(elem))
      slideIn(elem.parentNode, endPosition1 + 150, endPosition1, 'top', -10)
    }
    else {
      let endPosition1 = 0
      slideIn(elem.parentNode, endPosition1 + 150, endPosition1, 'top', -10)
    }
  })
}


function positionCard(cardDiv, cardDivArray) {
    let endPosition1 = (cardHeight/1.6 * cardDivArray.indexOf(cardDiv.querySelector('.card')))
    slideIn(cardDiv, endPosition1 + .1, endPosition1, 'top', -.1)
}



//////////////////////  DEAL CARDS FUNCTIONS  //////////////////////


function dealCards(numberOfCards, cardNumber, parent, cardArray, cardDivArray, flipBool) {
  numberOfCards += dealCount
  let newCard
  for (let i = cardNumber; i < numberOfCards; i++) {
    dealCount++
    newCard = createCard(deck, cardWidth,cardHeight, parent, cardArray, cardDivArray)
    setTimeout(() => {
      fadeIn(newCard, .05, 20)
      if (parent == drawnCard ) {
        slideIn(newCard, 50, 0, 'right', -2.5)
      }
      else {
        positionCardsBottom(cardDivArray, i)
      }
    }, 200)

    if (flipBool)  {
        if (drawnCards.length == 1 || (deck.length == 0 && drawnCount == 1)) {
          addCardFlip(newCard.querySelector('.card'), newCard.querySelector('.frontCard'), newCard.querySelector('.backCard'))
        }
        else {
          setTimeout(() => {
            addCardFlip(newCard.querySelector('.card'), newCard.querySelector('.frontCard'), newCard.querySelector('.backCard'))
          }, 300)           
        }
      }

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
          dealCards(1, x, document.getElementById(`stack${i}`), allStacksArray[i-1], allStackDivsArray[i-1], false);
        }
        else {
          dealCards(1, x, document.getElementById(`stack${i}`), allStacksArray[i-1], allStackDivsArray[i-1], true);
        }
      }
      dealCount = 0
    }
  }, 10)
}


function deal() { 
  console.log(deck.length)
  console.log(drawnCount)
  if (deck.length > 0) {
    setTimeout(() => {
      dealCount = 0
      dealCards(1, 0, drawnCard, drawnCards, drawnCardDivs, true)
      console.log(deck.length)
    }, 100)  
  }
  else if (deck.length == 0 && drawnCount == 0) {
    currentDrawnCards = drawnCard.querySelectorAll('.cardDiv')
    if (drawnCard.querySelector('.cardDiv') != undefined) {
      fadeOutMultiple(currentDrawnCards, 1 , 0, 1, true)
    }
    setTimeout(() => {
      dealCount = 0
      dealCards(1, 0, drawnCard, drawnCards, drawnCardDivs, true)
      console.log(drawnCardDivs)
    }, 100)

  }
  else {
    setTimeout(() => {
      dealCount = 0
      dealCards(1, 0, drawnCard, drawnCards, drawnCardDivs, true)
      console.log(drawnCardDivs)
    }, 100)
  }
}


//////////////////////  GAME LOGIC + CHECK STACKS AND ARRAY MANIPULATION FUNCTIONS   //////////////////////


function checkStackOrder(card, array) {
  let dragRank = card.rank
  let dragSuit = card.suit
  let dropRank
  let dropSuit
  //console.log(array)
  //console.log(`dragRank is ${dragRank}`)
  //console.log(`dragSuit is ${dragSuit}`)
  

  if (array.length > 0) {
    dropRank = array[array.length - 1].rank
    dropSuit = array[array.length - 1].suit
    //console.log(`drop rank is ${dropRank}`)
    //console.log(`drop suit is ${dropSuit}`)
  }

  if (dragRank == 'K') {
    if (array.length == 0) {
      return true
    }
    else {
      return false
    }
  }
  else if (rankArray[rankArray.indexOf(dragRank) + 1] == rankArray[rankArray.indexOf(dropRank)]) {
    switch(dragSuit) {
      case 'hearts':
      case 'diamonds':
        if (dropSuit == 'spades' || dropSuit == 'clubs') {
          return true
        }
        else {
          return false
        }
        break;
      case 'spades':
      case 'clubs':
        if (dropSuit == 'hearts' || dropSuit == 'diamonds') {
          return true
        }
        else {
          return false
        }
        break;
    }
  }
  else {
    return false
  }
}


function checkFoundationOrder(card, array, suit, current) {
  let dragRank = card.rank
  let dragSuit = card.suit
  let dropRank
  let foundationSuit = suit
  //console.log(array)
  //console.log(`dragRank is ${dragRank}`)
  //console.log(`dropSuit is${dragSuit}`)
  if (array.length > 0) {
    dropRank = array[array.length - 1].rank
    dropSuit = array[array.length - 1].suit
    console.log(`dropRank is ${dropRank}`)
    console.log(`dropSuit is ${dropSuit}`)
  }

  if (dragSuit == foundationSuit) {
    if (dragRank == 'A') {
      if (array.length == 0) {
        return true
      }
      else {
        return false
      }
    }

    else if (rankArray[rankArray.indexOf(dragRank) - 1] == rankArray[rankArray.indexOf(dropRank)]) {
      return true
    }

    else {
      return false
    }

  }
  else {
    return false
  }
}

function getRankAndSuit(elemDiv) {
  let elemId = elemDiv.querySelector('.card').id
  let rankSuit = elemId.split('of')
  return {
    rank: rankSuit[0],
    suit: rankSuit[1]
  }
}


function removeFromStackArray(elem, elemDiv, cardArray, cardDivArray) {
  console.log(elemDiv)
  console.log(elemDiv.dataset.stack)
  if (elemDiv.dataset.stack == undefined) {
    cardArray.splice(cardArray.indexOf(elem), 1);
    cardDivArray.splice(cardDivArray.indexOf(elemDiv), 1);
    if (cardDivArray == drawnCardDivs) {
      drawnCount--
      console.log(`drawncount minus 1 = ${drawnCount}`)
      if (drawnCount < 0) {
        drawnCount = 0;
      }
    }
  }
  else {
    switch(elemDiv.dataset.stack) {
      case '1':
        stack1.splice(stack1.indexOf(elem), 1);
        stack1Divs.splice(stack1Divs.indexOf(elemDiv), 1);
        break;
      case '2':
        stack2.splice(stack2.indexOf(elem), 1);
        stack2Divs.splice(stack2Divs.indexOf(elemDiv), 1);
        break;
      case '3':
        stack3.splice(stack3.indexOf(elem), 1);
        stack3Divs.splice(stack3Divs.indexOf(elemDiv), 1);
        break;
      case '4':
        stack4.splice(stack4.indexOf(elem), 1);
        stack4Divs.splice(stack4Divs.indexOf(elemDiv), 1);
        break;
      case '5':
        stack5.splice(stack5.indexOf(elem), 1);
        stack5Divs.splice(stack5Divs.indexOf(elemDiv), 1);
        break;
      case '6':
        stack6.splice(stack6.indexOf(elem), 1);
        stack6Divs.splice(stack6Divs.indexOf(elemDiv), 1);
        break;
      case '7':
        stack7.splice(stack7.indexOf(elem), 1);
        stack7Divs.splice(stack7Divs.indexOf(elemDiv), 1);
        break;
      case 'clubs':
        foundationClubs.splice(foundationClubs.indexOf(elem), 1);
        foundationClubsDivs.splice(foundationClubsDivs.indexOf(elemDiv), 1);
        break;
      case 'diamonds':
        foundationDiamonds.splice(foundationDiamonds.indexOf(elem), 1);
        foundationDiamondsDivs.splice(foundationDiamondsDivs.indexOf(elemDiv), 1);
        break;
      case 'hearts':
        foundationHearts.splice(foundationHearts.indexOf(elem), 1);
        foundationHeartsDivs.splice(foundationHeartsDivs.indexOf(elemDiv), 1);
        break;
      case 'spades':
        foundationSpades.splice(foundationSpades.indexOf(elem), 1);
        foundationSpadesDivs.splice(foundationSpadesDivs.indexOf(elemDiv), 1);
        break;
        
      case 'drawnCard':
        drawnCards.splice(drawnCards.indexOf(elem), 1);
        drawnCardDivs.splice(drawnCardDivs.indexOf(elemDiv), 1);
        drawnCount--
        console.log(`drawncount minus 1 = ${drawnCount}`)
        if (drawnCount < 0) {
          drawnCount = 0;
        }
        break;
    }
  }
}

function changeArrays(elem, elemDiv, stackArray, stackDivArray, num) {
  elemDiv.dataset.stack = num
  elemDiv.style.removeProperty('right')
  stackArray.push(elem);
  stackDivArray.push(elemDiv.querySelector('.card'));
  console.log('new arrays: ')
    console.log(stackArray)
    console.log(stackDivArray)
  if (typeof num == 'number') {
    positionCard(elemDiv, stackDivArray)
  }
  else {
    elemDiv.style.removeProperty('top')
  }
  
}

function getCurrentArray(elemDiv, cardArray, cardDivArray) {
    console.log('current arrays: ')
    console.log(cardArray)
    console.log(cardDivArray)
    switch(elemDiv.dataset.stack) {
      case '1':
        return [stack1, stack1Divs]
        break;
      case '2':
        return [stack2, stack2Divs]
        break;
      case '3':
        return [stack3, stack3Divs]
        break;
      case '4':
        return [stack4, stack4Divs]
        break;
      case '5':
        return [stack5, stack5Divs]
        break;
      case '6':
        return [stack6, stack6Divs]
        break;
      case '7':
        return [stack7, stack7Divs]
        break;
      case 'clubs':
        return [foundationClubs, foundationClubsDivs]
        break;
      case 'diamonds':
        return [foundationDiamonds, foundationDiamondsDivs]
        break; 
      case 'hearts':
        return [foundationHearts, foundationHeartsDivs]
        break;
      case 'spades':
        return [foundationSpades, foundationSpadesDivs]
        break;
      case 'drawnCard':
        return [drawnCards, drawnCardDivs]
        break;
      case undefined:
        return [cardArray, cardDivArray]
        break;
    }
}


function getCurrentArray2(elemDiv) {
  switch(elemDiv.parentNode.id) {
    case 'stack1':
      return [stack1, stack1Divs]
      break;
    case 'stack2':
      return [stack2, stack2Divs]
      break;
    case 'stack3':
      return [stack3, stack3Divs]
      break;
    case 'stack4':
      return [stack4, stack4Divs]
      break;
    case 'stack5':
      return [stack5, stack5Divs]
      break;
    case 'stack6':
      return [stack6, stack6Divs]
      break;
    case 'stack7':
      return [stack7, stack7Divs]
      break;
    case 'clubs':
      return [foundationClubs, foundationClubsDivs]
      break;
    case 'diamonds':
      return [foundationDiamonds, foundationDiamondsDivs]
      break; 
    case 'hearts':
      return [foundationHearts, foundationHeartsDivs]
      break;
    case 'spades':
      return [foundationSpades, foundationSpadesDivs]
      break;
    case 'drawnCard':
      return [drawnCards, drawnCardDivs]
      break;
    case undefined:
      return [cardArray, cardDivArray]
      break;
  }
}


function moveCards(elem, elemDiv, parent, cardArray, divArray, newCardArray, newDivArray, num) { 
  let card
  let cardDiv
  let moveArray = []
  let moveDivArray = []


  if (divArray == drawnCardDivs) {
    card = cardArray[divArray.indexOf(elemDiv.querySelector('.card'))]
    cardDiv = divArray[divArray.indexOf(elemDiv.querySelector('.card'))]
    moveArray.push(cardArray[divArray.indexOf(elemDiv.querySelector('.card'))])
    moveDivArray.push(divArray[divArray.indexOf(elemDiv.querySelector('.card'))])
  }
  else {
    for (let i = divArray.indexOf(elemDiv.querySelector('.card')); i < divArray.length; i++) {
      card = cardArray[i]
      cardDiv = divArray[i]
      moveArray.push(cardArray[i])
      moveDivArray.push(divArray[i])
    }
  }
    for (let y = moveDivArray.indexOf(elemDiv.querySelector('.card')); y < moveDivArray.length; y++) {
      console.log(moveArray)
      setTimeout(() => {
        card = moveArray[y]
        console.log(card)
        cardDiv = moveDivArray[y]
        console.log(cardDiv)
        removeFromStackArray(card, cardDiv, cardArray, divArray)
        changeArrays(card, cardDiv.parentNode, newCardArray, newDivArray, num)
        cardIndex++
        cardDiv.parentNode.style.zIndex = cardIndex
        cardDiv.parentNode.style.opacity = 0
        parent.appendChild(cardDiv.parentNode)
        fadeIn(cardDiv.parentNode, .05, 10)
        checkWin() 
      }, 100)
    }


  dropSpot = ''
}

function getNewStackArray(parent, elemDiv, cardArray, cardDivArray ) {
  let elem = getRankAndSuit(elemDiv)
  let currentArray = getCurrentArray(elemDiv, cardArray, cardDivArray)[0]
  let currentDivArray = getCurrentArray(elemDiv, cardArray, cardDivArray)[1]
  let currentLength = currentDivArray.length - 1
  switch(parent.id) {
    case 'stack1':
      if (checkStackOrder(elem, stack1)) {
        moveCards(elem, elemDiv, parent, currentArray, currentDivArray, stack1, stack1Divs, 1)
        console.log('stack1')
        return true
      }
      else {
        return false
      }
      break;
    case 'stack2':
      if (checkStackOrder(elem, stack2)) {
        moveCards(elem, elemDiv, parent, currentArray, currentDivArray, stack2, stack2Divs, 2)
        console.log('stack2')
        return true
      }
      else {
        return false
      }
      break;
    case 'stack3':
      if (checkStackOrder(elem, stack3)) {
        moveCards(elem, elemDiv, parent, currentArray, currentDivArray, stack3, stack3Divs, 3)
        console.log('stack3')
        return true
      }
      else {
        return false
      }
      break;
    case 'stack4':
      if (checkStackOrder(elem, stack4)) {
        moveCards(elem, elemDiv, parent, currentArray, currentDivArray, stack4, stack4Divs, 4)
        console.log('stack4')
        return true
      }
      else {
        return false
      }
      break;
    case 'stack5':
      if (checkStackOrder(elem, stack5)) {
        moveCards(elem, elemDiv, parent, currentArray, currentDivArray, stack5, stack5Divs, 5)
        console.log('stack5')
        return true
      }
      else {
        return false
      }
      break;
    case 'stack6':
      if (checkStackOrder(elem, stack6)) {
        moveCards(elem, elemDiv, parent, currentArray, currentDivArray, stack6, stack6Divs, 6)
        console.log('stack6')
        return true
      }
      else {
        return false
      }
      break;
    case 'stack7':
      if (checkStackOrder(elem, stack7)) {
        moveCards(elem, elemDiv, parent, currentArray, currentDivArray, stack7, stack7Divs, 7)
        console.log('stack7')
        return true
      }
      else {
        return false
      }
      break; 
    case 'clubs':
      if (checkFoundationOrder(elem, foundationClubs, 'clubs', currentArray)) {
        if (currentDivArray.indexOf(elemDiv.querySelector('.card')) == currentLength || elemDiv.parentNode == drawnCard) {
          moveCards(elem, elemDiv, parent, currentArray, currentDivArray, foundationClubs, foundationClubsDivs, 'clubs')
          topCardShadow(parent.querySelectorAll('.cardDiv'), parent)
          console.log('clubStack')
          return true
        }
        else {
          return false
        }
      }
      else {
        return false
      }
      break; 
    case 'diamonds':
      if (checkFoundationOrder(elem, foundationDiamonds, 'diamonds', currentArray)) {
        if (currentDivArray.indexOf(elemDiv.querySelector('.card')) == currentLength || elemDiv.parentNode == drawnCard) {
          moveCards(elem, elemDiv, parent, currentArray, currentDivArray, foundationDiamonds, foundationDiamondsDivs, 'diamonds')
          topCardShadow(parent.querySelectorAll('.cardDiv'), parent)
          console.log('diamondStack')
          return true
        }
        else {
          return false
        }
      }
      else {
        return false
      }
      break; 
    case 'hearts':
      if (checkFoundationOrder(elem, foundationHearts, 'hearts', currentArray)) {
        if (currentDivArray.indexOf(elemDiv.querySelector('.card')) == currentLength || elemDiv.parentNode == drawnCard) {
          moveCards(elem, elemDiv, parent, currentArray, currentDivArray, foundationHearts, foundationHeartsDivs, 'hearts')
          topCardShadow(parent.querySelectorAll('.cardDiv'), parent)
          console.log('clubHearts')
          return true
        }
        else {
          return false
        }
      }
      else {
        return false
      }
      break; 

    case 'spades':
      if (checkFoundationOrder(elem, foundationSpades, 'spades', currentArray)) {
        if (currentDivArray.indexOf(elemDiv.querySelector('.card')) == currentLength || elemDiv.parentNode == drawnCard) {
          moveCards(elem, elemDiv, parent, currentArray, currentDivArray, foundationSpades, foundationSpadesDivs, 'spades')
          topCardShadow(parent.querySelectorAll('.cardDiv'), parent)
          console.log('clubSpades')
          return true
        }
        else {
          return false
        }
      }
      else {
        return false
      }
      break; 
  }
}




function checkWin() {
  let foundationArrays = [foundationClubs, foundationDiamonds, foundationHearts, foundationSpades]
  //console.log(foundationArrays[0])
  //console.log(foundationArrays[1])
  //console.log(foundationArrays[2])
  //console.log(foundationArrays[3])
  if (foundationArrays[0].length == 13 && foundationArrays[1].length == 13 && foundationArrays[2].length == 13 && foundationArrays[3].length == 13) {
    turnNotification(`You Win! Congratulations!`, tableau, 'Play Again', 'Reset')
    return true
  }
  else {
    return false
  }
}


//////////////////////  DRAG AND DROP FUNCTIONALITY (TOUCH INCLUDED)  //////////////////////


function checkDropTouch(target, touchCoord, container) {
  if (touchCoord.x <= container.getBoundingClientRect().x + container.getBoundingClientRect().width && touchCoord.x >= container.getBoundingClientRect().x) {
    
    if ((touchCoord.y >= container.getBoundingClientRect().y) && (touchCoord.y <= container.getBoundingClientRect().y + container.getBoundingClientRect().height)) {
      dropSpot = container
      return true
    }
  }
  else {
    return false
  }
}


function checkFlashTouch(target, touchCoord, container) {
  if (touchCoord.x <= container.getBoundingClientRect().x + container.getBoundingClientRect().width && touchCoord.x >= container.getBoundingClientRect().x) {
    if ((touchCoord.y >= container.getBoundingClientRect().y) && (touchCoord.y <= container.getBoundingClientRect().y + container.getBoundingClientRect().height)) { 
      if (!(container.classList.contains('flash'))) {
        document.querySelectorAll('.stack').forEach(item => {
          item.classList.remove('flash')
        })
        dropSpot = container
        container.classList.add('flash')
      }
      
    }
  }
}


function createDropSpot() {
  dropSpotArray = document.querySelectorAll('.cardStack')
  dropSpotArray.forEach(elem => {
    elem.addEventListener('dragenter', (e) => {
      if (!e.target.classList.contains('cardStack')) {
        foundationSpotArray.forEach(elem => {elem.classList.remove('flash4')})
        dropSpotArray.forEach(elem => {elem.classList.remove('flash4')})
        dropSpot = e.target.parentNode
        dropSpot.classList.add('flash4')
      }
      else{        
          foundationSpotArray.forEach(elem => {elem.classList.remove('flash4')})
          dropSpotArray.forEach(elem => {elem.classList.remove('flash4')})
          dropSpot = e.target
          dropSpot.classList.add('flash4')
      }
      elem.addEventListener('dragleave', (e) => {  
        if (e.target != dropSpot && e.target.parentNode != dropSpot) {
          e.target.classList.remove('flash4')
          e.target.parentNode.classList.remove('flash4')
        }
      })
    }) 
  })

  foundationSpotArray = document.querySelectorAll('.foundationSpot')
  foundationSpotArray.forEach(elem => {
    elem.addEventListener('dragenter', (e) => {
      if (!e.target.classList.contains('foundationSpot')) {
        dropSpotArray.forEach(elem => {elem.classList.remove('flash4')})
        foundationSpotArray.forEach(elem => {elem.classList.remove('flash4')})
        dropSpot = e.target.parentNode
        dropSpot.classList.add('flash4')
      }
      else {  
        dropSpotArray.forEach(elem => {elem.classList.remove('flash4')})
        foundationSpotArray.forEach(elem => {elem.classList.remove('flash4')})
        dropSpot = e.target
        dropSpot.classList.add('flash4')
      }
      elem.addEventListener('dragleave', (e) => {  
        if (e.target != foundationSpot && e.target.parentNode != foundationSpot) {
          e.target.classList.remove('flash4')
          e.target.parentNode.classList.remove('flash4')
        }
      })
    }) 
  })
}


function createDraggable(elem, cardArray, cardDivArray, i ) {
  elem.setAttribute('draggable', true)
  elem.addEventListener('dragstart', (e) => {
    dragTarget = e.target
    e.target.querySelector('.card').classList.add('noShadow')
  })

  elem.addEventListener('dragend', (e) => {
    if (dropSpot != e.target.parentNode && dropSpot != '') {
      console.log(e.target.querySelector('.card'))
      if (getNewStackArray(dropSpot, e.target, cardArray, cardDivArray)) {
        flipNextCard(cardDivArray, i)
        topCardShadow(currentDrawnCards, drawnCard)
      }
    }
    e.target.querySelector('.card').classList.remove('noShadow')
    dropSpotArray.forEach(elem => {elem.classList.remove('flash4')})
    foundationSpotArray.forEach(elem => {elem.classList.remove('flash4')})
    dragTarget  = ''
  })


  elem.addEventListener('touchstart', (e) => {
    e.preventDefault()
    if (e.touches.length > 1) {  
      e.preventDefault();
    }
    if (!clicked) {
      dragTarget = e.target;
      currentStack = dragTarget.parentNode  
      currentIndex = dragTarget.style.zIndex
      dragTarget.style.zIndex = 9999
      targetTop = dragTarget.style.top
      targetRight = dragTarget.style.right 
      dragTarget.style.removeProperty('left')
      dragTarget.style.removeProperty('top')
      dragTarget.style.removeProperty('right')

      dragTarget.querySelector('.frontCard').classList.add('bigger')
      console.log(window.screenY)
      console.log(window.screenTop)
      //offSet = [dragTarget.offsetLeft - e.touches[0].clientX, dragTarget.offsetTop - e.touches[0].clientY]  //#offSet in cardStack
      //dragTarget.style.left = e.touches[0].clientX - (dragTarget.offsetWidth/2) + 'px'
      //dragTarget.style.top = e.touches[0].clientY  - (dragTarget.offsetHeight/2) + 'px'
  
      dragTarget.style.left = (e.touches[0].clientX) - (dragTarget.offsetWidth/2) + window.scrollX + 'px'
      dragTarget.style.top = (e.touches[0].clientY) - (dragTarget.offsetHeight/1.2) + window.scrollY + 'px'
      document.body.appendChild(dragTarget)
    
      offSet = [dragTarget.offsetLeft - e.touches[0].clientX, dragTarget.offsetTop - e.touches[0].clientY]
      
      clicked = true 
    
    }
    /**
    if (!clicked) {
      dragTarget = e.target;
      currentIndex = dragTarget.style.zIndex
      dragTarget.style.zIndex = 9999
      targetTop = dragTarget.style.top
      targetRight = dragTarget.style.right
      dragTarget.style.removeProperty('right')
      console.log(targetTop)
      offSet = [dragTarget.offsetLeft - e.touches[0].clientX, dragTarget.offsetTop - e.touches[0].clientY]
      clicked = true 
    }
    */
    console.log('offset is:')
    console.log(offSet)
    console.log('dragTarget is:')
    console.log(dragTarget)
  }, { passive: false})

  elem.addEventListener('touchend', (e) => { 
    clicked = false;
    currentTouch = {
        x : e.changedTouches[0].clientX,
        y : e.changedTouches[0].clientY
    };
    console.log(currentTouch)
    dragTarget.querySelector('.frontCard').classList.remove('bigger')

    foundationSpotArray.forEach(spot => {
      if (checkDropTouch(dragTarget, currentTouch, spot)) {
        if (dropSpot != dragTarget.parentNode && dropSpot != '') {
          if (getNewStackArray(dropSpot, dragTarget, cardArray, cardDivArray)) {
            dragTarget.style.opacity = 0
            dragTarget.parentNode.removeChild(dragTarget)
            dragTarget.style.zIndex = cardIndex
            spot.appendChild(dragTarget)
            flipNextCard(cardDivArray, i)
            topCardShadow(currentDrawnCards, drawnCard)
            console.log('foundation spot')
            
          }   
        }
      }
      else {
        currentStack.appendChild(dragTarget)
        dragTarget.style.removeProperty('left')
        dragTarget.style.right = targetRight
        dragTarget.style.top = targetTop
        dragTarget.style.zIndex = currentIndex
        
      } 
    })

    dropSpotArray.forEach(spot => {
      if (checkDropTouch(dragTarget, currentTouch, spot)) {
        if (getNewStackArray(dropSpot, dragTarget, cardArray, cardDivArray)) {
          dragTarget.style.opacity = 0
          dragTarget.parentNode.removeChild(dragTarget)
          dragTarget.style.zIndex = cardIndex
          spot.appendChild(dragTarget)
          flipNextCard(cardDivArray, i)
          topCardShadow(currentDrawnCards, drawnCard)
          console.log('cardSpot')
        }
      }
      else {
        currentStack.appendChild(dragTarget)
        dragTarget.style.removeProperty('left')
        dragTarget.style.right = targetRight
        dragTarget.style.top = targetTop
        dragTarget.style.zIndex = currentIndex
      } 
    })
    console.log('dropspot is:')
    console.log(dropSpot)
    dragTarget = "";
    dropSpot = ''
    document.querySelectorAll('.stack').forEach(item => {
      item.classList.remove('flash')
    })
  }) 
}

document.addEventListener('touchmove', (e) => {
  if (e.touches.length > 1) {  
     e.preventDefault();
  }
  if (clicked == true) {
    dragTarget.style.left = (e.touches[0].clientX + offSet[0]) + 'px'
    dragTarget.style.top = (e.touches[0].clientY+ offSet[1]) + 'px' 
    currentTouch = {
      x : e.changedTouches[0].clientX,
      y : e.changedTouches[0].clientY  
    }

    //console.log(`${offSet[0]},${offSet[1]}`)
    
    foundationSpotArray.forEach(spot => {
      checkFlashTouch(dragTarget, currentTouch, spot)
    })
    
    dropSpotArray.forEach(spot => {
      checkFlashTouch(dragTarget, currentTouch, spot)
    })
  } 
}, { passive: false})





//////////////////////  START AND RESET GAME FUNCTIONS  //////////////////////

function startGame() {
  createDeck()
  playerTurn = true
  createDropSpot()

  setTimeout(() => {
    dealSolitaire() 
    console.log(allStacksArray)
    console.log(allStackDivsArray)
  }, 100)

  setTimeout(() => {
    drawBtn.classList.add('flash4')
  }, 1200)

}

function startGameButton() {
  const startGameBtn = document.createElement('button')
  startGameBtn.classList.add('startGame')
  startGameBtn.innerHTML = 'Start New Game?'
  startGameBtn.style.opacity = 0
  board.appendChild(startGameBtn)
  resetButton.style.display = 'none'
  playerTurn = false
  
  setTimeout(() => {
    fadeIn(startGameBtn, .03, 20)
  

    startGameBtn.addEventListener('click', (e) => {
      startGame()
      startGameBtn.remove()
      resetButton.style.display = 'grid'
    })

  }, 600 )
}



function reset() {
  cardCount = 0
  dealCount = 0
  clickable = false
  cardIndex = 1000;
  playerTurn = false

  deck = []

  stack1 = []
  stack2 = []
  stack3 = []
  stack4 = []
  stack5 = []
  stack6 = []
  stack7 = []

  stack1Divs = []
  stack2Divs = []
  stack3Divs = []
  stack4Divs = []
  stack5Divs = []
  stack6Divs = []
  stack7Divs = []

  foundationClubs = []
  foundationDiamonds = []
  foundationHearts = []
  foundationSpades = []

  foundationClubsDivs = []
  foundationDiamondsDivs = []
  foundationHeartsDivs = []
  foundationSpadesDivs = []

  drawnCards = []
  drawnCardDivs = []
  currentDrawnCards = []
  drawnCount = 0

  dropSpotArray = []
  dropSpot = ''
  foundationSpotArray = []
  foundationSpot = ''

  allStacksArray = [stack1, stack2, stack3, stack4, stack5, stack6, stack7]
  allStackDivsArray =  [stack1Divs, stack2Divs, stack3Divs, stack4Divs, stack5Divs, stack6Divs, stack7Divs]
  
  const cardTempTableau = tableau.querySelector('.cardDiv')
  const cardTempDeck= deckDiv.querySelector('.cardDiv')
  const cardTempFoundation = foundationDiv.querySelector('.cardDiv')
  if (cardTempTableau != undefined) {
    const positionT = getComputedStyle(cardTempTableau).bottom.replace('px', '')
    fadeOutMultiple(tableau.querySelectorAll('.cardDiv'), 200, positionT, positionT - 50, true)
  }
  if (cardTempDeck != undefined) {
    const positionD = getComputedStyle(cardTempDeck).bottom.replace('px', '')
    fadeOutMultiple(deckDiv.querySelectorAll('.cardDiv'), 200, positionD, positionD - 50, true)
  }

  if (cardTempFoundation != undefined) {
    const positionF = getComputedStyle(cardTempFoundation).bottom.replace('px', '')
    fadeOutMultiple(foundationDiv.querySelectorAll('.cardDiv'), 200, positionF, positionF - 50, true)
  }

  document.querySelectorAll('.turnMessage').forEach(elem => {
    elem.remove()
  })

  document.querySelectorAll('.message').forEach(elem => {
    elem.remove()
  })
}



//////////////////////  BUTTON AND WINDOW EVENTS //////////////////////


drawBtn.addEventListener('click', (e) => {
  if (playerTurn == true){
    deal()
  }
})


window.addEventListener('load', (e) => {
  startGameButton()
}) 

window.addEventListener('selectstart', (e) => {
  e.preventDefault();
})

resetButton.addEventListener('click', (e) => {
  if (playerTurn == true) {
    reset()
    startGameButton()
  }
})

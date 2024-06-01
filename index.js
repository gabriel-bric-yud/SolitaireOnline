//////////////////////  GLOBAL CONSTANTS  //////////////////////


const RANKS = ['A','2','3','4','5','6','7','8','9','10', 'J', 'Q', 'K']
const SUITS = ['hearts', 'diamonds', 'spades', 'clubs']

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

let DRAWN_DECK = []
let DECK = []


let STACK_1 = []
let STACK_2 = []
let STACK_3 = []
let STACK_4 = []
let STACK_5 = []
let STACK_6 = []
let STACK_7 = []
let CLUBS = []
let DIAMONDS = []
let HEARTS = []
let SPADES = []
let STACKS_ALL = [STACK_1, STACK_2, STACK_3, STACK_4, STACK_5, STACK_6, STACK_7]

let cardIndex = 1000
let dealCount = 0
let firstPass = true

let clicked = false
let playerTurn = true

let offSet
let dragTarget
let dragArray = []
let dropSpot = ''
let foundationSpot = ''
let dropSpotArrays




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
  let newDeck = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      newDeck.push(
      {
        rank: rank,
        suit: suit
      })
    }
  }
  document.querySelector('#deckPlaceholder').classList.add("cardBackground")
  return newDeck
}

function removeFromArray(elem, array) {
  array.splice(array.indexOf(elem), 1)
}


function chooseRandomIndex(array) {
  let randomIndex = Math.floor(Math.random() * array.length)
  return randomIndex
}

function topCardShadow(parent) {
  array = parent.querySelectorAll('.cardDiv')
  if (array.length > 0) {
    array.forEach(element => {
      element.classList.add('noShadow')
      if (array[array.length-1] == element) {
        element.classList.remove('noShadow')
      }
    })
  }
}


function changeCardLabel(card) {
  const cardLabelArray = card.querySelectorAll('.cardLabel')
  let textData, colorData
  switch(card.dataset.suit) {
    case 'spades':
      textData = `${card.dataset.rank}&#9824`
      colorData = 'black'
      break;
    case 'clubs':
      textData = `${card.dataset.rank}&#9827;`
      colorData = 'black'
      break;
    case 'hearts':
      textData = `${card.dataset.rank}&#9829;`
      colorData = 'red'
      break;
    case 'diamonds':
      textData = `${card.dataset.rank}&#9830;`
      colorData = 'red'
      break;
  }
  cardLabelArray.forEach(label => {
    label.innerHTML = textData;
    label.style.color = colorData;
  })
}


function loadCardRank(card) {
  let randomCard = DECK[chooseRandomIndex(DECK)]
  card.setAttribute('id', `${randomCard.rank}of${randomCard.suit}`)
  card.dataset.rank = randomCard.rank
  card.dataset.suit = randomCard.suit
  changeCardLabel(card);
  removeFromArray(randomCard, DECK)
  topCardShadow(drawnCard)
  return randomCard
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

function createCard(deckArray, cardArray, stack) {
  const card = document.createElement('div');
  card.classList.add('card');

  const frontOfCard = document.createElement('div')
  const labelFrame = document.createElement('div')
  labelFrame.classList.add('labelFrame')
  createCardLabel('top', frontOfCard, labelFrame)
  createCardLabel('bottom', frontOfCard, labelFrame)
  const backOfCard = document.createElement('div')
  frontOfCard.classList.add('frontCard')
  frontOfCard.classList.add('hide')
  backOfCard.classList.add('backCard')
  backOfCard.classList.add('show')
  card.appendChild(frontOfCard)
  card.appendChild(backOfCard)

  const cardDiv = document.createElement('div')
  cardIndex++
  cardDiv.style.zIndex = cardIndex
  cardDiv.classList.add('cardDiv')
  cardDiv.style.opacity = 0
  cardDiv.appendChild(card)
  cardDiv.style.pointerEvents = 'none'
  cardDiv.dataset.stack = stack

  let cardData = loadCardRank(cardDiv)

  return [cardDiv, cardData]
}


//////////////////////  POSITION AND FLIP CARD FUNCTIONS  //////////////////////


function addCardFlip(card) {
  let front = card.querySelector('.frontCard')
  let back = card.querySelector('.backCard')
  card.style.pointerEvents = 'none' ? card.style.pointerEvents = 'all' : card.style.pointerEvents = 'none'
  card.classList.contains('flip') ? card.classList.remove('flip') :  card.classList.add('flip')
  setTimeout(() => {
    showHide(front)
    showHide(back)
  }, 300) 
}

function addCardFlipNoAnimation(card) {
  card.style.opacity = 0
  let front = card.querySelector('.frontCard')
  let back = card.querySelector('.backCard')
  card.style.pointerEvents = 'none'
  card.classList.remove('flip')
  showHide(front)
  showHide(back)
}

function flipNextCard(card, cardDivArray) {
  let nextCard = cardDivArray[cardDivArray.indexOf(card) - 1]
  if (nextCard != undefined) {
    if (nextCard[0].querySelector('.frontCard').classList.contains('hide')) {
      addCardFlip(nextCard[0])
    }
  }
}


function positionCardLeft(playerArray, cardDiv, parent) {
  if (playerArray.length < 5){
    let endPosition1 = (((cardWidth) * playerArray.indexOf(cardDiv)))
    slideIn(cardDiv[0], endPosition1 + 5, endPosition1, 'left', -1)
  }
  else {
    let parentData = window.getComputedStyle(parent)
    let cardSize = Number(parentData.getPropertyValue("width").replace("px", "")) / playerArray.length;
    playerArray.forEach(elem => {
      elem[0].style.width = `${cardSize}px`
      elem[0].style.height = `${(cardSize/2) + cardSize}px`
      let endPosition = ((cardSize) * playerArray.indexOf(elem))
      slideIn(elem[0], endPosition, endPosition, 'left', -1)
      const labels = elem[0].querySelectorAll('.cardLabel') 
      labels.forEach(label => {label.style.fontSize = '10px'; label.parentNode.style.width = "10px"; label.parentNode.style.height = "10px"; })
    })
  }
}


function positionCardsBottom(cardArray) {
  cardArray.forEach(elem => {
    if (cardArray.indexOf(elem) > 0) {
      //let position = getComputedStyle(elem.parentNode).left.replace('px', '')   
      let endPosition1 = (cardHeight/1.45 * cardArray.indexOf(elem))
      slideIn(elem[0], endPosition1 + 150, endPosition1, 'top', -10)
    }
    else {
      let endPosition1 = 0
      slideIn(elem[0], endPosition1 + 150, endPosition1, 'top', -10)
    }
  })
}

function positionSingleCardBottom(card, cardArray, i) {
  if (i > 0) {
    let endPosition1 = (cardHeight/1.45 * cardArray.indexOf(card))
    slideIn(card[0], endPosition1 + 50, endPosition1, 'top', -10)
  }
  else {
    let endPosition1 = 0
    slideIn(card[0], endPosition1 + 50, endPosition1, 'top', -10)
  }
}


function positionCard(card, cardArray) {
    let endPosition1 = (cardHeight/1.45 * cardArray.indexOf(card))
    slideIn(card[0], endPosition1 + .1, endPosition1, 'top', -.1)
}


//////////////////////  DEAL CARDS FUNCTIONS  //////////////////////


function dealCards(numberOfCards, cardNumber, parent, cardArray, flipBool, stack) {
  numberOfCards += dealCount
  let newCard
  for (let i = cardNumber; i < numberOfCards; i++) {
    dealCount++
    if (firstPass == true) {
      newCard = createCard(DECK, cardArray, stack)
    }
    else {
      newCard = DECK[0]
      removeFromArray(newCard, DECK)
    }
    cardArray.push(newCard)
    parent.appendChild(newCard[0])
    setTimeout(() => {
      fadeIn(newCard[0], .05, 20)
      if (parent == drawnCard ) {
        slideIn(newCard[0], 50, 0, 'right', -5)
        //newCard[0].style.removeProperty('right')     
      }

    }, 200)

    if (flipBool)  {
      if (drawnCard.querySelectorAll('.cardDiv').length == 1){
        addCardFlip(newCard[0])
      }
      else {
        setTimeout(() => {
          addCardFlip(newCard[0])
        }, 300)           
      }
    }

    if (firstPass == true) {
      setTimeout(() => {
        createDraggable(newCard[0])
      }, 850)
    }
  }  
}

async function dealSolitaire() {
  setTimeout(() => {
    for (let i = 1; i <= 7; i++) {
      for (let x = 0; x < i; x++) {
        if (x < i - 1) {
          dealCards(1, x, document.getElementById(`stack${i}`), STACKS_ALL[i-1], false, i);
        }
        else {
          dealCards(1, x, document.getElementById(`stack${i}`), STACKS_ALL[i-1], true, i);
        }
      }
      dealCount = 0
    }
  }, 10)
}


function deal() { 
  if (DECK.length == 0) {
    if (DRAWN_DECK.length == 0) {
      document.querySelector('#deckPlaceholder').classList.remove("cardBackground")
    }
    firstPass = false;
    DECK = DRAWN_DECK
    currentDrawnCards= drawnCard.querySelectorAll('.cardDiv')
    if (currentDrawnCards.length > 0) {
      currentDrawnCards.forEach((elem) => {
        if (elem != currentDrawnCards[currentDrawnCards.length - 1]) {
          addCardFlipNoAnimation(elem)
          elem.remove()
        }
        else {
          
          fadeOut(elem, 1, 0, 1, true )
          setTimeout(() => { addCardFlip(elem) }, 1000)
        }
      })
      
    }
    DRAWN_DECK = []
  }
  else {
    setTimeout(() => {
      dealCount = 0
      dealCards(1, 0, drawnCard, DRAWN_DECK, true, "drawnCard")
    }, 100)  
  }

}


//////////////////////  GAME LOGIC + CHECK STACKS AND ARRAY MANIPULATION FUNCTIONS   //////////////////////


function checkStackOrder(card, array) {
  let dragRank = card.dataset.rank
  let dragSuit = card.dataset.suit
  let dropRank
  let dropSuit


  let stackBool = false

  if (array.length > 0) {
    dropRank = array[array.length - 1][1].rank
    dropSuit = array[array.length - 1][1].suit
  }


  if (dragRank == 'K') {
    if (array.length == 0) {
      return true
    }
    else {
      return false
    }
  }
  else {
    if (RANKS[RANKS.indexOf(dragRank) + 1] == RANKS[RANKS.indexOf(dropRank)]) {
      switch(dragSuit) {
        case 'hearts':
        case 'diamonds':
          if (dropSuit == 'spades' || dropSuit == 'clubs') {
            stackBool = true
          }
          break;
        case 'spades':
        case 'clubs':
          if (dropSuit == 'hearts' || dropSuit == 'diamonds') {
            stackBool = true
          }
          break;
      }
    }
  }
  return stackBool
}


function checkFoundationOrder(card, array, suit) {
  let dragRank = card.dataset.rank
  let dragSuit = card.dataset.suit
  let dropRank
  let foundationSuit = suit

  if (array.length > 0) {
    dropRank = array[array.length - 1][1].rank
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
    else {
      if (RANKS[RANKS.indexOf(dragRank) - 1] == RANKS[RANKS.indexOf(dropRank)]) {
        return  true
      }
    }
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


function changeArrays(elem, stackArray, num) {
  elem[0].dataset.stack = num
  elem[0].style.removeProperty('right')
  stackArray.push(elem)

  if (typeof num == 'number') {
    positionCard(elem, stackArray)
  }
  else {
    elem[0].style.removeProperty('top')
  }
}

function getCurrentArray(elem) {

  let currentArray
  switch(elem.dataset.stack) {
    case '1':
      currentArray = STACK_1
      break;
    case '2':
      currentArray = STACK_2
      break;
    case '3':
      currentArray = STACK_3
      break;
    case '4':
      currentArray = STACK_4
      break;
    case '5':
      currentArray = STACK_5
      break;
    case '6':
      currentArray = STACK_6
      break;
    case '7':
      currentArray = STACK_7
      break;
    case 'clubs':
      currentArray = CLUBS
      break;
    case 'diamonds':
      currentArray = DIAMONDS
      break; 
    case 'hearts':
      currentArray = HEARTS
      break;
    case 'spades':
      currentArray = SPADES
      break;
    case 'drawnCard':
      currentArray = DRAWN_DECK
      break;
    default:
      currentArray = DRAWN_DECK
      break;
  }

  return currentArray
}


function getCardData(div, array) {
  let currentCard
  array.forEach((elem) => {
    if (elem[0] == div) {
      currentCard = elem
    }
  })
  return currentCard
}

function moveCards(elem, parent, cardArray, newCardArray, num) { 

  let moveArray = []
  let cardData = getCardData(elem, cardArray)
  let index = cardArray.indexOf(cardData)

  if (cardArray == DRAWN_DECK) {
    moveArray.push(cardArray[index])
  }
  else {
    for (let i = index; i < cardArray.length; i++) {
      moveArray.push(cardArray[i])
    }
  }
  for (let y = 1; y <= moveArray.length; y++) {
    setTimeout(() => {
      let card = moveArray[y-1]
      removeFromArray(card, cardArray)
      changeArrays(card, newCardArray, num)
      cardIndex++
      card[0].style.zIndex = cardIndex
      card[0].style.opacity = 0
      card[0].style.removeProperty('left')
      card[0].querySelector('.frontCard').classList.remove('bigger')
      parent.appendChild(card[0])
      fadeIn(card[0], .05, 10)
      checkWin() 
    }, 100)
  }

  dropSpot = ''
}

function getNewStackArray(elem, parent) {
  let currentArray = getCurrentArray(elem)
  let currentLength = currentArray.length - 1
  let cardData = getCardData(elem, currentArray)
  let dropBool = false

  switch(parent.id) {
    case 'stack1':
      if (checkStackOrder(elem, STACK_1)) {
        moveCards(elem, parent, currentArray, STACK_1, 1)
        flipNextCard(cardData, currentArray)
        dropBool = true
      }
      break;
    case 'stack2':
      if (checkStackOrder(elem, STACK_2)) {
        moveCards(elem, parent, currentArray, STACK_2, 2)
        flipNextCard(cardData, currentArray)
        dropBool = true
      }
      break;
    case 'stack3':
      if (checkStackOrder(elem, STACK_3)) {
        moveCards(elem, parent, currentArray, STACK_3, 3)
        flipNextCard(cardData, currentArray)
        dropBool = true
      }
      break;
    case 'stack4':
      if (checkStackOrder(elem, STACK_4)) {
        moveCards(elem, parent, currentArray, STACK_4, 4)
        flipNextCard(cardData, currentArray)
        dropBool = true
      }
      break;
    case 'stack5':
      if (checkStackOrder(elem, STACK_5)) {
        moveCards(elem, parent, currentArray, STACK_5, 5)
        flipNextCard(cardData, currentArray)
        dropBool = true
      }
      break;
    case 'stack6':
      if (checkStackOrder(elem, STACK_6)) {
        moveCards(elem, parent, currentArray, STACK_6, 6)
        flipNextCard(cardData, currentArray)
        dropBool = true
      }
      break;
    case 'stack7':
      if (checkStackOrder(elem, STACK_7)) {
        moveCards(elem, parent, currentArray, STACK_7, 7)
        flipNextCard(cardData, currentArray)
        dropBool = true
      }
      break; 
    case 'clubs':
      if (checkFoundationOrder(elem, CLUBS, 'clubs')) {
        if (currentArray.indexOf(cardData) == currentLength || currentArray == DRAWN_DECK) {
          moveCards(elem, parent, currentArray, CLUBS, 'clubs')
          topCardShadow(parent)
          flipNextCard(cardData, currentArray)
          dropBool = true
        }
      }
      break; 
    case 'diamonds':
      if (checkFoundationOrder(elem, DIAMONDS, 'diamonds')) {
        if (currentArray.indexOf(cardData) == currentLength || currentArray == DRAWN_DECK) {
          moveCards(elem, parent, currentArray, DIAMONDS, 'diamonds')
          topCardShadow(parent)
          flipNextCard(cardData, currentArray)
          dropBool = true
        }
      }
      break; 
    case 'hearts':
      if (checkFoundationOrder(elem, HEARTS, 'hearts')) {
        if (currentArray.indexOf(cardData) == currentLength || currentArray == DRAWN_DECK) {
          moveCards(elem, parent, currentArray, HEARTS, 'hearts')
          topCardShadow(parent)
          flipNextCard(cardData, currentArray)
          dropBool = true
        }
      }
      break; 
    case 'spades':
      if (checkFoundationOrder(elem, SPADES, 'spades')) {
        if (currentArray.indexOf(cardData) == currentLength || currentArray == DRAWN_DECK) {
          moveCards(elem, parent, currentArray, SPADES, 'spades')
          topCardShadow(parent)
          flipNextCard(cardData, currentArray)
          dropBool = true
        }
      }
      break;
  }

  return dropBool
}


function checkWin() {
  let foundationArrays = [CLUBS, DIAMONDS, HEARTS, SPADES]
  if (foundationArrays[0].length == 13 && foundationArrays[1].length == 13 && foundationArrays[2].length == 13 && foundationArrays[3].length == 13) {
    turnNotification(`You Win! Congratulations!`, tableau, 'Play Again', 'Reset')
    return true
  }
  else {
    return false
  }
}


//////////////////////  DRAG AND DROP FUNCTIONALITY (TOUCH INCLUDED)  //////////////////////


function checkDrop(coordinate, container) {
  if (coordinate.x <= container.getBoundingClientRect().x + container.getBoundingClientRect().width && coordinate.x >= container.getBoundingClientRect().x) {
    if ((coordinate.y >= container.getBoundingClientRect().y) && (coordinate.y <= container.getBoundingClientRect().y + container.getBoundingClientRect().height)) {
      dropSpot = container
      return true
    }
  }
  else {
    return false
  }
}


function toggleFlash(coordinate, container) {
  if (coordinate.x <= container.getBoundingClientRect().x + container.getBoundingClientRect().width && coordinate.x >= container.getBoundingClientRect().x) {
    if ((coordinate.y >= container.getBoundingClientRect().y) && (coordinate.y <= container.getBoundingClientRect().y + container.getBoundingClientRect().height)) { 
      if (!(container.classList.contains('flash'))) {
        document.querySelectorAll('.stack').forEach(item => {
          item.classList.remove('flash')
        })
        container.classList.add('flash')
      }
    }
  }
}


function createDropSpot() {
  return [
    dropSpotArray = document.querySelectorAll('.cardStack'),
    foundationSpotArray = document.querySelectorAll('.foundationSpot'),
    allDropSpots = document.querySelectorAll('.foundationSpot, .cardStack')
  ]
}

function resetCardPosition(elem, array) {
  array[0][4].appendChild(elem)
  elem.style.removeProperty('left')
  elem.style.top = array[0][1]
  elem.style.right = array[0][2]      
  elem.style.zIndex = array[0][3]

  array.forEach((item) => {
    if (item[0] != elem) {
      item[0].querySelector('.frontCard').classList.remove('bigger')
      item[0].style.removeProperty('left')
      item[0].style.top = item[1]
      item[0].style.right = item[2]
      item[0].style.zIndex = item[3]
      array[0][4].appendChild(item[0])
    }
  })
}


function createDraggable(elem) {
  elem.addEventListener('mousedown', (e) => {
    //e.preventDefault()
    if (!clicked) {
      dragTarget = e.target;
      let currentDragArray = getCurrentArray(dragTarget)
      let dragElemData = getCardData(dragTarget, currentDragArray)
      let dragStack = dragTarget.parentNode
      let dragIndex = dragTarget.style.zIndex
      let dragTop = dragTarget.style.top
      let dragRight = dragTarget.style.right 
      let dragInfo = [dragTarget, dragTop, dragRight, dragIndex, dragStack]
      dragArray.push(dragInfo)
      
      dragTarget.style.removeProperty('left')
      dragTarget.style.removeProperty('top')
      dragTarget.style.removeProperty('right')
      dragTarget.querySelector('.frontCard').classList.add('bigger')
      dragTarget.style.cursor = "grabbing"
      dragTarget.style.zIndex = 9999
      dragTarget.style.left = (e.clientX) - (dragTarget.offsetWidth/2) + window.scrollX + 'px'
      dragTarget.style.top = (e.clientY) - (dragTarget.offsetHeight/1.2) + window.scrollY + 'px'
      document.body.appendChild(dragTarget)
      let indexCounter = 9999

      if (currentDragArray.indexOf(dragElemData) != (currentDragArray.length - 1) && dragStack != drawnCard ) {
        for (let i = currentDragArray.indexOf(dragElemData) + 1; i < currentDragArray.length; i++) {
          indexCounter++
          let currentCard = currentDragArray[i][0]
          let currentTop = currentCard.style.top
          let currentRight = currentCard.style.right 
          let currentCardIndex = currentCard.style.zIndex
          let currentCardInfo = [currentCard, currentTop, currentRight, currentCardIndex, dragStack]
          dragArray.push(currentCardInfo)

          currentCard.style.removeProperty('left')
          currentCard.style.removeProperty('top')
          currentCard.style.removeProperty('right')
          currentCard.querySelector('.frontCard').classList.add('bigger')
          currentCard.style.zIndex = indexCounter
          currentCard.style.left = (e.clientX) - (dragTarget.offsetWidth/2) + window.scrollX + 'px'
          currentCard.style.top = (e.clientY) - (dragTarget.offsetHeight/1.2) + window.scrollY + (cardHeight/1.45 * (dragArray.indexOf(currentCardInfo))) + 'px'

          document.body.appendChild(currentCard)
        }
      }
      offSet = [dragTarget.offsetLeft - e.clientX, dragTarget.offsetTop - e.clientY]
      clicked = true 
    }
  })

  elem.addEventListener('mouseup', (e) => { 
    clicked = false;
    let dropped  = false;
    dragTarget.style.cursor = "grab"
    let currentMouse = {
      x : e.clientX,
      y : e.clientY
    };
    
    dragTarget.querySelector('.frontCard').classList.remove('bigger')

    dropSpotArrays[2].forEach(spot => {
      if (dropped  == false) {
        if (checkDrop(currentMouse, spot)) {
          if (getNewStackArray(dragTarget, dropSpot)) {
            dropped = true
            dragTarget.style.opacity = 0
            dragTarget.style.removeProperty('left')  
            dragTarget.style.zIndex = cardIndex
            spot.appendChild(dragTarget)
            topCardShadow(drawnCard)
          }
        }
      }
    })

    if (dropped == false) {
      resetCardPosition(dragTarget, dragArray) 
    } 
    clearDragInfo() 
  })

  elem.addEventListener('touchstart', (e) => {
    e.preventDefault()
    if (e.touches.length > 1) {  
      e.preventDefault();
    }
    if (!clicked) {
      dragTarget = e.target;
      let currentDragArray = getCurrentArray(dragTarget)
      let dragElemData = getCardData(dragTarget, currentDragArray)
      dragStack = dragTarget.parentNode  
      let dragIndex = dragTarget.style.zIndex
      let dragTop = dragTarget.style.top
      let dragRight = dragTarget.style.right 
      let dragInfo = [dragTarget, dragTop, dragRight, dragIndex, dragStack]
      dragArray.push(dragInfo)

      dragTarget.style.removeProperty('left')
      dragTarget.style.removeProperty('top')
      dragTarget.style.removeProperty('right')
      dragTarget.querySelector('.frontCard').classList.add('bigger')
      dragTarget.style.zIndex = 9999
      dragTarget.style.left = (e.touches[0].clientX) - (dragTarget.offsetWidth/2) + window.scrollX + 'px'
      dragTarget.style.top = (e.touches[0].clientY) - (dragTarget.offsetHeight/1.2) + window.scrollY + 'px'
      document.body.appendChild(dragTarget)
      let indexCounter = 9999

      if (currentDragArray.indexOf(dragElemData) != currentDragArray.length - 1 && dragStack != drawnCard ) {
        for (let i = currentDragArray.indexOf(dragElemData) + 1; i < currentDragArray.length; i++) {
          indexCounter++
          let currentCard = currentDragArray[i][0]
          let currentTop = currentCard.style.top
          let currentRight = currentCard.style.right 
          let currentCardIndex = currentCard.style.zIndex
          let currentCardInfo = [currentCard, currentTop, currentRight, currentCardIndex, dragStack]
          dragArray.push(currentCardInfo)

          currentCard.style.removeProperty('left')
          currentCard.style.removeProperty('top')
          currentCard.style.removeProperty('right')
          currentCard.querySelector('.frontCard').classList.add('bigger')
          currentCard.style.zIndex = indexCounter
          currentCard.style.left = (e.touches[0].clientX) - (dragTarget.offsetWidth/2) + window.scrollX + 'px'
          currentCard.style.top = (e.touches[0].clientY) - (dragTarget.offsetHeight/1.2) + window.scrollY + (cardHeight/1.45 * (dragArray.indexOf(currentCardInfo))) + 'px'
          document.body.appendChild(currentCard)
        }
      }
  
      offSet = [dragTarget.offsetLeft - e.touches[0].clientX, dragTarget.offsetTop - e.touches[0].clientY]
      clicked = true 
    }
  }, { passive: false})

 

  elem.addEventListener('touchend', (e) => { 
    clicked = false;
    let dropped  = false;
    let currentTouch = {
      x : e.changedTouches[0].clientX,
      y : e.changedTouches[0].clientY
    };
    
    dragTarget.querySelector('.frontCard').classList.remove('bigger')

    dropSpotArrays[2].forEach(spot => {
      if (dropped  == false) {
        if (checkDrop(currentTouch, spot)) {
          if (getNewStackArray(dragTarget, dropSpot)) {
            dropped = true
            dragTarget.style.opacity = 0
            dragTarget.style.zIndex = cardIndex
            spot.appendChild(dragTarget)
            dragTarget.style.removeProperty('left')  
            topCardShadow(drawnCard)
          }
        }
      }
    })

    if (dropped == false) {
      resetCardPosition(dragTarget, dragArray) 
    } 
    clearDragInfo() 
  }) 
}


document.addEventListener('mousemove', (e) => {
  if (clicked == true) {
    dragTarget.style.left = (e.clientX + offSet[0]) + 'px'
    dragTarget.style.top = (e.clientY+ offSet[1]) + 'px' 
    let currentMouse = {
      x : e.clientX,
      y : e.clientY  
    }

    dragArray.forEach((item) => {
      if (item[0] != dragTarget) {
        item[0].style.left = (e.clientX + offSet[0]) + 'px'
        item[0].style.top = (e.clientY+ offSet[1]) + (cardHeight/1.45 * (dragArray.indexOf(item))) + 'px' 
      }
    })

    dropSpotArrays[0].forEach(spot => {
      toggleFlash(currentMouse, spot)
    })
    dropSpotArrays[1].forEach(spot => {
      toggleFlash(currentMouse, spot)
    })
  } 
})


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

    dragArray.forEach((item) => {
      if (item[0] != dragTarget) {
        item[0].style.left = (e.touches[0].clientX + offSet[0]) + 'px'
        item[0].style.top = (e.touches[0].clientY+ offSet[1]) + (cardHeight/1.45 * (dragArray.indexOf(item))) + 'px' 
      }
    })

    dropSpotArrays[0].forEach(spot => {
      toggleFlash(currentTouch, spot)
    })
    dropSpotArrays[1].forEach(spot => {
      toggleFlash(currentTouch, spot)
    })
  } 
}, { passive: false})



function clearDragInfo() {
  dragArray = []
  dragTarget = "";
  dropSpot = ''
  document.querySelectorAll('.stack').forEach(item => {
    item.classList.remove('flash')
  })
}


//////////////////////  START AND RESET GAME FUNCTIONS  //////////////////////

function startGame() {
  DECK = createDeck()
  playerTurn = true
  dropSpotArrays = createDropSpot()

  setTimeout(() => {
    dealSolitaire() 
  }, 100)

  setTimeout(() => {
    STACKS_ALL.forEach((stack) => {
      positionCardsBottom(stack)
    })
  }, 300)
}

function startGameButton() {
  resetButton.style.display = 'none'
  const startGameBtn = document.createElement('button')
  startGameBtn.classList.add('startGame')
  startGameBtn.innerHTML = 'Start New Game?'
  startGameBtn.style.opacity = 0
  board.appendChild(startGameBtn)
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

function clearBoard() {
  let allCards = document.querySelectorAll(".cardDiv")

  allCards.forEach((elem) => {
    if (!elem.classList.contains("flip")) {
      elem.remove()
    }
    else {
      let positionF = getComputedStyle(elem).bottom.replace('px', '')
      fadeOut(elem, 50, positionF, positionF -50, true)
    }
  })

  document.querySelectorAll('.turnMessage').forEach(elem => {
    elem.remove()
  })
  document.querySelectorAll('.message').forEach(elem => {
    elem.remove()
  })
}


function reset() {
  dealCount = 0
  cardIndex = 1000;
  playerTurn = false

  DECK = []
  DRAWN_DECK = []

  STACK_1 = []
  STACK_2 = []
  STACK_3 = []
  STACK_4 = []
  STACK_5 = []
  STACK_6 = []
  STACK_7 = []
  STACKS_ALL = [STACK_1, STACK_2, STACK_3, STACK_4, STACK_5, STACK_6, STACK_7]

  CLUBS = []
  DIAMONDS = []
  HEARTS = []
  SPADES = []

  dropSpotArrays = []

  clearBoard()
 
}



//////////////////////  BUTTON AND WINDOW EVENTS //////////////////////


drawBtn.addEventListener('click', (e) => {
  if (playerTurn == true){
    deal()
    playerTurn = false
    setTimeout(() => {
      playerTurn = true
    }, 800)
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
async function slideIn(elem, startPosition, endPosition, direction, increment) {
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

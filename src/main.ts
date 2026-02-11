
const counterEl=document.getElementById("counter") as HTMLElement
const cardContainer=document.getElementById("cardContainer") as HTMLDivElement;
const resetButton=document.getElementById("resetButton") as HTMLButtonElement;
const timer=document.getElementById("timer") as HTMLHeadingElement
const turnCounterEl=document.getElementById("turnCounter") as HTMLElement
const colors=["red","blue","yellow","pink","purple","black","white","green"]
const defaultColor="wheat"


const gameState={
  cardsAmount:16,
  get n(){
    return Math.sqrt(this.cardsAmount)
  },
  counter:0,
  turnCounter:0,
  startDate:Date.now(),
  pickedCard:null as HTMLDivElement|null
}
let timerChanger=setInterval(setTimer,10)

createMap()

type CardData={
  value:number//value is equal for the pair of cards 
  open:boolean
}

function resetColorToDefault(card:HTMLDivElement){
  card.style.backgroundColor=defaultColor
}
function colorCard(card:HTMLDivElement,color:string)
{
  card.style.backgroundColor=color
}
function setTimer(){
  timer.innerText=`${Math.floor((Date.now()-gameState.startDate)/1000)} seconds`
}
function getCardContent(valueMap:Map<number,number>):CardData{
  if(valueMap.size===0)
  {
    throw new Error("ValueMap is empty")
  }
  let index=Math.floor(Math.random()*valueMap.size)
  for(let [key,value] of valueMap){
    if(index===0)
    {
      let cardContent:CardData={value:key,open:false}
      valueMap.set(key,value-1)
      if(valueMap.get(key)==0)
        valueMap.delete(key)
      return cardContent 
    }
    else index--;
  }
  throw new Error("Super duper undexpected error")
}

function createCards(cardStorage:Map<HTMLDivElement,CardData|null>){
   for(let i=0;i<gameState.n;i++)
      for(let j=0;j<gameState.n;j++)
      {
      const card=document.createElement("div");
      card.classList.add("card");
      card.id=`card${i}${j}`
      card.addEventListener('click',()=>{
        if(cardStorage.get(card)!.open)
        {
          return;
        }
        else{
          colorCard(card,colors[cardStorage.get(card)!.value])
          cardStorage.get(card)!.open=true;
          if(gameState.pickedCard===null)
          {
            gameState.pickedCard=card
          }
          else{
            gameState.turnCounter++;
            turnCounterEl.innerText=`${gameState.turnCounter} turns spent`
            if(cardStorage.get(gameState.pickedCard)!.value===cardStorage.get(card)!.value)
            {
              gameState.counter++;
              counterEl.innerText=`${gameState.counter} cards found`
            }
            else{
              let temp=gameState.pickedCard
              setTimeout(()=>{
                cardStorage.get(card)!.open=false;
                cardStorage.get(temp)!.open=false;
                resetColorToDefault(card)
                resetColorToDefault(temp)
              },500)
            }
            gameState.pickedCard=null;
          }
        }
        })
        cardStorage.set(card,null)
        cardContainer.appendChild(card);
      }
}

function initCards(cardStorage:Map<HTMLDivElement,CardData|null>){
  let valueMap=new Map<number,number>()
  for(let i=0;i<gameState.cardsAmount/2;i++)
  {
    valueMap.set(i,2)//i--value 2--cards left
  }  
  cardStorage.forEach((p,card)=>{
    let cardContent=getCardContent(valueMap)
    cardStorage.set(card,cardContent);
  })
}

function resetCards(cardStorage:Map<HTMLDivElement,CardData|null>){
  cardStorage.forEach((p,card)=>{
    resetColorToDefault(card)
  })
}

function createMap(){
  let cardStorage=new Map<HTMLDivElement,CardData|null>()
  createCards(cardStorage)
  initCards(cardStorage)
  resetButton.addEventListener('click',()=>{
    gameState.startDate=Date.now()
    gameState.counter=0
    gameState.turnCounter=0
    resetCards(cardStorage)
    initCards(cardStorage)
    counterEl.innerText="0 cards found"
    turnCounterEl.innerText="0 turns spent"
  })
}





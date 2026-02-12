
const counterEl=document.getElementById("counter") as HTMLElement
const cardContainer=document.getElementById("cardContainer") as HTMLDivElement;
const resetButton=document.getElementById("resetButton") as HTMLButtonElement;
const timer=document.getElementById("timer") as HTMLHeadingElement
const turnCounterEl=document.getElementById("turnCounter") as HTMLElement
const colors = [
  "red", "blue", "yellow", "pink", "purple", 
  "black", "white", "green", "orange", "brown",
  "gray", "cyan", "magenta", "lime", "indigo",
  "violet", "gold", "silver", "coral", "navy",
  "maroon", "teal", "olive", "beige", "lavender",
  "turquoise", "tan", "crimson", "plum", "orchid",
  "salmon", "khaki", "ivory", "charcoal", "peach",
  "mint", "rust", "amber", "emerald", "jade",
  "cobalt", "ruby", "rose", "sky", "slate",
  "bronze", "copper", "mustard", "lavender", "apricot",
  "fuschia", "lilac", "cream", "periwinkle", "mauve",
  "taupe", "terracotta", "champagne", "eggplant", "sienna",
  "ochre", "sepia", "sage", "alabaster"
]
const urlParams = new URLSearchParams(window.location.search);
const defaultColor="wheat"

const sizeOptions=[2,4,6,8,10]

const gameState={
  n:sizeOptions.includes(Number(urlParams.get("size")))?Number(urlParams.get("size")):2,
  get cardsAmount(){
    return gameState.n*gameState.n;
  },
  counter:0,
  turnCounter:0,
  startDate:Date.now(),
  pickedCard:null as HTMLDivElement|null
}

let gridSettings="";
let width=gameState.n*4.5
let height=gameState.n*6.5
for(let i=0;i<gameState.n;i++){
  gridSettings+="1fr ";
}
cardContainer.style.width=width+"rem"
cardContainer.style.height=height+"rem"
cardContainer.style.gridTemplateColumns=gridSettings
cardContainer.style.gridTemplateRows=gridSettings
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
    clearInterval(timerChanger)
    timerChanger=setInterval(setTimer,10)
    gameState.counter=0
    gameState.turnCounter=0
    gameState.pickedCard=null
    resetCards(cardStorage)
    initCards(cardStorage)
    counterEl.innerText="0 cards found"
    turnCounterEl.innerText="0 turns spent"
  })
}





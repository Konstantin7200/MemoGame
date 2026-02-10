
const counterEl=document.getElementById("counter") as HTMLElement
const cardContainer=document.getElementById("cardContainer") as HTMLDivElement;
const resetButton=document.getElementById("resetButton") as HTMLButtonElement;
const timer=document.getElementById("timer") as HTMLHeadingElement
const turnCounterEl=document.getElementById("turnCounter") as HTMLElement
const colors=["red","blue","yellow","pink","purple","black","white","green"]
const defaultColor="wheat"

let n=4;
let pickedCard:HTMLDivElement|null=null
let counter=0
let turnCounter=0
let startDate=Date.now()
let timerChanger=setInterval(setTimer,10)

createMap(n)

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
  timer.innerText=`${Math.floor((Date.now()-startDate)/1000)} seconds`
}
function setCardContent(arr:number[]):[CardData,number[]]{
  let index=Math.floor(Math.random()*arr.length)
  let num=arr[index]
  if(num%10===1)
    arr=arr.filter((el)=>el!==num)
  else arr[index]--;
  let cardContent:CardData={value:Math.floor(num/10),open:false}
  return [cardContent,arr]
}

function createCards(cardStorage:Map<HTMLDivElement,CardData|null>){
   for(let i=0;i<n;i++)
      for(let j=0;j<n;j++)
      {
      const card=document.createElement("div");
      card.classList.add("card");
      card.id=`card${i}${j}`
      card.addEventListener('click',()=>{
        if(cardStorage.get(card)!.open)
          return;
        else{
          colorCard(card,colors[cardStorage.get(card)!.value-1])
          if(pickedCard===null)
            pickedCard=card
          else{
            turnCounter++;
            turnCounterEl.innerText=`${turnCounter} turns spent`
            if(cardStorage.get(pickedCard)!.value===cardStorage.get(card)!.value)
            {
              counter++;
              counterEl.innerText=`${counter} cards found`
            }
            else{
              let temp=pickedCard
              setTimeout(()=>{
                cardStorage.get(card)!.open=false;
                cardStorage.get(temp)!.open=false;
                resetColorToDefault(card)
                resetColorToDefault(temp)
              },500)
            }
            pickedCard=null;
          }
        }
        })
        cardStorage.set(card,null)
        cardContainer.appendChild(card);
      }
}

function initCards(cardStorage:Map<HTMLDivElement,CardData|null>,arr:number[]){
  for(let i=0;i<arr.length;i++)
    arr[i]=(i+1)*10+2
  cardStorage.forEach((p,card)=>{
    let cardContent;
    [cardContent,arr]=setCardContent(arr)
    cardStorage.set(card,cardContent);
  })
}
function resetCards(cardStorage:Map<HTMLDivElement,CardData|null>){
  cardStorage.forEach((p,card)=>{
    resetColorToDefault(card)
  })
}

function createMap(n:number){
  let arr=new Array(n*n/2)
  let cardStorage=new Map<HTMLDivElement,CardData|null>()
  createCards(cardStorage)
  initCards(cardStorage,arr)
  resetButton.addEventListener('click',()=>{
    startDate=Date.now()
    counter=0
    turnCounter=0
    resetCards(cardStorage)
    initCards(cardStorage,arr)
    counterEl.innerText="0 cards found"
    turnCounterEl.innerText="0 turns spent"
  })
}





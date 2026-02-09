
const counterEl=document.getElementById("counter") as HTMLElement
const cardContainer=document.getElementById("cardContainer") as HTMLDivElement;
const resetButton=document.getElementById("resetButton") as HTMLButtonElement;
const timer=document.getElementById("timer") as HTMLHeadingElement
const colors=["red","blue","yellow","pink","purple","black","white","green"]

let n=4;
let pickedCard:HTMLDivElement|null=null
let counter=0
let startDate=Date.now()
let timerChanger=setInterval(setTimer,10)

createMap(n)


function setTimer(){
  timer.innerText=`${Math.floor((Date.now()-startDate)/1000)} seconds`
}
function setCardContent(arr:number[],cardContent:HTMLParagraphElement):number[]{
  let index=Math.floor(Math.random()*arr.length)
  let num=arr[index]
  if(num%10===1)
    arr=arr.filter((el)=>el!==num)
  else arr[index]--;
  cardContent.innerText=`${Math.floor(num/10)}`
  cardContent.style.backgroundColor=colors[Math.floor(num/10)-1]
  cardContent.style.color=colors[Math.floor(num/10)-1]
  return arr
}

function createCards(cardStorage:Map<HTMLDivElement,HTMLParagraphElement|null>){
   for(let i=0;i<n;i++)
      for(let j=0;j<n;j++)
      {
      const card=document.createElement("div");
      card.classList.add("card");
      card.id=`card${i}${j}`
      card.addEventListener('click',()=>{
        if(card.classList.contains("visible"))
          return;
        else{
          card.classList.add("visible")
          card.appendChild(cardStorage.get(card)!)
          if(pickedCard===null)
            pickedCard=card
          else{
            if(cardStorage.get(pickedCard)!.innerText===cardStorage.get(card)!.innerText)
            {
              counter++;
              counterEl.innerText=`${counter} cards found`
            }
            else{
              let temp=pickedCard
              setTimeout(()=>{
                card.classList.remove("visible")
                temp.classList.remove("visible")
                temp.removeChild(cardStorage.get(temp)!)
                card.removeChild(cardStorage.get(card)!)
              },500)
            }
            pickedCard=null;
          }
        }
        })
        cardStorage.set(card,null)
      }
}

function initCards(cardStorage:Map<HTMLDivElement,HTMLParagraphElement|null>,arr:number[]){
  for(let i=0;i<arr.length;i++)
    arr[i]=(i+1)*10+2
  cardStorage.forEach((p,card)=>{
    const cardContent=document.createElement("p")
    cardContent.classList.add("cardContent")
    arr=setCardContent(arr,cardContent)
    cardStorage.set(card,cardContent);
    cardContainer.appendChild(card);
  })
}
function resetCards(cardStorage:Map<HTMLDivElement,HTMLParagraphElement|null>){
  cardStorage.forEach((p,card)=>{
    if(card.classList.contains("visible"))
    {
      card.removeChild(p!)
      card.classList.remove("visible")
    }
  })
}

function createMap(n:number){
  let arr=new Array(n*n/2)
  let cardStorage=new Map<HTMLDivElement,HTMLParagraphElement|null>()
  createCards(cardStorage)
  initCards(cardStorage,arr)
  resetButton.addEventListener('click',()=>{
    startDate=Date.now()
    counter=0
    resetCards(cardStorage)
    initCards(cardStorage,arr)
    counterEl.innerText="0 cards found"
  })
}





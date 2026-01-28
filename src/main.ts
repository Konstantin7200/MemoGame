

const cardContainer=document.getElementById("cardContainer") as HTMLDivElement;
let n=4;

createMap(n)

function createMap(n:number){
  let arr=new Array(n*n/2)
  for(let i=0;i<arr.length;i++)
  arr[i]=(i+1)*10+2
  for(let i=0;i<n;i++)
    for(let j=0;j<n;j++)
    {
      const card=document.createElement("div");
      card.classList.add("card");
      card.id=`card${i}${j}`
      const cardText=document.createElement("p")

      let index=Math.round(Math.random()*arr.length)-1
      while(index<0)
        index=Math.round(Math.random()*arr.length)-1
      let num=arr[index]
      if(num%10==1)
        arr=arr.filter((el)=>el!==num)
      else arr[index]--;

      cardText.innerText=`${Math.floor(num/10)}`
      card.addEventListener('click',()=>{
        if(card.classList.contains("visible"))
        {
          card.classList.remove("visible")
          card.removeChild(cardText)
        }
        else{
          card.classList.add("visible")
          card.appendChild(cardText)
        }  
      })
    cardContainer.appendChild(card);
  }
}





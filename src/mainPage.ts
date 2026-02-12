
const buttons=document.querySelectorAll('button')
buttons.forEach(button => {
    button.addEventListener('click',()=>{
        window.location.href=`GameScreen.html?size=${parseInt(button.innerText)}`
    })
});
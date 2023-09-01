const modal = document.getElementById('modal');
var modalInput = document.getElementById('modal-input');

// window.addEventListener('load', ()=>{
//     modal.style.display = "block";
// })
modalInput.addEventListener('input', ()=>{
    if(modalInput.value.toLowerCase() ==='helen'
    || modalInput.value.toLowerCase() === 'елена'){
        modal.style.display = "none";
    }
})

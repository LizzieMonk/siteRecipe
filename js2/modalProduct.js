const modalSaveProduct = document.getElementById('modal-save-product');

const btnCancelModalSaveProduct = modalSaveProduct.querySelector('[name="btn-delete-product"]');
btnCancelModalSaveProduct.addEventListener('click', ()=>{
    modalSaveProduct.style.display = "none";
})
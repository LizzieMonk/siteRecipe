export function addElemLocalStorage(obj, keyNameProduct) {
    localStorage.setItem(keyNameProduct, JSON.stringify(obj));
    // localStorage.keyNameProduct = JSON.stringify(obj);
  
    let product = JSON.parse(localStorage.getItem(keyNameProduct));
    // let user = JSON.parse( localStorage.user );
}

export function deleteElemLocalStorage(key) {
    localStorage.removeItem(key);
}

export function deleteLocalStorageSumProducts(){
    for (let j = 0; j <localStorage.length; j++) {
      let key = localStorage.key(j);
      let product = JSON.parse(localStorage.getItem(key));
      if(product.nameProduct){
        deleteElemLocalStorage(key);
        j=0
      }
    }
}

export function deleteLocalStorageReport(){
    for (let j = 0; j <localStorage.length; j++) {
      let key = localStorage.key(j);
      let product = JSON.parse(localStorage.getItem(key));
      if(!product.nameProduct){
        deleteElemLocalStorage(key);
        // console.log(localStorage.length)
        j=0
      }
    }
}

// export function setSavedIngredient(option){
//     localStorage.setItem('isSavedIngredient', option);
// }
// export function getSavedIngredient(){
//     return localStorage.getItem('isSavedIngredient');
// }
export const colorPrimaryOne = "#B5FFE4";
export const colorPrimaryTwo = "#A4EDE4";
export const colorPrimaryThree = "#9ED0DE";
export const colorSecondaryOne = "#B9C6F5";
export const colorSecondaryTwo = "#D3BAFF";
export const colorSecondaryTree = "#F6B4FA";
export const colorWhite = "white";

export const roundPrimary = 1;
export const roundSecondary = 3;
export const roundWhole = 0;

export function roundN(number, count) {
    return Math.round(number * Math.pow(10, count)) / Math.pow(10, count);
}

export function navigationNav(nav){
    nav.addEventListener('click', (event)=>{
        console.log(event.target)
        if(event.target.classList.contains('btn_a-data')){
            document.location.href = './data.html'
        }
        else if(event.target.classList.contains('btn_a-sum')){
            document.location.href = './index.html'
        }
        else if(event.target.classList.contains('btn_a-report')){
            document.location.href = './report.html'
        }
    })
}

export function liveSearch(parent, search) {
    let listOfElems = parent.children;
    for (let i = 0; i < listOfElems.length; i++) {
      if (listOfElems[i].textContent.toLowerCase().includes(search.value.toLowerCase())) {
        listOfElems[i].style.display = "flex";
      } else listOfElems[i].style.display = "none";
    }
}

export function cleanList(list) {
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
  }

//---------------------------------пересмотреть логику
export let arrProductToXLSX =[];
export let arrSumToXLSX =[];
export let arrSumProductToXLSX =[];

export function setValueArrToXLSX(arr, index, value){
    // arrProductToXLSX[countArrProductToXLSX++] = arrElems[0];
    if(arr == 'arrProductToXLSX' ){
        arrProductToXLSX[index] = value
    }
    else if(arr == 'arrSumToXLSX'){
        arrSumToXLSX[index] = value
    }
    else if(arr == 'arrSumProductToXLSX'){
        arrSumProductToXLSX[index] = value
    }
    // arr[index] = value
}
export function deleteValueArrToXLSX(arr, index){
    // arrProductToXLSX[countArrProductToXLSX++] = arrElems[0];
    if(arr == 'arrProductToXLSX' ){
        arrProductToXLSX.splice(index, 1);
    }
    else if(arr == 'arrSumToXLSX' ){
        arrSumToXLSX.splice(index, 1);
    }
    else if(arr == 'arrSumProductToXLSX'){
        arrSumProductToXLSX.splice(index, 1);
    }
    // arr.splice(index, 1);
}
export function cleanArrToXLSX(arr){
    if(arr == 'arrProductToXLSX' ){
        arrProductToXLSX = [];
    }
    else if(arr == 'arrSumToXLSX' ){
        arrSumToXLSX = [];
    }
    else if(arr == 'arrSumProductToXLSX'){
        arrSumProductToXLSX = [];
    }
    // arr = [];
}
//----------------------------------------------------

export const CATEGORY = ['сырье', 'специи'];
export const SUBCATEGORY_PRIMARY = ['основные', 'непонятные'];
export const SUBCATEGORY_SECONDARY = ['природные', 'химозные', 'несъедобные'];

export function getCategoryByColor(color){  // return string
    if(colorPrimaryOne == color
        || colorPrimaryTwo == color
        || colorPrimaryThree == color){
        return CATEGORY[0]
    }
    else{
        return CATEGORY[1]
    }
}
export function getSubcategoryByColor(color){  //return string
    if(color == colorPrimaryTwo){
        return SUBCATEGORY_PRIMARY[0]
    }
    else if(color == colorPrimaryThree){
        return SUBCATEGORY_PRIMARY[1]
    }
    else if(color == colorSecondaryOne){
        return SUBCATEGORY_SECONDARY[0]
    }
    else if(color == colorSecondaryTwo){
        return SUBCATEGORY_SECONDARY[1]
    }
    else return SUBCATEGORY_SECONDARY[2]
}
export function getCategory(allIngredients, nameIngredient){  //return string
    for (let i=0; i<allIngredients.length; i++){
        if(allIngredients[i].name == nameIngredient){
            let color = allIngredients[i].color
            if(colorPrimaryOne == color || colorPrimaryTwo == color || colorPrimaryThree == color){
                return CATEGORY[0]
            }
            else{
                return CATEGORY[1]
            }
        }
    }
    return ''
}
export function getSubcategory(allIngredients, nameIngredient){  //return string
    for (let i=0; i<allIngredients.length; i++){
        if(allIngredients[i].name == nameIngredient){
            let color = allIngredients[i].color
            if(color == colorPrimaryTwo){
                return SUBCATEGORY_PRIMARY[0]
            }
            else if(color == colorPrimaryThree){
                return SUBCATEGORY_PRIMARY[1]
            }
            else if(color == colorSecondaryOne){
                return SUBCATEGORY_SECONDARY[0]
            }
            else if(color == colorSecondaryTwo){
                return SUBCATEGORY_SECONDARY[1]
            }
            else return SUBCATEGORY_SECONDARY[2]
        }
    }
    return ''
}
export function getSubcategoryByCategory(category){  //string
    if(category == CATEGORY[0]){ //сырье
        return SUBCATEGORY_PRIMARY
    } else return SUBCATEGORY_SECONDARY
}
export function getColorBySubcategory(subcategory){  //string
    if(subcategory == SUBCATEGORY_PRIMARY[0]){
        return colorPrimaryTwo
    }
    else if(subcategory == SUBCATEGORY_PRIMARY[1]){
        return colorPrimaryThree
    }
    else if(subcategory == SUBCATEGORY_SECONDARY[0]){
        return colorSecondaryOne
    }
    else if(subcategory == SUBCATEGORY_SECONDARY[1]){
        return colorSecondaryTwo;
    }
    else if(subcategory == SUBCATEGORY_SECONDARY[2]){
        return colorSecondaryTree
    }
    else colorPrimaryOne
}


export function getObjProduct(newElemListProduct){
    let addingProduct = newElemListProduct.querySelector('.adding-product');
    let name = addingProduct.querySelector('[name="name-new-product"]').value;
    let output = +addingProduct.querySelector('[name="output"]').value;
    let ingredients = addingProduct.querySelector('.adding-product__ingredients');
    ingredients = ingredients.children;
    let primary=[];
    let count = 0;
    let secondary=[];
    let count2=0;
    for(let i=2; i<ingredients.length; i++){
        let objArr  =  {
            nameIngredient: ingredients[i].querySelector('[name="search-ingredient"]').value,
            amount: +ingredients[i].querySelector('[name="number-ingredient"]').value
        }
       if(ingredients[i].querySelector('[name="search-category"]').value == CATEGORY[0]){ //сырье
            primary[count++] = objArr
       }
       else{
            secondary[count2++] = objArr
       }
    }
    let jsonprimary = JSON.stringify(primary)
    let jsonsecondary = JSON.stringify(secondary)

    let obj = {
        name: name,
        outputValue: output,
        ingredientsPrimary: jsonprimary,
        ingredientsSecondary: jsonsecondary,
    }
    return obj;
}
export function getObjIngredient(newElemListProduct){
    let addingIngredient = newElemListProduct.querySelector('.adding-ingredient')
    let oneIngredient = addingIngredient.querySelector('.adding-product__ingredient');
    let name = oneIngredient.querySelector('[name="search-ingredient"]').value;
    let subcategory = oneIngredient.querySelector('[name="search-subcategory"]').value

    let obj = {
        name: name,
        color: getColorBySubcategory(subcategory)
    }
    return obj;
}

export function isOpenModal (modal, option){
    if(option){
        modal.style.display = "block";
    }
    else{
      modal.style.display = "none";
    }
}

export function fillRowIngredientInProduct(oneIngredient, ingredient, allIngredients, ingredients){
    //объект копирования
    //обьект для заполнения строки поиска
    //объект для заполнения списка
    //список для удаления
    let newIngredient = oneIngredient.cloneNode(true);
    newIngredient.classList.remove('hidden')

    let searchIngredient = newIngredient.querySelector('[name="search-ingredient"]');
    searchIngredient.value = ingredient.nameIngredient;
    let selectIngredient = newIngredient.querySelector('[name="select-ingredient"]');

    let searchCategory = newIngredient.querySelector('[name="search-category"]');
    searchCategory.value = getCategory(allIngredients, ingredient.nameIngredient);
    searchCategory.disabled = true
    let selectCategory = newIngredient.querySelector('[name="select-category"]');

    let searchSubcategory = newIngredient.querySelector('[name="search-subcategory"]');
    searchSubcategory.value = getSubcategory(allIngredients, ingredient.nameIngredient);
    searchSubcategory.disabled = true
    let selectSubcategory = newIngredient.querySelector('[name="select-subcategory"]');

    //вывод всех ингредиентов
    // cleanList(listData);
    allIngredients.forEach((elem) => {
        let newOption = document.createElement("li");
        newOption.textContent = elem.name;
        selectIngredient.appendChild(newOption);

        newOption.addEventListener("mousedown", (e) => {
            searchIngredient.value = e.target.textContent;
            //при смене ингредиента меняем категорию
            searchCategory.value = getCategory(allIngredients, e.target.textContent);
            searchSubcategory.value = getSubcategory(allIngredients, e.target.textContent);
    });
    });
    //обработчик
    searchIngredient.addEventListener("focus", () => {
        // searchIngredient.value = "";
        liveSearch(selectIngredient, searchIngredient);
        selectIngredient.parentNode.classList.add('select-main')
    });
    searchIngredient.addEventListener("blur", () => {
        let listOfElems = selectIngredient.children;
        for (let i = 0; i < listOfElems.length; i++) {
            listOfElems[i].style.display = "none";
        }
        selectIngredient.parentNode.classList.remove('select-main')
    });
    searchIngredient.addEventListener("keyup", () => {
        liveSearch(selectIngredient, searchIngredient);
    });

    newIngredient.querySelector('[name="number-ingredient"]').value = ingredient.amount
    ingredients.appendChild(newIngredient);

    let deleteIngredient = newIngredient.querySelector('[name="btn-delete-ingredient"]')
    deleteIngredient.addEventListener('click', ()=>{
        ingredients.removeChild(newIngredient);
    })

}
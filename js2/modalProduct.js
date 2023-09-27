import {
    navigationNav,
    colorPrimaryOne,
    colorPrimaryTwo,
    colorPrimaryThree,
    colorSecondaryOne,
    colorSecondaryTwo,
    colorSecondaryTree,
    colorWhite,
    roundPrimary,
    roundSecondary,
    roundWhole,
    roundN,
    liveSearch,
    arrSumToXLSX,
  } from "./commonFunc.js";

  import {
    getDataIngredients,
    setDataProducts,
    getDataProducts,
  }from "../js2/software/supabase.js"


//модалка для добавления нового продукта
const modalSaveProduct = document.getElementById('modal-save-product');

window.addEventListener('load', ()=>{
    createNewElemListProducts();
})

// const btnCancelModalSaveProduct = modalSaveProduct.querySelector('[name="btn-delete-product"]');
// btnCancelModalSaveProduct.addEventListener('click', ()=>{
//     modalSaveProduct.style.display = "none";
// })

let nameNewProduct = modalSaveProduct.querySelector('[name="name-new-product"]');
nameNewProduct.value = '';
let output = modalSaveProduct.querySelector('[name="output"]');
output.value = 0;

async function createNewElemListProducts() {
    let ingredients = modalSaveProduct.querySelector('.adding-product__ingredients');
    let oneIngredient = ingredients.querySelector('.adding-product__ingredient');
    let allIngredients = await getDataIngredients();

    let ingredient = {
        amount: 0,
        nameIngredient: '',
    }
    fillRowIngredientInProduct(oneIngredient, ingredient, allIngredients, ingredients);

    const btnAddRowIngredient = modalSaveProduct.querySelector('[name="btn-add-row-ingredient"]')
    btnAddRowIngredient.addEventListener('click', ()=>{
        // let ingredient = {
        //     amount: '',
        //     nameIngredient: ''
        // }
        fillRowIngredientInProduct(oneIngredient, ingredient, allIngredients, ingredients);
    })

    const btnUpdateProduct = modalSaveProduct.querySelector('[name="btn-update-product"]')
    // btnUpdateProduct.addEventListener('click', async ()=>{
    //     let objProduct = getObjProduct(modalSaveProduct);
    //     console.log(objProduct);
    //     isOpenModalLoad(true);
    //     //здесь добавить проверку на наличие в ингредиентах ингредиента
    //     // await updateDataProducts(objProduct, elem.id);
    //     isOpenModalLoad(false);
    //     // addingProduct.style.display = 'none';
    // })

    const btnCancelModalSaveProduct = modalSaveProduct.querySelector('[name="btn-delete-product"]')
    btnCancelModalSaveProduct.addEventListener('click', ()=>{
        modalSaveProduct.style.display = 'none'
    })
}

export async function saveNewProductInSupabase(){
    let objProduct = await getObjProduct(modalSaveProduct);
    // console.log(objProduct);
    isOpenModalLoad(true);
    //сохранение в базу продукта
    //здесь добавить проверку на наличие в ингредиентах ингредиента
    await setDataProducts(objProduct);
    isOpenModalLoad(false);
    modalSaveProduct.style.display = 'none';
}

function fillRowIngredientInProduct(oneIngredient, ingredient, allIngredients, ingredients){
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

function getCategory(allIngredients, nameIngredient){  //string
    for (let i=0; i<allIngredients.length; i++){
        if(allIngredients[i].name == nameIngredient){
            let color = allIngredients[i].color
            if(colorPrimaryOne == color || colorPrimaryTwo == color || colorPrimaryThree == color){
                return 'сырье'
            }
            else{
                return 'специи'
            }
        }
    }
    return ''
}
function getSubcategory(allIngredients, nameIngredient){  //string
    for (let i=0; i<allIngredients.length; i++){
        if(allIngredients[i].name == nameIngredient){
            let color = allIngredients[i].color
            if(color == colorPrimaryTwo){
                return 'основные'
            }
            else if(color == colorPrimaryThree){
                return 'непонятные'
            }
            else if(color == colorSecondaryOne){
                return 'природные'
            }
            else if(color == colorSecondaryTwo){
                return 'химозные'
            }
            else return 'несъедобные'
        }
    }
    return ''
}
async function getObjProduct(newElemListProduct){
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
       if(ingredients[i].querySelector('[name="search-category"]').value == 'сырье'){
            primary[count++] = objArr
       }
       else{
            secondary[count2++] = objArr
       }
    }
    let jsonprimary = JSON.stringify(primary)
    let jsonsecondary = JSON.stringify(secondary)

    let dataProducts = await getDataProducts();

    let obj = {
        id: dataProducts.length+1,
        name: name,
        outputValue: output,
        ingredientsPrimary: jsonprimary,
        ingredientsSecondary: jsonsecondary,
    }
    return obj;
}

  //модалка для загрузки
  const modalLoad = document.getElementById('modal-load');
  function isOpenModalLoad(option){
    if(option){
      modalLoad.style.display = "block";
    }
    else{
      modalLoad.style.display = "none";
    }
  }
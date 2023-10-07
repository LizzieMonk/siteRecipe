import {
    navigationNav,
    colorPrimaryOne,
    colorPrimaryTwo,
    colorPrimaryThree,
    colorSecondaryOne,
    colorSecondaryTwo,
    colorSecondaryTree,
    colorWhite,
    liveSearch,
    isOpenModal,
    getCategory,
    getSubcategory,
    getObjProduct,
  } from "./commonFunc.js";

  import {
    getDataIngredients,
    setDataProducts,
    getDataProducts,
  }from "../js2/software/supabase.js"

//модалка для загрузки
const modalLoad = document.getElementById('modal-load');
//модалка для добавления нового продукта
const modalSaveProduct = document.getElementById('modal-save-product');

window.addEventListener('load', ()=>{
    createNewElemListProducts();
})


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
        color: '',
    }
    fillRowIngredientInProduct(oneIngredient, ingredient, allIngredients, ingredients);

    const btnAddRowIngredient = modalSaveProduct.querySelector('[name="btn-add-row-ingredient"]')
    btnAddRowIngredient.addEventListener('click', ()=>{
        fillRowIngredientInProduct(oneIngredient, ingredient, allIngredients, ingredients);
    })

    const btnUpdateProduct = modalSaveProduct.querySelector('[name="btn-update-product"]')

    const btnCancelModalSaveProduct = modalSaveProduct.querySelector('[name="btn-delete-product"]')
    btnCancelModalSaveProduct.addEventListener('click', ()=>{
        isOpenModal(modalSaveProduct,false);
    })
}

export async function saveNewProductInSupabase(){
    let objProduct = getObjProduct(modalSaveProduct);
    isOpenModal(modalLoad,true);
    //добавление айдишника
    let dataProducts = await getDataProducts();
    objProduct.id = dataProducts.length+1;
    //сохранение в базу продукта
    //здесь добавить проверку на наличие в ингредиентах ингредиента
    await setDataProducts(objProduct);
    isOpenModal(modalLoad,false);
    isOpenModal(modalSaveProduct,false);
    // modalSaveProduct.style.display = 'none';
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
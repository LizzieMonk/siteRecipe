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
    products,
  } from "../js/data.js";
//   import {
//     addElemLocalStorage,
//     deleteElemLocalStorage,
//     deleteLocalStorageSumProducts,
//     deleteLocalStorageReport
//   } from "../js2/software/storage.js";
  
import {
    updateSupabaseByLocalStorage,
    updatelLocalStorageBySupabase,
    getDataIngredients,
    setDataIngredients,
    getDataProducts,
    setDataProducts,
    updateDataProducts,
    updateDataIngredients,
    getDataReport,
    updateDataReport
  }from "../js2/software/supabase.js"

  import {
    saveNewIngredientInSupabase,
  } from "./modalIngrdient.js"

  let nav = document.querySelector(".nav");
  navigationNav(nav);

const CATEGORY = ['сырье', 'специи'];
const SUBCATEGORY_PRIMARY = ['основные', 'непонятные'];
const SUBCATEGORY_SECONDARY = ['природные', 'химозные', 'несъедобные'];


const listData = document.getElementById("list-data");
const elemListData = document.getElementById("elem-list-data");

const btnShowProducts = document.getElementById('btn-show-products');
const btnShowIngredients = document.getElementById('btn-show-ingredients');
const btnAddNewElem = document.getElementById('btn-add-new-elem');

let saveProductBool = true;

window.addEventListener('load', ()=>{
    cleanList(listData);
    createListWithAlIProducts()


    // createListWithAlIngredients()
    // updateSupabaseIngredients()
    // updateSupabaseProducts()
})

btnShowProducts.addEventListener('click', ()=>{
    btnShowProducts.classList.add('btn_download');
    btnShowIngredients.classList.remove('btn_download')
    saveProductBool = true;
    cleanList(listData);
    createListWithAlIProducts();
    btnAddNewElem.innerHTML = '+ Добавить новый продукт'
})
btnShowIngredients.addEventListener('click', ()=>{
    btnShowIngredients.classList.add('btn_download');
    btnShowProducts.classList.remove('btn_download')
    saveProductBool = false;
    cleanList(listData);
    createListWithAlIngredients()
    btnAddNewElem.innerHTML = '+ Добавить новый ингредиент'
})



 async function createListWithAlIProducts(){
    isOpenModalLoad(true)
    let data = await getDataProducts();
    // cleanList(listData);
        for (let i = 0; i < data.length; i++) {
            await createNewElemListProducts(data[i]);
        }
    isOpenModalLoad(false)
  }
 async function createListWithAlIngredients(){
    isOpenModalLoad(true)
    let data = await getDataIngredients();
    // cleanList(listData);
        for (let i = 0; i < data.length; i++) {
            createNewElemListIngredients(data[i]);
        }
    isOpenModalLoad(false)
  }
function cleanList(list) {
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
}

//---------------------------------
async function createNewElemListProducts(elem) {
    let newElemListProduct = elemListData .cloneNode(true);
    newElemListProduct.querySelector('[name="name-product"]').textContent = elem.name;
    newElemListProduct.querySelector('[name="value-product"]').textContent = elem.outputValue;
    listData.appendChild(newElemListProduct);

    //-------------------------------------------------------
    //первичная инициализация редактирования продукта
    let addingProduct = newElemListProduct.querySelector('.adding-product')
    addingProduct.style.display = 'none'

    newElemListProduct.querySelector('.ul__info').addEventListener('click', ()=>{
        if(addingProduct.style.display == 'none'){
            addingProduct.style.display = 'block'
        } else addingProduct.style.display = 'none'
    })

    let nameNewProduct = addingProduct.querySelector('[name="name-new-product"]');
    nameNewProduct.value = elem.name;
    let output = addingProduct.querySelector('[name="output"]');
    output.value = elem.outputValue;

    let ingredients = addingProduct.querySelector('.adding-product__ingredients');
    let oneIngredient = ingredients.querySelector('.adding-product__ingredient');

    let allIngredients = await getDataIngredients();
    let ingredientsPrimarySupabase = JSON.parse(elem.ingredientsPrimary)
    ingredientsPrimarySupabase.forEach((ingredient) => {
        fillRowIngredientInProduct(oneIngredient, ingredient, allIngredients, ingredients)
    });

    let ingredientsSecondarySupabase = JSON.parse(elem.ingredientsSecondary)
    ingredientsSecondarySupabase.forEach((ingredient) => {
        fillRowIngredientInProduct(oneIngredient, ingredient, allIngredients, ingredients)
    });


    const btnAddRowIngredient = addingProduct.querySelector('[name="btn-add-row-ingredient"]')
    btnAddRowIngredient.addEventListener('click', ()=>{
        let ingredient = {
            amount: '',
            nameIngredient: ''
        }
        fillRowIngredientInProduct(oneIngredient, ingredient, allIngredients, ingredients)
    })

    const btnUpdateProduct = addingProduct.querySelector('[name="btn-update-product"]')
    btnUpdateProduct.addEventListener('click', async ()=>{
        let objProduct = getObjProduct(newElemListProduct);
        isOpenModalLoad(true);
        //здесь добавить проверку на наличие в ингредиентах ингредиента
        await updateDataProducts(objProduct, elem.id);
        isOpenModalLoad(false);
        newElemListProduct.querySelector('[name="name-product"]').textContent = objProduct.name;
        newElemListProduct.querySelector('[name="value-product"]').textContent = objProduct.outputValue;
        addingProduct.style.display = 'none';
    })
    const btnDeleteProduct = addingProduct.querySelector('[name="btn-delete-product"]')
    btnDeleteProduct.addEventListener('click', ()=>{
        addingProduct.style.display = 'none'
    })
}
function getObjProduct(newElemListProduct){
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

    let obj = {
        name: name,
        outputValue: output,
        ingredientsPrimary: jsonprimary,
        ingredientsSecondary: jsonsecondary,
    }
    return obj;
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
//----------------------------------
function getSubcategoryByCategory(category){  //string
    if(category == CATEGORY[0]){ //сырье
        return SUBCATEGORY_PRIMARY
    } else return SUBCATEGORY_SECONDARY
}
function createNewElemListIngredients(elem) {
    let newElemListProduct = elemListData .cloneNode(true);
    newElemListProduct.querySelector('[name="name-product"]').textContent = elem.name;
    newElemListProduct.querySelector('[name="value-product"]').textContent = getCategoryByColor(elem.color)
    listData.appendChild(newElemListProduct);

    //-------------------------------------------------------
    //первичная инициализация редактирования продукта
    let addingIngredient = newElemListProduct.querySelector('.adding-ingredient')
    addingIngredient.style.display = 'none'

    newElemListProduct.querySelector('.ul__info').addEventListener('click', ()=>{
        if(addingIngredient.style.display == 'none'){
            addingIngredient.style.display = 'block'
        } else addingIngredient.style.display = 'none'
    })

    // let allIngredients = await getDataIngredients();
    let oneIngredient = addingIngredient.querySelector('.adding-product__ingredient');

    let searchIngredient = oneIngredient.querySelector('[name="search-ingredient"]');
    searchIngredient.value = elem.name;
    let selectIngredient = oneIngredient.querySelector('[name="select-ingredient"]');

    let searchCategory = oneIngredient.querySelector('[name="search-category"]');
    searchCategory.value = getCategoryByColor(elem.color);
    let selectCategory = oneIngredient.querySelector('[name="select-category"]');

    let searchSubcategory = oneIngredient.querySelector('[name="search-subcategory"]');
    searchSubcategory.value = getSubcategoryByColor(elem.color);
    let selectSubcategory = oneIngredient.querySelector('[name="select-subcategory"]');

    CATEGORY.forEach((elem)=>{
        let newOption = document.createElement("li");
        newOption.textContent = elem;
        selectCategory.appendChild(newOption);

        newOption.addEventListener("mousedown", (e) => {
            searchCategory.value = e.target.textContent;
            cleanList(selectSubcategory);
            let arrSubcategory = getSubcategoryByCategory(e.target.textContent)
            searchSubcategory.value = arrSubcategory[0]

            arrSubcategory.forEach((elemSec)=>{
                let newOptionSec = document.createElement("li");
                newOptionSec.textContent = elemSec;
                selectSubcategory.appendChild(newOptionSec);
        
                newOptionSec.addEventListener("mousedown", (eSec) => {
                    searchSubcategory.value = eSec.target.textContent;
            });
            })
        });
    })
    getSubcategoryByCategory(searchCategory.value).forEach((elem)=>{
        let newOption = document.createElement("li");
        newOption.textContent = elem;
        selectSubcategory.appendChild(newOption);

        newOption.addEventListener("mousedown", (e) => {
            searchSubcategory.value = e.target.textContent;
        });
    })

    //обработчик
    searchCategory.addEventListener("focus", () => {
        searchCategory.value = "";
        liveSearch(selectCategory, searchCategory);
    });
    searchCategory.addEventListener("blur", () => {
        let listOfElems = selectCategory.children;
        for (let i = 0; i < listOfElems.length; i++) {
            listOfElems[i].style.display = "none";
        }
        if(searchCategory.value == ""){
            searchCategory.value = getCategoryByColor(elem.color);
            searchSubcategory.value = getSubcategoryByColor(elem.color);
        }
    });
    searchCategory.addEventListener("keyup", () => {
        liveSearch(selectCategory, searchCategory);
    });

    //обработчик
    searchSubcategory.addEventListener("focus", () => {
        searchSubcategory.value = "";
        liveSearch(selectSubcategory, searchSubcategory);
    });
    searchSubcategory.addEventListener("blur", () => {
        let listOfElems = selectSubcategory.children;
        for (let i = 0; i < listOfElems.length; i++) {
            listOfElems[i].style.display = "none";
        }
        if(searchSubcategory.value == ""){
            searchSubcategory.value = getSubcategoryByColor(elem.color);
        }
    });
    searchSubcategory.addEventListener("keyup", () => {
        liveSearch(selectSubcategory, searchSubcategory);
    });

    const btnUpdateProduct = addingIngredient.querySelector('[name="btn-update-product"]')
    btnUpdateProduct.addEventListener('click', async ()=>{
        let objIngredient = getObjIngredient(newElemListProduct);
        isOpenModalLoad(true);
        await updateDataIngredients(objIngredient, elem.id);
        //обновление ингредиента во всех продуктах
        await updateAllProductByIngredient(elem.name, objIngredient);
        //добавить обновление в отчете
        await updateReportByIngredient(elem.name, objIngredient);

        isOpenModalLoad(false);
        newElemListProduct.querySelector('[name="name-product"]').textContent = objIngredient.name;
        newElemListProduct.querySelector('[name="value-product"]').textContent = getCategoryByColor(objIngredient.color)
        addingIngredient.style.display = 'none';
    })
    const btnDeleteProduct = addingIngredient.querySelector('[name="btn-delete-product"]')
    btnDeleteProduct.addEventListener('click', ()=>{
        addingIngredient.style.display = 'none'
    })
}
async function updateAllProductByIngredient(oldNameIngredient, objNewIngredient){
    console.log(oldNameIngredient)
    console.log(objNewIngredient.name)
    let data = await getDataProducts();
    for (let i = 0; i < data.length; i++) {
        let ingredientsPrimarySupabase = JSON.parse(data[i].ingredientsPrimary);
        let ingredientsSecondarySupabase = JSON.parse(data[i].ingredientsSecondary);

        for(let j=0; j<ingredientsPrimarySupabase.length; j++){
            if(ingredientsPrimarySupabase[j].nameIngredient == oldNameIngredient){
                // console.log(data[i])
                ingredientsPrimarySupabase[j].nameIngredient = objNewIngredient.name;

                let jsonPrimary = JSON.stringify(ingredientsPrimarySupabase)
                let jsonSecondary = JSON.stringify(ingredientsSecondarySupabase)

                let obj = {
                    name: data[i].name,
                    outputValue: data[i].outputValue,
                    ingredientsPrimary: jsonPrimary,
                    ingredientsSecondary: jsonSecondary,
                };
                // console.log(obj)
                await updateDataProducts(obj, data[i].id);
                break;
            }
        }
        for(let j=0; j<ingredientsSecondarySupabase.length; j++){
            if(ingredientsSecondarySupabase[j].nameIngredient == oldNameIngredient){
                // console.log(data[i])
                ingredientsSecondarySupabase[j].nameIngredient = objNewIngredient.name;

                let jsonPrimary = JSON.stringify(ingredientsPrimarySupabase)
                let jsonSecondary = JSON.stringify(ingredientsSecondarySupabase)

                let obj = {
                    name: data[i].name,
                    outputValue: data[i].outputValue,
                    ingredientsPrimary: jsonPrimary,
                    ingredientsSecondary: jsonSecondary,
                };
                // console.log(obj)
                await updateDataProducts(obj, data[i].id);
                break;
            }
        }
    }
}
async function updateReportByIngredient(oldNameIngredient, objNewIngredient){
    let data = await getDataReport();
    for (let j = 0; j < data.length; j++) {
        if(data[j].name == oldNameIngredient){
            data[j].name = objNewIngredient.name;
            data[j].color = objNewIngredient.color;

            let obj = {
                name: data[j].name,
                remainder: data[j].remainder,
                coming: data[j].coming,
                amount: data[j].amount,
                sum: data[j].sum,
                color: data[j].color,
            };
            // console.log(obj)
            await updateDataReport(obj, data[j].id);
            break;
        }
    }
}
function getCategoryByColor(color){  //string
    if(colorPrimaryOne == color || colorPrimaryTwo == color || colorPrimaryThree == color){
        return 'сырье'
    }
    else{
        return 'специи'
    }
}
function getSubcategoryByColor(color){  //string
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
function getObjIngredient(newElemListProduct){
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
function getColorBySubcategory(subcategory){  //string
    if(subcategory == 'основные'){
        return colorPrimaryTwo
    }
    else if(subcategory == 'непонятные'){
        return colorPrimaryThree
    }
    else if(subcategory == 'природные'){
        return colorSecondaryOne
    }
    else if(subcategory == 'химозные'){
        return colorSecondaryTwo;
    }
    else if(subcategory == 'несъедобные'){
        return colorSecondaryTree
    }
    else colorPrimaryOne
}




//----------------------------------
  export async function updateSupabaseProducts(){
    //заполнение базы хранилищем
    let id = 1; //значение id для создания следующего элемента
    for(let i=0; i<products.length; i++){
        // console.log(elem.ingredientsPrimary) //[{},{}...]
    let primary=[]
    let count = 0
    products[i].ingredientsPrimary.forEach((ingredientPrimary)=>{
        // console.log(ingredientPrimary) //{}
        let objArr  =  {
            amount: ingredientPrimary.amount,
            nameIngredient: ingredientPrimary.nameIngredient
        }
        // objArr = JSON.stringify(objArr)
        primary[count++] = objArr
    })
    let secondary=[]
    let count2=0
    products[i].ingredientsSecondary.forEach((ingredientPrimary)=>{
        // console.log(ingredientPrimary) //{}
        let objArr2  =  {
            amount: ingredientPrimary.amount,
            nameIngredient: ingredientPrimary.nameIngredient
        }
        // objArr2 = JSON.stringify(objArr2)
        secondary[count2++] = objArr2
    })
    let jsonprimary = JSON.stringify(primary)
    let jsonsecondary = JSON.stringify(secondary)

    // let idObj = id++;  //либо products[i].id
    let idObj = products[i].id;
    let obj = {
        id: idObj,
        name: products[i].name,
        outputValue: products[i].outputValue,
        ingredientsPrimary: jsonprimary,
        ingredientsSecondary: jsonsecondary,
    };
    console.log(obj)
    await setDataProducts(obj);
    }

    // let innerObj= {
    //     amout: 100,
    //     nameIngredient: "ingredient"
    // };

    // let primary = [
    //     innerObj, innerObj
    // ]
    // // console.log(primary)
    // let JSONprimary = JSON.stringify(primary)
    // console.log(JSONprimary)
    



    // // let idObj = id++;
    // let idObj = 5;
    // let obj = {
    //     id: idObj,
    //     name: "name",
    //     outputValue: 100,
    //     ingredientsPrimary: JSONprimary,
    //     ingredientsSecondary: JSONprimary,
    // };
    // console.log(obj)

    // await setDataProducts(obj);

}
  export async function updateSupabaseIngredients(){
    // isOpenModalLoad(true)

    //заполнение базы хранилищем
    let id = 1; //значение id для создания следующего элемента
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let product = JSON.parse(localStorage.getItem(key));
        if(!product.nameProduct){
          let idObj = id++;
          let obj = {
            id: idObj,
            name: product.name,
            color: product.color,
          };
          await setDataIngredients(obj);
        }
    }
    // isOpenModalLoad(false)
}

//РЕАЛИЗАЦИЯ ПОИСКА
let search = document.getElementById("data-search");

search.addEventListener("focus", () => {
  search.value = "";
  liveSearch(listData, search);
});
search.addEventListener("keyup", () => {
  liveSearch(listData, search);
});

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

  //модалка добавление продукта
  const modalSaveProduct = document.getElementById('modal-save-product');
  const modalSaveIngredient = document.getElementById('modal-save-ingredient');
  let btnUpdateProduct = modalSaveIngredient.querySelector('[name="btn-update-product"]');

  btnAddNewElem.addEventListener('click', ()=>{
    if(saveProductBool){
        modalSaveProduct.style.display = "block";
        btnUpdateProduct = modalSaveProduct.querySelector('[name="btn-update-product"]');
    }
    else {
        modalSaveIngredient.style.display = "block";
        btnUpdateProduct = modalSaveIngredient.querySelector('[name="btn-update-product"]');
    }
  })


//модалка для добавление нового ингредиента

btnUpdateProduct.addEventListener('click', async ()=>{
  //сохранение в базу
  await saveNewIngredientInSupabase ();
  //обновление списка
  cleanList(listData);
  createListWithAlIngredients();
//   await createListWithAllIngredients();
})
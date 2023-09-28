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
    CATEGORY,
    SUBCATEGORY_PRIMARY,
    SUBCATEGORY_SECONDARY,
    getCategoryByColor,
    getSubcategoryByColor,
    getCategory,
    getSubcategory,
    getSubcategoryByCategory,
    getColorBySubcategory,
    getObjProduct,
    getObjIngredient,
    isOpenModal,
    cleanList,
    fillRowIngredientInProduct,
  } from "./commonFunc.js";
  
  import {
    products,
  } from "../js/data.js";
  
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
    updateDataReport,
    getDataSum,
    updateDataSum
  }from "../js2/software/supabase.js"

  import {
    saveNewIngredientInSupabase,
  } from "./modalIngrdient.js"
  import {
    saveNewProductInSupabase,
  } from "./modalProduct.js"

  let nav = document.querySelector(".nav");
  navigationNav(nav);

//модалка для загрузки
const modalLoad = document.getElementById('modal-load');

const listData = document.getElementById("list-data");
const elemListData = document.getElementById("elem-list-data");

const btnShowProducts = document.getElementById('btn-show-products');
const btnShowIngredients = document.getElementById('btn-show-ingredients');
const btnAddNewElem = document.getElementById('btn-add-new-elem');

let saveProductBool = true;


window.addEventListener('load', ()=>{
    cleanList(listData);
    createListWithAlIProducts();

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
    createListWithAlIngredients();
    btnAddNewElem.innerHTML = '+ Добавить новый ингредиент'
})



 async function createListWithAlIProducts(){
    isOpenModal(modalLoad, true);
    // isOpenModalLoad(true)
    let data = await getDataProducts();
    // cleanList(listData);
        for (let i = 0; i < data.length; i++) {
            await createNewElemListProducts(data[i]);
        }
    isOpenModal(modalLoad, false);
    // isOpenModalLoad(false)
  }
 async function createListWithAlIngredients(){
    isOpenModal(modalLoad, true);
    // isOpenModalLoad(true)
    let data = await getDataIngredients();
    // cleanList(listData);
        for (let i = 0; i < data.length; i++) {
            createNewElemListIngredients(data[i]);
        }
    isOpenModal(modalLoad,false);
    // isOpenModalLoad(false)
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
            amount: 0,
            nameIngredient: ''
        }
        fillRowIngredientInProduct(oneIngredient, ingredient, allIngredients, ingredients)
    })

    const btnUpdateProduct = addingProduct.querySelector('[name="btn-update-product"]')
    btnUpdateProduct.addEventListener('click', async ()=>{
        let objProduct = getObjProduct(newElemListProduct);
        isOpenModal(modalLoad, true);
        //здесь добавить проверку на наличие в ингредиентах ингредиента
        await updateDataProducts(objProduct, elem.id);
        isOpenModal(modalLoad, false);
        newElemListProduct.querySelector('[name="name-product"]').textContent = objProduct.name;
        newElemListProduct.querySelector('[name="value-product"]').textContent = objProduct.outputValue;
        addingProduct.style.display = 'none';
    })
    const btnDeleteProduct = addingProduct.querySelector('[name="btn-delete-product"]')
    btnDeleteProduct.addEventListener('click', ()=>{
        addingProduct.style.display = 'none'
    })
}

//----------------------------------
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
        isOpenModal(modalLoad, true);
        //обновление ингредиента в базе
        await updateDataIngredients(objIngredient, elem.id);
        //обновление ингредиента во всех продуктах
        await updateAllProductByIngredient(elem.name, objIngredient);
        //обновление в отчете
        await updateReportByIngredient(elem.name, objIngredient);  //async
        //обновление в сумме
        await updateSumByIngredient(elem.name, objIngredient);  //async


        isOpenModal(modalLoad, false);
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
    // console.log(oldNameIngredient);
    // console.log(objNewIngredient.name);
    let dataProducts = await getDataProducts();
    let dataIngredients = await getDataIngredients();
    //перебираем объекты-продукты
    for (let i = 0; i < dataProducts.length; i++) {
        let ingredientsPrimarySupabase = JSON.parse(dataProducts[i].ingredientsPrimary);
        let ingredientsSecondarySupabase = JSON.parse(dataProducts[i].ingredientsSecondary);
        let allIngredients = [...ingredientsPrimarySupabase, ...ingredientsSecondarySupabase];
        let primary=[];
        let count = 0;
        let secondary=[];
        let count2=0;

        for(let j=0; j<allIngredients.length; j++){
            if(allIngredients[j].nameIngredient == oldNameIngredient){
                allIngredients[j].nameIngredient = objNewIngredient.name;
            }
            // else break;
            let objArr  =  {
                nameIngredient: allIngredients[j].nameIngredient,
                amount: allIngredients[j].amount,
            }
            if(getCategory(dataIngredients,allIngredients[j].nameIngredient) == CATEGORY[0]){ //сырье
                primary[count++] = objArr
            }
            else{
                secondary[count2++] = objArr
            }
        }
        let jsonprimary = JSON.stringify(primary);
        let jsonsecondary = JSON.stringify(secondary);

        let obj = {
            name: dataProducts[i].name,
            outputValue: dataProducts[i].outputValue,
            ingredientsPrimary: jsonprimary,
            ingredientsSecondary: jsonsecondary,
        }

        //здесь добавить проверку на наличие в ингредиентах ингредиента
        await updateDataProducts(obj, dataProducts[i].id);


        // for(let j=0; j<ingredientsPrimarySupabase.length; j++){
        //     if(ingredientsPrimarySupabase[j].nameIngredient == oldNameIngredient){

        //         ingredientsPrimarySupabase[j].nameIngredient = objNewIngredient.name;

        //         let jsonPrimary = JSON.stringify(ingredientsPrimarySupabase)
        //         let jsonSecondary = JSON.stringify(ingredientsSecondarySupabase)

        //         let obj = {
        //             name: data[i].name,
        //             outputValue: data[i].outputValue,
        //             ingredientsPrimary: jsonPrimary,
        //             ingredientsSecondary: jsonSecondary,
        //         };
        //         // console.log(obj)
        //         await updateDataProducts(obj, data[i].id);
        //         break;
        //     }
        // }
        // for(let j=0; j<ingredientsSecondarySupabase.length; j++){
        //     if(ingredientsSecondarySupabase[j].nameIngredient == oldNameIngredient){
        //         // console.log(data[i])
        //         ingredientsSecondarySupabase[j].nameIngredient = objNewIngredient.name;

        //         let jsonPrimary = JSON.stringify(ingredientsPrimarySupabase)
        //         let jsonSecondary = JSON.stringify(ingredientsSecondarySupabase)

        //         let obj = {
        //             name: data[i].name,
        //             outputValue: data[i].outputValue,
        //             ingredientsPrimary: jsonPrimary,
        //             ingredientsSecondary: jsonSecondary,
        //         };
        //         // console.log(obj)
        //         await updateDataProducts(obj, data[i].id);
        //         break;
        //     }
        // }
    }
}
async function updateSumByIngredient(oldNameIngredient, objNewIngredient){
    let data = await getDataSum();
    for (let j = 0; j < data.length; j++) {
        if(data[j].nameIngredient == oldNameIngredient){
            data[j].nameIngredient = objNewIngredient.name;
            data[j].color = objNewIngredient.color;

            let obj = {
                nameIngredient: data[j].nameIngredient,
                amount: data[j].amount,
                color: data[j].color,
            };
            await updateDataSum(obj, data[j].id);
            break;
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
    isOpenModal(modalLoad, true);
    // isOpenModalLoad(true)

    //массив всех ингредиентов
    let arrForAddingInSupabse = []
    let countArrForAdding =0;

    let data = await getDataProducts();
    //перебор массива продуктов
    for(let i=0; i<data.length; i++){

        //массив сырья продуктА
        let ingredientsPrimryNotJSON = JSON.parse(data[i].ingredientsPrimary);
        for(let j=0; j<ingredientsPrimryNotJSON.length; j++){
            let repeat = false;
           for(let k=0; k<arrForAddingInSupabse.length; k++){
            if(ingredientsPrimryNotJSON[j].nameIngredient == arrForAddingInSupabse[k]){
                repeat = true;
                break;
            }
           }
           if(!repeat){
                arrForAddingInSupabse[countArrForAdding++] = ingredientsPrimryNotJSON[j].nameIngredient;
           }
        }

        //массив специй продуктА
        let ingredientsSecondaryNotJSON = JSON.parse(data[i].ingredientsSecondary);
        for(let j=0; j<ingredientsSecondaryNotJSON.length; j++){
            let repeat = false;
            for(let k=0; k<arrForAddingInSupabse.length; k++){
             if(ingredientsSecondaryNotJSON[j].nameIngredient == arrForAddingInSupabse[k]){
                repeat = true;
                break;
             }
            }
            if(!repeat){
                arrForAddingInSupabse[countArrForAdding++] = ingredientsSecondaryNotJSON[j].nameIngredient;
            }
        }
    }

    // //перебор массива хранилища
    // for(let i=0; i<localStorage.length; i++){
    //     let key = localStorage.key(i);
    //     let product = JSON.parse(localStorage.getItem(key));
    //     if(product.name){
    //         let repeat = false;
    //         for(let k=0; k<arrForAddingInSupabse.length; k++){
    //          if(product.name == arrForAddingInSupabse[k]){
    //             repeat = true;
    //             break;
    //          }
    //         }
    //         if(!repeat){
    //             arrForAddingInSupabse[countArrForAdding++] = product.name;
    //         }
    //     }
    // }

    let report = await getDataReport();
    //перебор отчета
    for(let i=0; i<report.length; i++){
        let repeat = false;
        for(let k=0; k<arrForAddingInSupabse.length; k++){
            if(report[i].name == arrForAddingInSupabse[k]){
               repeat = true;
               break;
            }
           }
           if(!repeat){
               arrForAddingInSupabse[countArrForAdding++] = report[i].name;
           }
    }

    //все ингредиенты
    console.log(arrForAddingInSupabse);
    console.log('продукты+отчет: ',arrForAddingInSupabse.length);

    //нахождение тех ингредиентов, которых нет в базе, но есть в расчетах
    let allIngredients = await getDataIngredients();
    for(let i=0; i<allIngredients.length; i++){
        // console.log(allIngredients[i].name);
        for(let j=0; j<arrForAddingInSupabse.length; j++){
            if(allIngredients[i].name == arrForAddingInSupabse[j]){
                arrForAddingInSupabse.splice(j,1)
                // break;
            }
        }
    }

    console.log('ингредиенты в базе: ',allIngredients.length)

     //все ингредиенты
     console.log(arrForAddingInSupabse);
     console.log(arrForAddingInSupabse.length);


    // //заполнение базы хранилищем
    // let id = 1; //значение id для создания следующего элемента
    // for (let i = 0; i < localStorage.length; i++) {
    //     let key = localStorage.key(i);
    //     let product = JSON.parse(localStorage.getItem(key));
    //     if(!product.nameProduct){
    //       let idObj = id++;
    //       let obj = {
    //         id: idObj,
    //         name: product.name,
    //         color: product.color,
    //       };
    //       await setDataIngredients(obj);
    //     }
    // }
    isOpenModal(modalLoad, false);
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

  //модалка для добавления нового ингредиента/продукта
  const modalSaveProduct = document.getElementById('modal-save-product');
  const modalSaveIngredient = document.getElementById('modal-save-ingredient');
  let btnUpdateProduct = modalSaveIngredient.querySelector('[name="btn-update-product"]');

  btnAddNewElem.addEventListener('click', ()=>{
    if(saveProductBool){
        isOpenModal(modalSaveProduct,true);
        // modalSaveProduct.style.display = "block";
        btnUpdateProduct = modalSaveProduct.querySelector('[name="btn-update-product"]');
    }
    else {
        isOpenModal(modalSaveIngredient, true);
        // modalSaveIngredient.style.display = "block";
        btnUpdateProduct = modalSaveIngredient.querySelector('[name="btn-update-product"]');
    }
  })

  btnUpdateProduct.addEventListener('click', async ()=>{
    if(saveProductBool){
        //продукт
        //сохранение в базу
        await saveNewProductInSupabase();
        //обновление списка
        cleanList(listData);
        await createListWithAlIProducts();
    }
    else {
        //ингредиент
        //сохранение в базу
        await saveNewIngredientInSupabase();
        //обновление списка
        cleanList(listData);
        await createListWithAlIngredients();
    }
  })
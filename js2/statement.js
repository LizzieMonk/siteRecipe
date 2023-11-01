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
    cleanList,
    isOpenModal,
  } from "./commonFunc.js";

import {
    addElemLocalStorage,
    deleteElemLocalStorage
} from "./software/storage.js";

import {
    getDataStatement,
    updatelLocalStorageBySupabaseStatement
} from "./software/supabase.js";

let nav = document.querySelector(".nav");
navigationNav(nav);

// const btnStatementCleanList = document.getElementById("btn-statement-clean-list");
// const btnStatementUpdateReport = document.getElementById("btn-statement-update-report");
// const btnStatementAddNewProduct = document.getElementById("btn-statement-add-new-product");
const btnExportSupabase = document.getElementById("btn-export-supabase");
const btnExportStatement = document.getElementById("btn-export-statement");

// //модалка для добавления нового ингредиента/продукта
// const modalSaveProduct = document.getElementById('modal-save-product');


const listStatement = document.getElementById("list-statement");
const elemListStatement = document.getElementById("elem-list-statement");

let divide = 3;



// btnStatementAddNewProduct.addEventListener('click', ()=>{
//     isOpenModal(modalSaveProduct,true);
// })

// btnStatemenDivideSecTwo.addEventListener('click', ()=>{
//     btnStatemenDivideSecTwo.classList.add('btn_download');
//     btnStatemenDivideSecThree.classList.remove('btn_download')
//     divide=2;
//     updateLocalStorageByDivide()
// })


window.addEventListener('load', async ()=>{
    await updatelLocalStorageBySupabaseStatement();

    // // cleanList(listReport);
    createNewElemList();


    // // updateLocalStorageByDivide();
})

export function createNewElemList() {
    let arrProductsClone = [];
    let countArrProductsClone = 0;
    //глубокое копирование хранилища
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let product = JSON.parse(localStorage.getItem(key));
      if(product.nameProductStatement){
        arrProductsClone[countArrProductsClone++] = structuredClone(product);
      }
    }

    // //сортировка по алфавиту
    arrProductsClone.sort((a, b) => (a.nameProductStatement > b.nameProductStatement ? 1 : -1));
    //вывод списка с хранилища
    for (let i = 0; i < arrProductsClone.length; i++) {
        addInList(arrProductsClone[i]);
    }
}

function addInList(product) {
    let newElemListStatement = elemListStatement.cloneNode(true);
    newElemListStatement.querySelector('[name="name-product"]').textContent = product.nameProductStatement;

    let ingrPrimaryNotJSON = JSON.parse(product.ingredientsPrimary)
    // console.log(ingrPrimaryNotJSON);
    let ingrSecondaryNotJSON = JSON.parse(product.ingredientsSecondary)
    // console.log(ingrSecondaryNotJSON);

    // [
    // {
    // nameIngredient:"мясо",
    // "mon":0,
    // "tue":0,
    // "wed":0,
    // "thu":0,
    // "fri":0,
    // "sat":0,
    // },

    // {
    // "sum":0
    // }
    // ]


    let elemListIngrPrimary = newElemListStatement.querySelector('.ul-statement__info-primary');
    let elemListIngrSecondary = newElemListStatement.querySelector('.ul-statement__info-secondary');

    let innerFuncEvent = (e)=>{
        let sumPrimaryIngredients = elemListIngrPrimary.parentElement.parentElement.querySelector('[name="sum"]');
        //ОБНОВЛЕНИЕ НА ЭКРАНЕ
        //при изменении любого числа пересчитываем сумму
        //перебор всех основных
        let allPrimary = elemListIngrPrimary.parentElement;
        let allIngrPrimary = allPrimary.children;
        let sum =0;
        for(let i=0; i<allIngrPrimary.length; i++){
            sum += roundN(
                Number(allIngrPrimary[i].querySelector('[name="mon"]').value) +
                Number(allIngrPrimary[i].querySelector('[name="tue"]').value) +
                Number(allIngrPrimary[i].querySelector('[name="wed"]').value) +
                Number(allIngrPrimary[i].querySelector('[name="thu"]').value) +
                Number(allIngrPrimary[i].querySelector('[name="fri"]').value) +
                Number(allIngrPrimary[i].querySelector('[name="sat"]').value)
                ,3);
        }
        sumPrimaryIngredients.value = sum;
    
        // sumPrimaryIngredients.value =
        // roundN(
        //     Number(newElemListIngrPrimary.querySelector('[name="mon"]').value) +
        //     Number(newElemListIngrPrimary.querySelector('[name="tue"]').value) +
        //     Number(newElemListIngrPrimary.querySelector('[name="wed"]').value) +
        //     Number(newElemListIngrPrimary.querySelector('[name="thu"]').value) +
        //     Number(newElemListIngrPrimary.querySelector('[name="fri"]').value) +
        //     Number(newElemListIngrPrimary.querySelector('[name="sat"]').value)
        // ,3);
    
    
        //перебор всех второстепенных
        let allSecondary = elemListIngrSecondary.parentElement;
        let allIngrSecondary = allSecondary.children;
        for(let i=0; i<allIngrSecondary.length; i++){
            //лоток+пакет
            if(allIngrSecondary.length>2){
                for(let j=0; j<allIngrPrimary.length; j++){
                    if(allIngrPrimary[j].querySelector('[name="name-ingr"]').textContent.includes(allIngrSecondary[i].querySelector('[name="name-ingr"]').textContent)){
                        let sumOnePrimryIngr =roundN(
                            Number(allIngrPrimary[j].querySelector('[name="mon"]').value) +
                            Number(allIngrPrimary[j].querySelector('[name="tue"]').value) +
                            Number(allIngrPrimary[j].querySelector('[name="wed"]').value) +
                            Number(allIngrPrimary[j].querySelector('[name="thu"]').value) +
                            Number(allIngrPrimary[j].querySelector('[name="fri"]').value) +
                            Number(allIngrPrimary[j].querySelector('[name="sat"]').value)
                            ,3);;
                        allIngrSecondary[i].querySelector('[name="sum"]').value =
                        roundN(
                        sumOnePrimryIngr /
                        Number(allIngrSecondary[i].querySelector('[name="divider"]').value)
                        ,roundWhole);
                        break;
                    }
                }
            }
            //только пакет
            else{
                allIngrSecondary[i].querySelector('[name="sum"]').value =
                roundN(
                    sum /
                    Number(allIngrSecondary[i].querySelector('[name="divider"]').value)
                ,roundWhole);
            }
        }
    
        // let secondaryIngrs = elemListIngrSecondary.parentElement.children
        // for(let i=0; i<secondaryIngrs.length; i++){
        //     // console.log(secondaryIngrs[i])
        //     secondaryIngrs[i].querySelector('[name="sum"]').value =
        //     roundN(
        //         Number(newElemListIngrPrimary.querySelector('[name="sum"]').value) /
        //         divide
        //     ,roundWhole)
        // }
    
        //это переделать!!!!
        // for (let j = 0; j < localStorage.length; j++) {
        //     let key = localStorage.key(j);
        //     if (key === newElemListStatement.querySelector('[name="name-product"]').textContent) {
        //       //получение значений продукта
        //       let product = JSON.parse(localStorage.getItem(key));
        //     //   console.log(product)
        //     //   console.log(e.target.name)
        //     //   console.log(e.target.value)
        //     //   console.log(e.target.parentElement)
    
    
        //     let ingrPriNotJSON = JSON.parse(product.ingredientsPrimary)
        //     //обновление изменяемого ингредиента
        //     for(let k =0; k<ingrPriNotJSON.length; k++){
        //         if(ingrPriNotJSON[k].nameIngredient == newElemListIngrPrimary.querySelector('[name="name-ingr"]').textContent){
        //             ingrPriNotJSON[k][`${e.target.name}`] = +e.target.value;
        //             // ingrPriNotJSON[k].sum = +e.target.parentElement.querySelector('[name="sum"]').value
        //             break
        //         }
        //     }
        //     //обновление суммы
        //     for(let k =0; k<ingrPriNotJSON.length; k++){
        //         if(ingrPriNotJSON[k].sum){
        //             ingrPriNotJSON[k].sum =
        //             +e.target.parentElement.parentElement.parentElement.querySelector('[name="sum"]').value;
        //             break
        //         }
        //     }
        //     let ingrPrimary = JSON.stringify(ingrPriNotJSON);
    
    
        //     let ingrSecNotJSON = JSON.parse(product.ingredientsSecondary);
        //     for(let k =0; k<ingrSecNotJSON.length; k++){
        //         for(let l=0; l<allIngrSecondary.length; l++){
        //             if(ingrSecNotJSON[k].nameIngredient == allIngrSecondary[l].querySelector('[name="name-ingr"]').textContent){
        //                 ingrSecNotJSON[k].sum = +allIngrSecondary[l].querySelector('[name="sum"]').value;
        //                 ingrSecNotJSON[k].divider = +allIngrSecondary[l].querySelector('[name="divider"]').value;
        //             }
        //         }
        //     }
    
        //     // let listOfSecIngr = newElemListStatement.querySelectorAll('.ul-statement__info-secondary');
        //     // for(let k = 1; k<listOfSecIngr.length; k++){
        //     //     for(let l=0; l<ingrSecNotJSON.length; l++){
        //     //         if(ingrSecNotJSON[l].nameIngredient == listOfSecIngr[k].querySelector('[name="name-ingr"]').textContent){
        //     //             ingrSecNotJSON[l].sum = +listOfSecIngr[k].querySelector('[name="sum"]').value;
        //     //         }
        //     //     }
        //     // }
        //     let ingrSecondary = JSON.stringify(ingrSecNotJSON);
    
    
        //     let keyNameProduct = product.nameProductStatement;
        //     let obj = {
        //         nameProductStatement: product.nameProductStatement,
        //         ingredientsPrimary: ingrPrimary,
        //         ingredientsSecondary: ingrSecondary,
        //       };
        //       addElemLocalStorage(obj, keyNameProduct);
    
        //     console.log(obj)
        //     break;
        //     }
        // }
    
    }

    ingrPrimaryNotJSON.forEach(ingredient => {
        let sumPrimaryIngredients = elemListIngrPrimary.parentElement.parentElement.querySelector('[name="sum"]');
        if(ingredient.hasOwnProperty('sum')){
            sumPrimaryIngredients.value = ingredient.sum;
        }
        else{
        let newElemListIngrPrimary = elemListIngrPrimary.cloneNode(true);
        newElemListIngrPrimary.querySelector('[name="name-ingr"]').textContent = ingredient.nameIngredient;
        newElemListIngrPrimary.querySelector('[name="mon"]').value = ingredient.mon;
        newElemListIngrPrimary.querySelector('[name="tue"]').value = ingredient.tue;
        newElemListIngrPrimary.querySelector('[name="wed"]').value = ingredient.wed;
        newElemListIngrPrimary.querySelector('[name="thu"]').value = ingredient.thu;
        newElemListIngrPrimary.querySelector('[name="fri"]').value = ingredient.fri;
        newElemListIngrPrimary.querySelector('[name="sat"]').value = ingredient.sat;
        newElemListIngrPrimary.classList.remove('hidden');
        elemListIngrPrimary.parentElement.appendChild(newElemListIngrPrimary);

        // let innerFuncEvent = (e)=>{
        //     //ОБНОВЛЕНИЕ НА ЭКРАНЕ
        //     //при изменении любого числа пересчитываем сумму
        //     //перебор всех основных
        //     let allPrimary = elemListIngrPrimary.parentElement;
        //     let allIngrPrimary = allPrimary.children;
        //     let sum =0;
        //     for(let i=0; i<allIngrPrimary.length; i++){
        //         sum += roundN(
        //             Number(allIngrPrimary[i].querySelector('[name="mon"]').value) +
        //             Number(allIngrPrimary[i].querySelector('[name="tue"]').value) +
        //             Number(allIngrPrimary[i].querySelector('[name="wed"]').value) +
        //             Number(allIngrPrimary[i].querySelector('[name="thu"]').value) +
        //             Number(allIngrPrimary[i].querySelector('[name="fri"]').value) +
        //             Number(allIngrPrimary[i].querySelector('[name="sat"]').value)
        //             ,3);
        //     }
        //     sumPrimaryIngredients.value = sum;

        //     // sumPrimaryIngredients.value =
        //     // roundN(
        //     //     Number(newElemListIngrPrimary.querySelector('[name="mon"]').value) +
        //     //     Number(newElemListIngrPrimary.querySelector('[name="tue"]').value) +
        //     //     Number(newElemListIngrPrimary.querySelector('[name="wed"]').value) +
        //     //     Number(newElemListIngrPrimary.querySelector('[name="thu"]').value) +
        //     //     Number(newElemListIngrPrimary.querySelector('[name="fri"]').value) +
        //     //     Number(newElemListIngrPrimary.querySelector('[name="sat"]').value)
        //     // ,3);


        //     //перебор всех второстепенных
        //     let allSecondary = elemListIngrSecondary.parentElement;
        //     let allIngrSecondary = allSecondary.children;
        //     for(let i=0; i<allIngrSecondary.length; i++){
        //         //лоток+пакет
        //         if(allIngrSecondary.length>2){
        //             for(let j=0; j<allIngrPrimary.length; j++){
        //                 if(allIngrPrimary[j].querySelector('[name="name-ingr"]').value.includes(allIngrSecondary[i].querySelector('[name="name-ingr"]').value)){
        //                     let sumOnePrimryIngr =roundN(
        //                         Number(allIngrPrimary[j].querySelector('[name="mon"]').value) +
        //                         Number(allIngrPrimary[j].querySelector('[name="tue"]').value) +
        //                         Number(allIngrPrimary[j].querySelector('[name="wed"]').value) +
        //                         Number(allIngrPrimary[j].querySelector('[name="thu"]').value) +
        //                         Number(allIngrPrimary[j].querySelector('[name="fri"]').value) +
        //                         Number(allIngrPrimary[j].querySelector('[name="sat"]').value)
        //                         ,3);;
        //                     allIngrSecondary[i].querySelector('[name="sum"]').value =
        //                     roundN(
        //                     sumOnePrimryIngr /
        //                     Number(allIngrSecondary[i].querySelector('[name="divider"]').value)
        //                     ,roundWhole);
        //                     break;
        //                 }
        //             }
        //         }
        //         //только пакет
        //         else{
        //             allIngrSecondary[i].querySelector('[name="sum"]').value =
        //             roundN(
        //                 sum /
        //                 Number(allIngrSecondary[i].querySelector('[name="divider"]').value)
        //             ,roundWhole);
        //         }
        //     }

        //     // let secondaryIngrs = elemListIngrSecondary.parentElement.children
        //     // for(let i=0; i<secondaryIngrs.length; i++){
        //     //     // console.log(secondaryIngrs[i])
        //     //     secondaryIngrs[i].querySelector('[name="sum"]').value =
        //     //     roundN(
        //     //         Number(newElemListIngrPrimary.querySelector('[name="sum"]').value) /
        //     //         divide
        //     //     ,roundWhole)
        //     // }

        //     for (let j = 0; j < localStorage.length; j++) {
        //         let key = localStorage.key(j);
        //         if (key === newElemListStatement.querySelector('[name="name-product"]').textContent) {
        //           //получение значений продукта
        //           let product = JSON.parse(localStorage.getItem(key));
        //         //   console.log(product)
        //         //   console.log(e.target.name)
        //         //   console.log(e.target.value)
        //         //   console.log(e.target.parentElement)


        //         let ingrPriNotJSON = JSON.parse(product.ingredientsPrimary)
        //         //обновление изменяемого ингредиента
        //         for(let k =0; k<ingrPriNotJSON.length; k++){
        //             if(ingrPriNotJSON[k].nameIngredient == newElemListIngrPrimary.querySelector('[name="name-ingr"]').textContent){
        //                 ingrPriNotJSON[k][`${e.target.name}`] = +e.target.value;
        //                 // ingrPriNotJSON[k].sum = +e.target.parentElement.querySelector('[name="sum"]').value
        //                 break
        //             }
        //         }
        //         //обновление суммы
        //         for(let k =0; k<ingrPriNotJSON.length; k++){
        //             if(ingrPriNotJSON[k].sum){
        //                 ingrPriNotJSON[k].sum =
        //                 +e.target.parentElement.parentElement.parentElement.querySelector('[name="sum"]').value;
        //                 break
        //             }
        //         }
        //         let ingrPrimary = JSON.stringify(ingrPriNotJSON);


        //         let ingrSecNotJSON = JSON.parse(product.ingredientsSecondary);
        //         for(let k =0; k<ingrSecNotJSON.length; k++){
        //             for(let l=0; l<allIngrSecondary.length; l++){
        //                 if(ingrSecNotJSON[k].nameIngredient == allIngrSecondary[l].querySelector('[name="name-ingr"]').textContent){
        //                     ingrSecNotJSON[k].sum = +allIngrSecondary[l].querySelector('[name="sum"]').value;
        //                     ingrSecNotJSON[k].divider = +allIngrSecondary[l].querySelector('[name="divider"]').value;
        //                 }
        //             }
        //         }

        //         // let listOfSecIngr = newElemListStatement.querySelectorAll('.ul-statement__info-secondary');
        //         // for(let k = 1; k<listOfSecIngr.length; k++){
        //         //     for(let l=0; l<ingrSecNotJSON.length; l++){
        //         //         if(ingrSecNotJSON[l].nameIngredient == listOfSecIngr[k].querySelector('[name="name-ingr"]').textContent){
        //         //             ingrSecNotJSON[l].sum = +listOfSecIngr[k].querySelector('[name="sum"]').value;
        //         //         }
        //         //     }
        //         // }
        //         let ingrSecondary = JSON.stringify(ingrSecNotJSON);


        //         let keyNameProduct = product.nameProductStatement;
        //         let obj = {
        //             nameProductStatement: product.nameProductStatement,
        //             ingredientsPrimary: ingrPrimary,
        //             ingredientsSecondary: ingrSecondary,
        //           };
        //           addElemLocalStorage(obj, keyNameProduct);

        //         console.log(obj)
        //         break;
        //         }
        //     }

        // }
        newElemListIngrPrimary.querySelector('[name="mon"]').addEventListener('input', innerFuncEvent);
        newElemListIngrPrimary.querySelector('[name="tue"]').addEventListener('input', innerFuncEvent);
        newElemListIngrPrimary.querySelector('[name="wed"]').addEventListener('input', innerFuncEvent);
        newElemListIngrPrimary.querySelector('[name="thu"]').addEventListener('input', innerFuncEvent);
        newElemListIngrPrimary.querySelector('[name="fri"]').addEventListener('input', innerFuncEvent);
        newElemListIngrPrimary.querySelector('[name="sat"]').addEventListener('input', innerFuncEvent);

        if(product.nameProductStatement =='Дружок'){
            console.log('друг')
            newElemListIngrPrimary.querySelector('[name="mon"]').style.display = 'none';
            newElemListIngrPrimary.querySelector('[name="tue"]').style.display = 'none';
            newElemListIngrPrimary.querySelector('[name="wed"]').style.display = 'none';
            newElemListIngrPrimary.querySelector('[name="thu"]').style.display = 'none';
            newElemListIngrPrimary.querySelector('[name="fri"]').style.display = 'none';
        }
        }
    });

    ingrSecondaryNotJSON.forEach(ingredient => {
        let newElemListIngrSecondary = elemListIngrSecondary.cloneNode(true);
        newElemListIngrSecondary.querySelector('[name="name-ingr"]').textContent = ingredient.nameIngredient;
        newElemListIngrSecondary.querySelector('[name="divider"]').value = ingredient.divider;
        newElemListIngrSecondary.querySelector('[name="sum"]').value = ingredient.sum;
        newElemListIngrSecondary.classList.remove('hidden')
        elemListIngrSecondary.parentElement.appendChild(newElemListIngrSecondary);

        // newElemListIngrSecondary.querySelector('[name="divider"]').addEventListener('input', innerFuncEvent);
    });

    newElemListStatement.classList.remove('hidden');
    listStatement.appendChild(newElemListStatement);

    newElemListStatement.querySelector('[name="delete"]').addEventListener("click", () => {
        listStatement.removeChild(newElemListStatement);  //удаление с экрана
        let keyNameProduct = product.nameProductStatement; //название ингредиента - ключ
        deleteElemLocalStorage(keyNameProduct); //удаление с хранилища
    });

    // addEventInputElem(newElemListProduct);
}

function updateLocalStorageByDivide(){
    let elems = listStatement.children;
    // console.log(listStatement.children);
    for(let i=1; i<elems.length; i++){
        let allPriIngreOneProd=  elems[i].querySelectorAll('.ul-statement__info-primary');
        let allSecIngreOneProd = elems[i].querySelectorAll('.ul-statement__info-secondary')
        //замена всех второстепенных ингредиентов
        for(let k=0; k<allSecIngreOneProd.length; k++){
            allSecIngreOneProd[k].querySelector('[name="sum"]').value =
            roundN(
                Number(allPriIngreOneProd[1].querySelector('[name="sum"]').value)
                / divide
            ,roundWhole)
        }
        for(let j=0; j<localStorage.length; j++){
            let key = localStorage.key(j);
            let product = JSON.parse(localStorage.getItem(key));
            if(key == elems[i].querySelector('[name="name-product"]').textContent){
                let ingrSecNotJSON = JSON.parse(product.ingredientsSecondary);

                for(let k = 1; k<allSecIngreOneProd.length; k++){
                    for(let l=0; l<ingrSecNotJSON.length; l++){
                        if(ingrSecNotJSON[l].nameIngredient == allSecIngreOneProd[k].querySelector('[name="name-ingr"]').textContent){
                            ingrSecNotJSON[l].sum = +allSecIngreOneProd[k].querySelector('[name="sum"]').value;
                        }
                    }
                }
                let ingrSecondary = JSON.stringify(ingrSecNotJSON);

                let keyNameProduct = product.nameProductStatement;
                let obj = {
                    nameProductStatement: product.nameProductStatement,
                    ingredientsPrimary: product.ingredientsPrimary,
                    ingredientsSecondary: ingrSecondary,
                };
                addElemLocalStorage(obj, keyNameProduct);
                break;
            }
        }
    }

    for(let j=0;j<localStorage.length;j++){
        let key = localStorage.key(j);
        let product = JSON.parse(localStorage.getItem(key));
        if(product.nameProductStatement){
            console.log(product)
        }
    }
}
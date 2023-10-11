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
    getDataStatement,
    updatelLocalStorageBySupabaseStatement
} from "./software/supabase.js";

let nav = document.querySelector(".nav");
navigationNav(nav);

const btnStatementCleanList = document.getElementById("btn-statement-clean-list");
const btnStatementUpdateReport = document.getElementById("btn-statement-update-report");
const btnStatemenDivideSecTwo = document.getElementById("btn-statement-divide-sec-two");
const btnStatemenDivideSecThree = document.getElementById("btn-statement-divide-sec-three");
const btnExportSupabase = document.getElementById("btn-export-supabase");
const btnExportStatement = document.getElementById("btn-export-statement");

let allProductsStatement;

const listStatement = document.getElementById("list-statement");
const elemListStatement = document.getElementById("elem-list-statement");

let divide = 3;

btnStatemenDivideSecTwo.addEventListener('click', ()=>{
    btnStatemenDivideSecTwo.classList.add('btn_download');
    btnStatemenDivideSecThree.classList.remove('btn_download')
    divide=2;
})

btnStatemenDivideSecThree.addEventListener('click', ()=>{
    btnStatemenDivideSecThree.classList.add('btn_download');
    btnStatemenDivideSecTwo.classList.remove('btn_download')
    divide=3;
})

window.addEventListener('load', async ()=>{

    // //получение всех продуктов рапорта
    // allProductsStatement = await getDataStatement();

    await updatelLocalStorageBySupabaseStatement();

    // cleanList(listReport);
    createNewElemList();

    // console.log(allProductsStatement);
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
    // arrProductsClone.sort((a, b) => (a.name > b.name ? 1 : -1));
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

    let elemListIngrPrimary = newElemListStatement.querySelector('.ul-statement__info-primary');
    let elemListIngrSecondary = newElemListStatement.querySelector('.ul-statement__info-secondary');

    ingrPrimaryNotJSON.forEach(ingredient => {
        let newElemListIngrPrimary = elemListIngrPrimary.cloneNode(true);
        newElemListIngrPrimary.querySelector('[name="name-ingr"]').textContent = ingredient.nameIngredient;
        newElemListIngrPrimary.querySelector('[name="mon"]').value = ingredient.mon;
        newElemListIngrPrimary.querySelector('[name="tue"]').value = ingredient.tue;
        newElemListIngrPrimary.querySelector('[name="wed"]').value = ingredient.wed;
        newElemListIngrPrimary.querySelector('[name="thu"]').value = ingredient.thu;
        newElemListIngrPrimary.querySelector('[name="fri"]').value = ingredient.fri;
        newElemListIngrPrimary.querySelector('[name="sum"]').value = ingredient.sum;
        newElemListIngrPrimary.classList.remove('hidden')
        elemListIngrPrimary.parentElement.appendChild(newElemListIngrPrimary);

        let innerFuncEvent = ()=>{
            newElemListIngrPrimary.querySelector('[name="sum"]').value =
            roundN(
                Number(newElemListIngrPrimary.querySelector('[name="mon"]').value) +
                Number(newElemListIngrPrimary.querySelector('[name="tue"]').value) +
                Number(newElemListIngrPrimary.querySelector('[name="wed"]').value) +
                Number(newElemListIngrPrimary.querySelector('[name="thu"]').value) +
                Number(newElemListIngrPrimary.querySelector('[name="fri"]').value)
            ,3);

            let secondaryIngrs = elemListIngrSecondary.parentElement.children
            for(let i=0; i<secondaryIngrs.length; i++){
                // console.log(secondaryIngrs[i])
                secondaryIngrs[i].querySelector('[name="sum"]').value =
                roundN(
                    Number(newElemListIngrPrimary.querySelector('[name="sum"]').value) /
                    divide
                ,3)
            }
        }
        newElemListIngrPrimary.querySelector('[name="mon"]').addEventListener('input', innerFuncEvent);
        newElemListIngrPrimary.querySelector('[name="tue"]').addEventListener('input', innerFuncEvent);
        newElemListIngrPrimary.querySelector('[name="wed"]').addEventListener('input', innerFuncEvent);
        newElemListIngrPrimary.querySelector('[name="thu"]').addEventListener('input', innerFuncEvent);
        newElemListIngrPrimary.querySelector('[name="fri"]').addEventListener('input', innerFuncEvent);
    });

    let ingrSecondaryNotJSON = JSON.parse(product.ingredientsSecondary)
    // console.log(ingrSecondaryNotJSON);

    ingrSecondaryNotJSON.forEach(ingredient => {
        let newElemListIngrSecondary = elemListIngrSecondary.cloneNode(true);
        newElemListIngrSecondary.querySelector('[name="name-ingr"]').textContent = ingredient.nameIngredient;
        newElemListIngrSecondary.querySelector('[name="sum"]').value = ingredient.sum;
        newElemListIngrSecondary.classList.remove('hidden')
        elemListIngrSecondary.parentElement.appendChild(newElemListIngrSecondary);
    });

    newElemListStatement.classList.remove('hidden')
    listStatement.appendChild(newElemListStatement);
  
    newElemListStatement.querySelector('[name="delete"]').addEventListener("click", () => {
        listStatement.removeChild(newElemListStatement);  //удаление с экрана
        // let keyNameProduct = product.name; //название ингредиента - ключ
        // deleteElemLocalStorage(keyNameProduct); //удаление с хранилища
    });
  
    // addEventInputElem(newElemListProduct);
  }

  function addEventInputElem(arrElems){
    arrElems.querySelector('[name="coming"]').addEventListener("input", () => {
      // updateSum(arrElems[i]);
      for (let j = 0; j < localStorage.length; j++) {
        let key = localStorage.key(j);
        if (key ===arrElems.querySelector('[name="name-product"]').textContent) {
          //получение значений продукта
          let product = JSON.parse(localStorage.getItem(key));
          let keyNameProduct = product.name;
          let obj = {
            name: product.name,
            remainder: product.remainder,
            coming: Number(
              arrElems.querySelector('[name="coming"]').value
            ), //обновление расхода
            amount: product.amount,
            // 'sum' : updateSum(arrElems[i]),
            sum: product.sum,
            color: product.color,
          };
          addElemLocalStorage(obj, keyNameProduct);
          checkSum(
            arrElems,
            arrElems.querySelector('[name="remainder-sum"]').value
          );
          break;
        }
      }
    });
    arrElems.querySelector('[name="amount"]').addEventListener("input", () => {
      // updateSum(arrElems[i]);
      for (let j = 0; j < localStorage.length; j++) {
        let key = localStorage.key(j);
        if (key ===arrElems.querySelector('[name="name-product"]').textContent) {
          //получение значений продукта
          let product = JSON.parse(localStorage.getItem(key));
          let keyNameProduct = product.name;
          let obj = {
            name: product.name,
            remainder: product.remainder,
            coming: product.coming, //обновление
            amount: Number(
              arrElems.querySelector('[name="amount"]').value
            ),
            // 'sum' : updateSum(arrElems[i]),
            sum: product.sum,
            color: product.color,
          };
          addElemLocalStorage(obj, keyNameProduct);
          checkSum(
            arrElems,
            arrElems.querySelector('[name="remainder-sum"]').value
          );
          break;
        }
      }
    });
    arrElems.querySelector('[name="remainder"]').addEventListener("input", () => {
      // updateSum(arrElems[i]);
      for (let j = 0; j < localStorage.length; j++) {
        let key = localStorage.key(j);
        if (key ===arrElems.querySelector('[name="name-product"]').textContent) {
          //получение значений продукта
          let product = JSON.parse(localStorage.getItem(key));
          let keyNameProduct = product.name;
          let obj = {
            name: product.name,
            remainder: Number(
              arrElems.querySelector('[name="remainder"]').value
            ),
            coming: product.coming, //обновление расхода
            amount: product.amount,
            // 'sum' : updateSum(arrElems[i]),
            sum: product.sum,
            color: product.color,
          };
          addElemLocalStorage(obj, keyNameProduct);
          checkSum(
            arrElems,
            arrElems.querySelector('[name="remainder-sum"]').value
          );
          break;
        }
      }
    });
    arrElems.querySelector('[name="remainder-sum"]').addEventListener("input", () => {
      // updateSum(arrElems[i]);
      for (let j = 0; j < localStorage.length; j++) {
        let key = localStorage.key(j);
        if (key === arrElems.querySelector('[name="name-product"]').textContent) {
          //получение значений продукта
          let product = JSON.parse(localStorage.getItem(key));
          let keyNameProduct = product.name;
          let obj = {
            name: product.name,
            remainder: product.remainder,
            coming: product.coming,
            amount: product.amount,
            sum: Number(
              arrElems.querySelector('[name="remainder-sum"]').value
            ),
            color: product.color,
          };
          addElemLocalStorage(obj, keyNameProduct);
          // console.log(arrElems[i].querySelector('[name="remainder-sum"]').value)
          checkSum(
            arrElems,
            arrElems.querySelector('[name="remainder-sum"]').value
          );
          break;
        }
      }
    });
  }
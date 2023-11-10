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
  setValueArrToXLSX,
  cleanArrToXLSX,
  deleteValueArrToXLSX,
  isOpenModal,
  getColorByIngredient,
  // arrProductToXLSX,
  // arrSumToXLSX,
  // arrSumProductToXLSX,
} from "./commonFunc.js";


import {
  addElemLocalStorage,
  // deleteElemLocalStorage,
  deleteLocalStorageSumProducts,
} from "../js2/software/storage.js";

import {
  getDataIngredients,
  getDataProducts,
  updateSupabaseByLocalStorageSumProducts,
  updatelLocalStorageBySupabaseSumProducts
}from "../js2/software/supabase.js"

const selectItemsUl = document.getElementById("select-items-ul");
const btnCalc = document.getElementById("btn-calc");
const btnSum = document.getElementById("btn-sum");
const btnClean = document.getElementById("btn-clean");
const inputOutputValue = document.getElementById("input-output-value");

const btnExportProduct = document.getElementById("btn-export-product");
const btnExportSum = document.getElementById("btn-export-sum");
const btnExportSumProduct = document.getElementById("btn-export-sum-products");
const btnExportAll = document.getElementById("btn-export-all");

//модалка для загрузки
const modalLoad = document.getElementById('modal-load');
let allIngredients; //все ингредиенты
let products;  //все продукты


const listProduct = document.getElementById("list-product");
const elemListProduct = document.getElementById("elem-list-product");
const listSum = document.getElementById("list-sum");
const elemListSum = document.getElementById("elem-list-sum");
const listSumProducts = document.getElementById("list-sum-products");
const elemListSumProducts = document.getElementById("elem-list-sum-products");
let arrProductToXLSX = 'arrProductToXLSX'
let countArrProductToXLSX =0;

let arrSumToXLSX = 'arrSumToXLSX'
let countArrSumToXLSX =0;

let arrSumProductToXLSX = 'arrSumProductToXLSX'
let countArrSumProductToXLSX =0;

// export let startArrSum = [
//   {
//     nameIngredient: "всего сырья",
//     amount: 0,
//     color: colorPrimaryOne,
//   },
// ];
export let startArrSum = [];
export let allRecipesSum = [];
let countAllRecipesSum = 0;

let nav = document.querySelector(".nav");
navigationNav(nav);

window.addEventListener("load", async () => {
  //очистка всех списков
  cleanList(listProduct);
  cleanList(listSum);
  cleanList(listSumProducts);

  //блокировка кнопок печати
  btnExportProduct.style.display = "none";
  btnExportSum.style.display = "none";
  btnExportSumProduct.style.display = "none";
  btnExportAll.style.display = "none";

  //получение всех продуктов и ингредиентов
  allIngredients = await getDataIngredients();
  products = await getDataProducts();

  //создание выпадающего списка с продуктами
  createListWithAllProducts();

  //заполнение хранилища базой
  await fillLocalStorageBySupabase();
});

function createListWithAllProducts(){
  isOpenModal(modalLoad,true);
  // let products = await getDataProducts();
  products.forEach((elem) => {
    let newOption = document.createElement("li");
    newOption.textContent = elem.name;
    selectItemsUl.appendChild(newOption);

    newOption.addEventListener("mousedown", (e) => {
      search.value = e.target.textContent;
    });
  });
  isOpenModal(modalLoad,false);
}

btnCalc.addEventListener("click", () => {
  if (search.value
  && getIdSelectedValue(search.value)
  && inputOutputValue.value.trim()!='') {
    isOpenModal(modalLoad,true);
    cleanList(listProduct);
    createNewElemList(
    getStartValuetMaterial(getIdSelectedValue(search.value),inputOutputValue.value),
      listProduct,elemListProduct,1); //1, '200'
    btnExportProduct.style.display = "inline-block";
    isOpenModal(modalLoad, false);
  }
  //если некорректный ввод
  else{
    cleanList(listProduct);
    if(inputOutputValue.value.trim()==''){
      document.getElementById("input-output-value").value = '';
      document.getElementById("input-output-value").classList.add('input-error');

    }
    if(!search.value || !getIdSelectedValue(search.value)){
      document.getElementById("search").value = '';
      document.getElementById("search").classList.add('input-error');
    }
  }
});

btnSum.addEventListener("click", () => {
  if (search.value
  && getIdSelectedValue(search.value)
  && inputOutputValue.value.trim()!=''
  && !hasElemInLocalStorage(search.value)) {
    isOpenModal(modalLoad, true);
    btnExportProduct.style.display = "inline-block";
    btnExportSum.style.display = "inline-block";
    btnExportSumProduct.style.display = "inline-block";
    btnExportAll.style.display = "inline-block";
    cleanList(listProduct);
    createNewElemList(
      getStartValuetMaterial(getIdSelectedValue(search.value),inputOutputValue.value),
      listProduct,elemListProduct,1);
    cleanList(listSum);
    sumStartValueMaterial(
      getStartValuetMaterial(getIdSelectedValue(search.value),inputOutputValue.value)
    ); //arr

    fillLocalStorage();
    isOpenModal(modalLoad, false);
  }
  else{
    cleanList(listProduct);
    if(inputOutputValue.value.trim()==''){
      document.getElementById("input-output-value").value = '';
      document.getElementById("input-output-value").classList.add('input-error');

    }
    if(!search.value || !getIdSelectedValue(search.value)){
      document.getElementById("search").value = '';
      document.getElementById("search").classList.add('input-error');
    }
  }
});

btnClean.addEventListener("click", () => {
  cleanList(listProduct);
  cleanList(listSum);
  cleanList(listSumProducts);
  startArrSum = [];
  // startArrSum = [
  //   {
  //     nameIngredient: "всего сырья",
  //     amount: 0,
  //     color: colorPrimaryOne,
  //   },
  // ];
  allRecipesSum = [];
  countAllRecipesSum = 0;

  //блокировка кнопок печати
  btnExportProduct.style.display = "none";
  btnExportSum.style.display = "none";
  btnExportSumProduct.style.display = "none";
  btnExportAll.style.display = "none";

  // localStorage.clear();
  deleteLocalStorageSumProducts();
});

function getStartValuetMaterial(idProduct, endValueMaterial) {
  //number, string
  endValueMaterial = Number(endValueMaterial); //number-200
  let arrAllValues = [];
  let arrAllValuesCount = 0;
  // let products = await getDataProducts();
  for (let i = 0; i < products.length; i++) {
    if (products[i].id == idProduct) {
      let allMaterials = (endValueMaterial * 100) / products[i].outputValue; // 14.285714285714286-число
      allMaterials = roundN(allMaterials, roundPrimary); //14.3-число

      arrAllValues[arrAllValuesCount++] = {
        nameProduct: products[i].name,
        outputValue: endValueMaterial,
        color: colorWhite,
        outputValueStart: products[i].outputValue,
      }; //0 элемент

      arrAllValues[arrAllValuesCount++] = {
        nameIngredient: "всего сырья",
        amount: allMaterials,
        color: colorPrimaryOne,
      }; //1 элемент

      let ingredientsPrimarySupabase = JSON.parse(products[i].ingredientsPrimary)
      ingredientsPrimarySupabase.forEach((ingredient) => {
        let valuePrimaryIngredient = (allMaterials * ingredient.amount) / 100; //number
        if (idProduct == 47 &&
            (ingredient.nameIngredient == "вода" ||
            ingredient.nameIngredient == "меланж яичный сухой")) {
          valuePrimaryIngredient = roundN(valuePrimaryIngredient,roundSecondary); //number
        } else valuePrimaryIngredient = roundN(valuePrimaryIngredient, roundPrimary); //number

        arrAllValues[arrAllValuesCount++] = {
          nameIngredient: ingredient.nameIngredient,
          amount: valuePrimaryIngredient,
          color: ingredient.color,
          // color: getColorByIngredient(allIngredients, ingredient.nameIngredient),
        };
      });

      let sum = 0;
      for (let i = 2; i < arrAllValues.length; i++) {
        // console.log(i,arrAllValues[i].amount)
        sum += arrAllValues[i].amount;
        sum =
          idProduct == 47
            ? roundN(sum, roundSecondary)
            : roundN(sum, roundPrimary);
        // console.log(i, sum)
      }
      if (sum != allMaterials) {
        // console.log("сумма  ", sum);
        // console.log("общая   ", allMaterials);
        sum -= arrAllValues[arrAllValues.length - 1].amount;
        sum =
          idProduct == 47
            ? roundN(sum, roundSecondary)
            : roundN(sum, roundPrimary);
        console.log(
          "сумма без  ",
          arrAllValues[arrAllValues.length - 1].amount,
          " равна ",
          sum
        );
        let newValue = allMaterials - sum;
        arrAllValues[arrAllValues.length - 1].amount =
          idProduct == 47
            ? roundN(newValue, roundSecondary)
            : roundN(newValue, roundPrimary);
        console.log(arrAllValues[arrAllValues.length - 1].amount);
      }

      let ingredientsSecondarySupabase = JSON.parse(products[i].ingredientsSecondary)
      ingredientsSecondarySupabase.forEach((ingredient) => {
        let valueSecondaryIngredient =
          (allMaterials * ingredient.amount) / 100; //number
        if (
          ingredient.nameIngredient.includes("пакет") ||
          ingredient.nameIngredient.includes("скрепки") ||
          ingredient.nameIngredient.includes("скрепки") ||
          ingredient.nameIngredient.includes("петли") ||
          ingredient.nameIngredient.includes("петли") ||
          ingredient.nameIngredient.includes("контейнер") ||
          ingredient.nameIngredient.includes("тарелка")
        )
          valueSecondaryIngredient = roundN(
            valueSecondaryIngredient,
            roundWhole
          );
        else if (
          ingredient.nameIngredient.includes("черева") ||
          ingredient.nameIngredient.includes("фиброуз") ||
          ingredient.nameIngredient.includes("коллаген")
        )
          valueSecondaryIngredient = roundN(
            valueSecondaryIngredient,
            roundPrimary
          );
        else
          valueSecondaryIngredient = roundN(
            valueSecondaryIngredient,
            roundSecondary
          ); //number

        // console.log(valueSecondaryIngredient);

        arrAllValues[arrAllValuesCount++] = {
          nameIngredient: ingredient.nameIngredient,
          amount: valueSecondaryIngredient,
          color: ingredient.color,
          // color: getColorByIngredient(allIngredients, ingredient.nameIngredient),
        };
      });
      break;
    }
  }
  return arrAllValues;
}

function createNewElemList(arrElems, list, child, firstPosition) {
  if (list === listProduct)
    setValueArrToXLSX(arrProductToXLSX,countArrProductToXLSX++,arrElems[0]);
    // arrProductToXLSX[countArrProductToXLSX++] = arrElems[0];

  if (firstPosition > 0) {
    let firstElemArr = arrElems[0]; //сохранение первого
    arrElems.splice(0, 1); //удаление первого
    arrElems.sort((a, b) => (a.nameIngredient > b.nameIngredient ? 1 : -1)); //сортировка массива без первого
    arrElems.unshift(firstElemArr); //возвращаем первый
  } else
    arrElems.sort((a, b) => (a.nameIngredient > b.nameIngredient ? 1 : -1));

  for (let i = firstPosition; i < arrElems.length; i++) {
    //прогоняет цикл только ОДИН раз
    if (arrElems[i].color == colorWhite) {
      let newElemListProduct = child.cloneNode(true);
      newElemListProduct.querySelector('[name="name-product"]').textContent = arrElems[i].nameIngredient;
      // newElemListProduct.querySelector('[name="value-product"]').textContent = arrElems[i].amount;
      newElemListProduct.querySelector('[name="value-product"]').value = arrElems[i].amount;
      newElemListProduct.style.background = arrElems[i].color;
      list.appendChild(newElemListProduct);

      newElemListProduct.querySelector(".delete").addEventListener("click", () => {
          cleanList(listSum);
          // deleteProductFromSum(arrElems[i].nameIngredient) //название
          deleteProductFromSum(arrElems[i]);
          list.removeChild(newElemListProduct);

          fillLocalStorage();
      });

      // newElemListProduct.querySelector('[name="value-product"]').disabled = true
      newElemListProduct.querySelector('[name="value-product"]').addEventListener('blur', ()=>{
        let valueAmount = newElemListProduct.querySelector('[name="value-product"]').value
        console.log(valueAmount);

        //2+2
        if(valueAmount.includes('+')){
          if(correctNumbers(valueAmount,'+')!=null){
            let numbers = correctNumbers(valueAmount,'+');
            let res = +numbers[0];
            for(let i = 1; i<numbers.length; i++){
              res += +numbers[i];
            }
            // console.log(numbers)
            res = roundN(res, roundSecondary);
            newElemListProduct.querySelector('[name="value-product"]').value = res;

            //удаление
            cleanList(listSum);
            deleteProductFromSum(arrElems[i]);
            list.removeChild(newElemListProduct);
            fillLocalStorage();

            //сложение
            cleanList(listSum);
            sumStartValueMaterial(
              getStartValuetMaterial(getIdSelectedValue(arrElems[i].nameIngredient),res)
            ); //arr
            fillLocalStorage();
          }
          else{
            newElemListProduct.querySelector('[name="value-product"]').value = arrElems[i].amount;
          }
        }
        //2-2
        else if(valueAmount.includes('-')){
          if(correctNumbers(valueAmount,'-')!=null){
            let numbers = correctNumbers(valueAmount,'-');
            let res = +numbers[0];
            for(let i = 1; i<numbers.length; i++){
            res -= +numbers[i];
            }
            // console.log(numbers)
            res = roundN(res, roundSecondary);
            newElemListProduct.querySelector('[name="value-product"]').value = res;

            //удаление
            cleanList(listSum);
            deleteProductFromSum(arrElems[i]);
            list.removeChild(newElemListProduct);
            fillLocalStorage();

            //сложение
            cleanList(listSum);
            sumStartValueMaterial(
            getStartValuetMaterial(getIdSelectedValue(arrElems[i].nameIngredient),res)
            ); //arr

            fillLocalStorage();
          }
          else{
            newElemListProduct.querySelector('[name="value-product"]').value = arrElems[i].amount;
          }
        }
        //2lfk
        else if(isNaN(valueAmount)){
          newElemListProduct.querySelector('[name="value-product"]').value = arrElems[i].amount;
        }
        //200
        else{
          // let valueAmount = newElemListProduct.querySelector('[name="value-product"]').value

          //удаление
          cleanList(listSum);
          deleteProductFromSum(arrElems[i]);
          list.removeChild(newElemListProduct);
          fillLocalStorage();

          //сложение
          cleanList(listSum);
          sumStartValueMaterial(
            getStartValuetMaterial(getIdSelectedValue(arrElems[i].nameIngredient),valueAmount)
          ); //arr
          fillLocalStorage();
        }

        function correctNumbers (valueAmount, sign){  //string, sign +/-
          let numbers;
          //убираем все пробелы
          numbers = valueAmount.replaceAll(' ', '')
          //получаем массив строк (операндов) по знаку + или -
          numbers = numbers.split(sign);
          for(let i=0; i<numbers.length; i++){
            if(isNaN(numbers[i])){
              console.log(numbers[i]);
              return null;
            }
          }
          return numbers
        }
      })



      if (list === listSumProducts)
      setValueArrToXLSX(arrSumProductToXLSX,countArrSumProductToXLSX++,arrElems[i])
      // arrSumProductToXLSX[countArrSumProductToXLSX++] = arrElems[i];
    }
  }
  let addEmptyObj = 12;
  // console.log('начало',addEmptyObj)
  for (let i = firstPosition; i < arrElems.length; i++) {
    if (arrElems[i].color == colorPrimaryOne) {
      addInList(arrElems[i]);

      if (list === listProduct){
        // arrProductToXLSX[countArrProductToXLSX++] = arrElems[i];
        setValueArrToXLSX(arrProductToXLSX,countArrProductToXLSX++, arrElems[i])
        addEmptyObj--;
        // console.log(addEmptyObj)
      }
      if (list === listSum)
        setValueArrToXLSX(arrSumToXLSX,countArrSumToXLSX++,arrElems[i])
        // arrSumToXLSX[countArrSumToXLSX++] = arrElems[i];
    }
  }
  for (let i = firstPosition; i < arrElems.length; i++) {
    if (arrElems[i].color == colorPrimaryTwo) {
      addInList(arrElems[i]);

      if (list === listProduct){
        setValueArrToXLSX(arrProductToXLSX,countArrProductToXLSX++, arrElems[i])
        // arrProductToXLSX[countArrProductToXLSX++] = arrElems[i];
        addEmptyObj--;
        // console.log(addEmptyObj)
      }
      if (list === listSum)
        setValueArrToXLSX(arrSumToXLSX,countArrSumToXLSX++, arrElems[i])
        // arrSumToXLSX[countArrSumToXLSX++] = arrElems[i];
    }
  }
  for (let i = firstPosition; i < arrElems.length; i++) {
    if (arrElems[i].color == colorPrimaryThree) {
      addInList(arrElems[i]);

      if (list === listProduct){
        setValueArrToXLSX(arrProductToXLSX,countArrProductToXLSX++,arrElems[i])
        // arrProductToXLSX[countArrProductToXLSX++] = arrElems[i];
        addEmptyObj--;
        console.log(addEmptyObj)
      }
      if (list === listSum)
        setValueArrToXLSX(arrSumToXLSX,countArrSumToXLSX++, arrElems[i])
        // arrSumToXLSX[countArrSumToXLSX++] = arrElems[i];
    }
  }
  // let addEmptyObj = 9;
  for (let i = firstPosition; i < arrElems.length; i++) {
    if (arrElems[i].color == colorSecondaryOne) {
      addInList(arrElems[i]);

      if (list === listProduct){
        //добавление пустых объектов(муляж) для нормальной печати
        while (addEmptyObj >0) {
          // arrProductToXLSX[countArrProductToXLSX++] = {
          //   nameIngredient: "",
          //   amount: "",
          //   color: "",
          // };
          setValueArrToXLSX(arrProductToXLSX,countArrProductToXLSX++, {
            nameIngredient: "",
            amount: "",
            color: "",
          })
          addEmptyObj--;
          // console.log('уменьшаем',addEmptyObj)
        }
        setValueArrToXLSX(arrProductToXLSX,countArrProductToXLSX++, arrElems[i])
        // arrProductToXLSX[countArrProductToXLSX++] = arrElems[i];
      }
      if (list === listSum)
        setValueArrToXLSX(arrSumToXLSX,countArrSumToXLSX++,arrElems[i])
        // arrSumToXLSX[countArrSumToXLSX++] = arrElems[i];
    }
  }
  for (let i = firstPosition; i < arrElems.length; i++) {
    if (arrElems[i].color == colorSecondaryTwo) {
      addInList(arrElems[i]);

      if (list === listProduct){
        //добавление пустых объектов(муляж) для нормальной печати
        while (addEmptyObj >0) {
          // arrProductToXLSX[countArrProductToXLSX++] = {
          //   nameIngredient: "",
          //   amount: "",
          //   color: "",
          // };
          setValueArrToXLSX(arrProductToXLSX,countArrProductToXLSX++, {
            nameIngredient: "",
            amount: "",
            color: "",
          })
          addEmptyObj--;
          // console.log('уменьшаем',addEmptyObj)
        }
        setValueArrToXLSX(arrProductToXLSX,countArrProductToXLSX++, arrElems[i])
        // arrProductToXLSX[countArrProductToXLSX++] = arrElems[i];
      }
      if (list === listSum)
        setValueArrToXLSX(arrSumToXLSX,countArrSumToXLSX++, arrElems[i])
        // arrSumToXLSX[countArrSumToXLSX++] = arrElems[i];
    }
  }
  for (let i = firstPosition; i < arrElems.length; i++) {
    if (arrElems[i].color == colorSecondaryTree) {
      addInList(arrElems[i]);

      if (list === listProduct)
        setValueArrToXLSX(arrProductToXLSX,countArrProductToXLSX++, arrElems[i])
        // arrProductToXLSX[countArrProductToXLSX++] = arrElems[i];
      if (list === listSum)
        setValueArrToXLSX(arrSumToXLSX,countArrSumToXLSX++,arrElems[i])
        // arrSumToXLSX[countArrSumToXLSX++] = arrElems[i];
    }
  }

  function addInList(product){
    let newElemListProduct = child.cloneNode(true);
    newElemListProduct.querySelector('[name="name-product"]').textContent = product.nameIngredient;
    newElemListProduct.querySelector('[name="value-product"]').textContent = product.amount;
    newElemListProduct.style.background = product.color;
    list.appendChild(newElemListProduct);
  }
  function addInListSumProducts(){
  }
}

function sumStartValueMaterial(arrProduct) {
  allRecipesSum[countAllRecipesSum++] = structuredClone(arrProduct); //глубокое копирование

  for (let i = 0; i < startArrSum.length; i++) {
    for (let j = 1; j < arrProduct.length; j++) {
      if (startArrSum[i].nameIngredient == arrProduct[j].nameIngredient) {
        let sumAmount = startArrSum[i].amount + arrProduct[j].amount;
        sumAmount = roundN(sumAmount, roundSecondary);
        startArrSum[i].amount = sumAmount;
        arrProduct.splice(j, 1);
        break;
      }
    }
  }

  let arrAllSumProducts = [];
  let countArrAllSumProducts = 0;
  for(let i=0; i<listSumProducts.children.length; i++){
    let objSumProduct = {
      nameIngredient: listSumProducts.children[i].querySelector('[name="name-product"]').textContent,
      amount: +listSumProducts.children[i].querySelector('[name="value-product"]').value,
      color: colorWhite,
    }
    arrAllSumProducts[countArrAllSumProducts++] = objSumProduct;
  }
  arrAllSumProducts[countArrAllSumProducts++] = {
    nameIngredient: arrProduct[0].nameProduct,
    amount: arrProduct[0].outputValue,
    color: colorWhite,
  }
  cleanList(listSumProducts);

  createNewElemList(
    // [
    //   {
    //     nameIngredient: arrProduct[0].nameProduct,
    //     amount: arrProduct[0].outputValue,
    //     color: colorWhite,
    //   },
    // ],
    arrAllSumProducts,
    listSumProducts,elemListSumProducts,0);
  arrProduct.splice(0, 1);

  //смена цветов
  arrProduct.forEach(product =>{
    if(product.nameIngredient!= 'всего сырья') product.color = getColorByIngredient(allIngredients, product.nameIngredient);
  })
  startArrSum = startArrSum.concat(arrProduct);
  createNewElemList(startArrSum, listSum, elemListSum, 0);
}
function deleteProductFromSum(product) {
  console.log(product);
  let deletedArrProduct = [];
  console.log("lenght   ", allRecipesSum.length);
  //получение массива данных удаляемого элемента
  for (let i = 0; i < allRecipesSum.length; i++) {
    // console.log(allRecipesSum[i][0].nameProduct)
    if (allRecipesSum[i][0].nameProduct === product.nameIngredient &&
      allRecipesSum[i][0].outputValue === product.amount) {
      // console.log(productName, '[fp[fpg[fpg[')
      // console.log(allRecipesSum[i]) //массив удаляемых ингредиентов
      deletedArrProduct = structuredClone(allRecipesSum[i]);
      // console.log(allRecipesSum);
      allRecipesSum.splice(i, 1);
      --countAllRecipesSum;
      deleteValueArrToXLSX(arrSumProductToXLSX,i)
      // arrSumProductToXLSX.splice(i, 1);
      --countArrSumProductToXLSX;
      break;
    }
  }
  // console.log(deletedArrProduct);

  //удаление данных из суммы
  for (let i = 0; i < startArrSum.length; i++) {
    for (let j = 1; j < deletedArrProduct.length; j++) {
      if (startArrSum[i].nameIngredient == deletedArrProduct[j].nameIngredient) {
        let sumAmount = startArrSum[i].amount - deletedArrProduct[j].amount;
        sumAmount = roundN(sumAmount, roundSecondary);
        startArrSum[i].amount = sumAmount;
        if (sumAmount === 0) startArrSum.splice(i, 1);
        --i;
        deletedArrProduct.splice(j, 1);
        break;
      }
    }
  }
  console.log(allRecipesSum);
  // arrProduct.splice(0, 1);
  // startArrSum = startArrSum.concat(arrProduct);
  createNewElemList(startArrSum, listSum, elemListSum, 0);
}

function cleanList(list) {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  if (list === listProduct) {
    cleanArrToXLSX(arrProductToXLSX)
    // arrProductToXLSX = [];
    countArrProductToXLSX = 0;
  } else if (list === listSum) {
    cleanArrToXLSX(arrSumToXLSX)
    // arrSumToXLSX = [];
    countArrSumToXLSX = 0;
  } else if (list === listSumProducts) {
    cleanArrToXLSX(arrSumProductToXLSX)
    // arrSumProductToXLSX = [];
    countArrSumProductToXLSX = 0;
  }
}

let search = document.getElementById("search");
search.addEventListener("focus", () => {
  search.value = "";
  liveSearch(selectItemsUl, search);
  search.classList.remove('input-error');
});
search.addEventListener("blur", () => {
  let listOfElems = selectItemsUl.children;
  for (let i = 0; i < listOfElems.length; i++) {
    listOfElems[i].style.display = "none";
  }
});
search.addEventListener("keyup", () => {
  liveSearch(selectItemsUl, search);
});
inputOutputValue.addEventListener("focus", () => {
  inputOutputValue.classList.remove('input-error');
});

function getIdSelectedValue(nameProduct) {
  let idSelectedValue = null;
  // let products = await getDataProducts();
  for (let i = 0; i < products.length; i++) {
    if (products[i].name === nameProduct) {
      idSelectedValue = products[i].id;
      break;
    }
  }
  return idSelectedValue;
}

//локальное хранилище расчета
function fillLocalStorage() {
  //очистка хранилища
  // localStorage.clear();
  deleteLocalStorageSumProducts();
  //заполнение заново хранилища всеми данными
  for (let i = 0; i < allRecipesSum.length; i++) {
    //массив массивов
    let keyNameProduct = allRecipesSum[i][0].nameProduct; //название продукта - ключ
    let obj = {
      nameProduct: allRecipesSum[i][0].nameProduct,
      outputValue: allRecipesSum[i][0].outputValue,
    };
    addElemLocalStorage(obj, keyNameProduct);
  }
}

async function fillLocalStorageBySupabase(){
  // localStorage.clear();
  await updatelLocalStorageBySupabaseSumProducts();
  if (localStorage.length != 0) {

    for (let j = 0; j < localStorage.length; j++) {
      let key = localStorage.key(j);
      let product = JSON.parse(localStorage.getItem(key));
      if (product.nameProduct) {
        cleanList(listSum);
        sumStartValueMaterial(
          getStartValuetMaterial(
            getIdSelectedValue(product.nameProduct),
            product.outputValue
          )
        ); //arr

          btnExportSum.style.display = 'inline-block'
          btnExportSumProduct.style.display = 'inline-block'
          btnExportAll.style.display = 'inline-block'
      }
    }
  }
}

//поиск в списке продуктов суммы
let searchProductSum = document.getElementById('search-product-sum');

searchProductSum.addEventListener("focus", () => {
  searchProductSum.value = "";
  liveSearch(listSumProducts, searchProductSum);
});

searchProductSum.addEventListener("keyup", () => {
  liveSearch(listSumProducts, searchProductSum);
});


function hasElemInLocalStorage(input){
  for (let j = 0; j < localStorage.length; j++) {
    let key = localStorage.key(j);
    let product = JSON.parse(localStorage.getItem(key));
    if (product.nameProduct == input) {
      searchProductSum.value = input;
      liveSearch(listSumProducts, searchProductSum);
      return true;
    }
  }
  return false;
}
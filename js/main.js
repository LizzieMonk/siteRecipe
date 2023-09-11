import { products, startValue } from "./data.js";

export const colorPrimaryOne = "#A5E6B2";
export const colorPrimaryTwo = "#D7F7DD";
export const colorSecondaryOne = "#A0CADE";
export const colorSecondaryTwo = "#C4ECFF";
export const colorSecondaryTree = "#F7D6CB";
export const colorWhite = "white";

const roundPrimary = 1;
const roundSecondary = 3;
const roundWhole = 0;

const selectItemsUl = document.getElementById("select-items-ul");
const selectItems = document.getElementById("select-items");
const btnCalc = document.getElementById("btn-calc");
const btnSum = document.getElementById("btn-sum");
const btnClean = document.getElementById("btn-clean");
const inputOutputValue = document.getElementById("input-output-value");

const btnExportProduct = document.getElementById('btn-export-product');
const btnExportSum = document.getElementById('btn-export-sum');
const btnExportSumProduct = document.getElementById('btn-export-sum-products');
const btnExportAll = document.getElementById('btn-export-all');

window.addEventListener("load", () => {
  // products.forEach(elem =>{
  //     let newOption = document.createElement('option');
  //     newOption.text = elem.name;
  //     newOption.value = elem.id;
  //     selectItems.appendChild(newOption);
  // }
  // )
  products.forEach((elem) => {
    let newOption = document.createElement("li");
    newOption.textContent = elem.name;
    selectItemsUl.appendChild(newOption);
  });
  cleanList(listProduct);
  cleanList(listSum);
  cleanList(listSumProducts);

  btnExportProduct.style.display = 'none'
  btnExportSum.style.display = 'none'
  btnExportSumProduct.style.display = 'none'
  btnExportAll.style.display = 'none'
});

const listProduct = document.getElementById("list-product");
const elemListProduct = document.getElementById("elem-list-product");
export let arrProductToXLSX = []
let countArrProductToXLSX =0;

export let arrSumToXLSX = []
let countArrSumToXLSX =0;

export let arrSumProductToXLSX = []
let countArrSumProductToXLSX =0;

btnCalc.addEventListener("click", () => {
  if(search.value){
    cleanList(listProduct);
    // createNewElemList(getStartValuetMaterial(selectItems.value, inputOutputValue.value),listProduct,elemListProduct, 1); //'1', '200'
    createNewElemList(getStartValuetMaterial(getIdSelectedValue(search), inputOutputValue.value),listProduct,elemListProduct,1); //1, '200'
    btnExportProduct.style.display = 'inline-block'
  }
});
btnSum.addEventListener("click", () => {
  if(search.value){
    btnExportProduct.style.display = 'inline-block'
    btnExportSum.style.display = 'inline-block'
    btnExportSumProduct.style.display = 'inline-block'
    btnExportAll.style.display = 'inline-block'
    cleanList(listProduct);
    // createNewElemList(getStartValuetMaterial(selectItems.value, inputOutputValue.value),listProduct,elemListProduct, 1);
    createNewElemList(getStartValuetMaterial(getIdSelectedValue(search), inputOutputValue.value),listProduct,elemListProduct,1);
    cleanList(listSum);
    // sumStartValueMaterial(getStartValuetMaterial(selectItems.value, inputOutputValue.value)); //arr
    sumStartValueMaterial(getStartValuetMaterial(getIdSelectedValue(search), inputOutputValue.value)); //arr
  }
});
export let startArrSum = [
  {
    nameIngredient: "всего сырья",
    amount: 0,
    color: colorPrimaryOne,
  },
];
export let allRecipesSum = [];
let countAllRecipesSum =0;


btnClean.addEventListener("click", () => {
  cleanList(listProduct);
  cleanList(listSum);
  cleanList(listSumProducts);
  startArrSum = [
    {
      nameIngredient: "всего сырья",
      amount: 0,
      color: colorPrimaryOne,
    },
  ];
  allRecipesSum = [];
  countAllRecipesSum =0;
  btnExportProduct.style.display = 'none'
  btnExportSum.style.display = 'none'
  btnExportSumProduct.style.display = 'none'
  btnExportAll.style.display = 'none'
});

function getStartValuetMaterial(idProduct, endValueMaterial) {
  //string, string
  idProduct = Number(idProduct); //number-1
  endValueMaterial = Number(endValueMaterial); //number-200
  let arrAllValues = [];
  let arrAllValuesCount = 0;
  for (let i = 0; i < products.length; i++) {
    if (products[i].id == idProduct) {
      // allMaterials = (endValueMaterial * startValue / products[i].outputValue).toFixed(1);  //'181.8' строка в экспоненциальной форме
      let allMaterials = (endValueMaterial * startValue) / products[i].outputValue; // 14.285714285714286-число
      allMaterials = roundN(allMaterials, roundPrimary); //14.3-число
      // console.log('всего сырья  ',allMaterials);

      arrAllValues[arrAllValuesCount] = {
        nameProduct: products[i].name,
        outputValue: endValueMaterial,
        color: colorWhite,
        outputValueStart: products[i].outputValue
      }; //0 элемент
      arrAllValuesCount++;
      arrAllValues[arrAllValuesCount] = {
        nameIngredient: "всего сырья",
        amount: allMaterials,
        color: colorPrimaryOne,
      }; //1 элемент
      arrAllValuesCount++;

      products[i].ingredientsPrimary.forEach((ingredient) => {
        let valuePrimaryIngredient = (allMaterials * ingredient.amount) / 100; //number
        if(idProduct == 47 && (ingredient.nameIngredient=='вода' || ingredient.nameIngredient=='меланж яичный сухой')){
          valuePrimaryIngredient = roundN(valuePrimaryIngredient, roundSecondary); //number
        }
        else valuePrimaryIngredient = roundN(valuePrimaryIngredient, roundPrimary); //number

        arrAllValues[arrAllValuesCount] = {
          nameIngredient: ingredient.nameIngredient,
          amount: valuePrimaryIngredient,
          color: colorPrimaryTwo,
        };
        arrAllValuesCount++;
      });

      let sum = 0;
      for (let i = 2; i < arrAllValues.length; i++) {
        // console.log(i,arrAllValues[i].amount)
        sum += arrAllValues[i].amount;
        sum = idProduct == 47?roundN(sum, roundSecondary): roundN(sum, roundPrimary);
        console.log(i, sum)
      }
      if (sum != allMaterials) {
        console.log("сумма  ", sum);
        console.log("общая   ", allMaterials);
        sum -= arrAllValues[arrAllValues.length - 1].amount;
        sum = idProduct==47? roundN(sum, roundSecondary): roundN(sum, roundPrimary);
        console.log("сумма без  ",arrAllValues[arrAllValues.length - 1].amount," равна ",sum);
        let newValue = allMaterials - sum;
        arrAllValues[arrAllValues.length - 1].amount = idProduct==47? roundN(newValue,roundSecondary):roundN(newValue,roundPrimary);
        console.log(arrAllValues[arrAllValues.length - 1].amount);
      }

      products[i].ingredientsSecondary.forEach((ingredient) => {
        let valueSecondaryIngredient =
          (allMaterials * ingredient.amount) / startValue; //number
        if (ingredient.nameIngredient.includes("пакет") ||
          ingredient.nameIngredient.includes("скрепки") ||
          ingredient.nameIngredient.includes("скрепки") ||
          ingredient.nameIngredient.includes("петли") ||
          ingredient.nameIngredient.includes("петли") ||
          ingredient.nameIngredient.includes("контейнер") ||
          ingredient.nameIngredient.includes("тарелка")) valueSecondaryIngredient = roundN(valueSecondaryIngredient,roundWhole);
        else if (ingredient.nameIngredient.includes("черева") ||
          ingredient.nameIngredient.includes("фиброуз") ||
          ingredient.nameIngredient.includes("коллаген")) valueSecondaryIngredient = roundN(valueSecondaryIngredient, roundPrimary);
        else valueSecondaryIngredient = roundN(valueSecondaryIngredient,roundSecondary); //number

        // console.log(valueSecondaryIngredient);

        arrAllValues[arrAllValuesCount] = {
          nameIngredient: ingredient.nameIngredient,
          amount: valueSecondaryIngredient,
          color: setColorPrimary(ingredient),
        };
        arrAllValuesCount++;
      });
      // return arrAllValues;
      break;
    }
  }
  return arrAllValues;
}

function setColorPrimary(ingredient) {
  if (
    ingredient.nameIngredient.includes("черева") ||
    ingredient.nameIngredient.includes("шпагат") ||
    ingredient.nameIngredient.includes("фиброуз") ||
    ingredient.nameIngredient.includes("пакет") ||
    ingredient.nameIngredient.includes("скрепки") ||
    ingredient.nameIngredient.includes("скрепки") ||
    ingredient.nameIngredient.includes("петли") ||
    ingredient.nameIngredient.includes("петли") ||
    ingredient.nameIngredient.includes("коллаген") ||
    ingredient.nameIngredient.includes("контейнер") ||
    ingredient.nameIngredient.includes("тарелка")
  )
    return colorSecondaryTree;
  else if (
    ingredient.nameIngredient.includes("соль") ||
    ingredient.nameIngredient.includes("пнс") ||
    ingredient.nameIngredient.includes("крахмал") ||
    ingredient.nameIngredient.includes("молоко") ||
    ingredient.nameIngredient.includes("порошок") ||
    ingredient.nameIngredient.includes("манная") ||
    ingredient.nameIngredient.includes("лук") ||
    ingredient.nameIngredient.includes("перец") ||
    ingredient.nameIngredient.includes("кориандр") ||
    ingredient.nameIngredient.includes("масло") ||
    ingredient.nameIngredient.includes("семена") ||
    ingredient.nameIngredient.includes("гречневая") ||
    ingredient.nameIngredient.includes("орех") ||
    ingredient.nameIngredient.includes("мука") ||
    ingredient.nameIngredient.includes("чеснок") ||
    ingredient.nameIngredient.includes("тмин") ||
    ingredient.nameIngredient.includes("изолят") ||
    ingredient.nameIngredient.includes("лист") ||
    ingredient.nameIngredient.includes("клетчатка")
  )
    return colorSecondaryOne;
  else return colorSecondaryTwo;
}

function roundN(number, count) {
  return Math.round(number * Math.pow(10, count)) / Math.pow(10, count);
}

function createNewElemList(arrElems, list, child, firstPosition) {
  if(list===listProduct) arrProductToXLSX[countArrProductToXLSX++] = arrElems[0]

  if (firstPosition > 0) {
    let firstElemArr = arrElems[0]; //сохранение первого
    arrElems.splice(0, 1); //удаление первого
    arrElems.sort((a, b) => (a.nameIngredient > b.nameIngredient ? 1 : -1)); //сортировка массива без первого
    arrElems.unshift(firstElemArr); //возвращаем первый
  } else arrElems.sort((a, b) => (a.nameIngredient > b.nameIngredient ? 1 : -1));

  for (let i = firstPosition; i < arrElems.length; i++) {
    if (arrElems[i].color == colorWhite) {
      let newElemListProduct = child.cloneNode(true);
        newElemListProduct.querySelector('[name="name-product"]').textContent = arrElems[i].nameIngredient;
        newElemListProduct.querySelector('[name="value-product"]').textContent = arrElems[i].amount;
        newElemListProduct.style.background = arrElems[i].color;
        newElemListProduct.querySelector('.delete').addEventListener('click', ()=>{
          cleanList(listSum);
          // deleteProductFromSum(arrElems[i].nameIngredient) //название
          deleteProductFromSum(arrElems[i])
          newElemListProduct.remove()
        })
        list.appendChild(newElemListProduct);
        if(list === listSumProducts) arrSumProductToXLSX [countArrSumProductToXLSX++] = arrElems[i];
    }
  }
  for (let i = firstPosition; i < arrElems.length; i++) {
    if (arrElems[i].color == colorPrimaryOne) {
      let newElemListProduct = child.cloneNode(true);
      newElemListProduct.querySelector('[name="name-product"]').textContent =
      arrElems[i].nameIngredient;
      newElemListProduct.querySelector('[name="value-product"]').textContent =
      arrElems[i].amount;
      newElemListProduct.style.background = arrElems[i].color;
      list.appendChild(newElemListProduct);

      if(list === listProduct) arrProductToXLSX[countArrProductToXLSX++] = arrElems[i]
      if(list === listSum) arrSumToXLSX[countArrSumToXLSX++] = arrElems[i]
    }
  }
  for (let i = firstPosition; i < arrElems.length; i++) {
    if (arrElems[i].color == colorPrimaryTwo) {
      let newElemListProduct = child.cloneNode(true);
      newElemListProduct.querySelector('[name="name-product"]').textContent =
        arrElems[i].nameIngredient;
      newElemListProduct.querySelector('[name="value-product"]').textContent =
        arrElems[i].amount;
      newElemListProduct.style.background = arrElems[i].color;
      list.appendChild(newElemListProduct);

      if(list === listProduct) arrProductToXLSX[countArrProductToXLSX++] = arrElems[i]
      if(list === listSum) arrSumToXLSX[countArrSumToXLSX++] = arrElems[i]
    }
  }
  let addEmptyObj = 7
  for (let i = firstPosition; i < arrElems.length; i++) {
    if (arrElems[i].color == colorSecondaryOne) {

      //добавление пустых объектов(муляж) для нормальной печати
      while(addEmptyObj!=0){
          arrProductToXLSX[countArrProductToXLSX++] = {
            nameIngredient:'',
            amount:'',
            color:''
          }
          addEmptyObj--;
      }

      let newElemListProduct = child.cloneNode(true);
      newElemListProduct.querySelector('[name="name-product"]').textContent = arrElems[i].nameIngredient;
      newElemListProduct.querySelector('[name="value-product"]').textContent = arrElems[i].amount;
      newElemListProduct.style.background = arrElems[i].color;
      list.appendChild(newElemListProduct);

      if(list === listProduct) arrProductToXLSX[countArrProductToXLSX++] = arrElems[i]
      if(list === listSum) arrSumToXLSX[countArrSumToXLSX++] = arrElems[i]
    }
  }
  for (let i = firstPosition; i < arrElems.length; i++) {
    if (arrElems[i].color == colorSecondaryTwo) {
      let newElemListProduct = child.cloneNode(true);
      newElemListProduct.querySelector('[name="name-product"]').textContent =
        arrElems[i].nameIngredient;
      newElemListProduct.querySelector('[name="value-product"]').textContent =
        arrElems[i].amount;
      newElemListProduct.style.background = arrElems[i].color;
      list.appendChild(newElemListProduct);

      if(list === listProduct) arrProductToXLSX[countArrProductToXLSX++] = arrElems[i]
      if(list === listSum) arrSumToXLSX[countArrSumToXLSX++] = arrElems[i]
    }
  }
  for (let i = firstPosition; i < arrElems.length; i++) {
    if (arrElems[i].color == colorSecondaryTree) {
      let newElemListProduct = child.cloneNode(true);
      newElemListProduct.querySelector('[name="name-product"]').textContent = arrElems[i].nameIngredient;
      newElemListProduct.querySelector('[name="value-product"]').textContent = arrElems[i].amount;
      newElemListProduct.style.background = arrElems[i].color;
      list.appendChild(newElemListProduct);

      if(list === listProduct) arrProductToXLSX[countArrProductToXLSX++] = arrElems[i]
      if(list === listSum) arrSumToXLSX[countArrSumToXLSX++] = arrElems[i]
    }
  }
}
const listSum = document.getElementById("list-sum");
const elemListSum = document.getElementById("elem-list-sum");
const listSumProducts = document.getElementById("list-sum-products");
const elemListSumProducts = document.getElementById("elem-list-sum-products");

function sumStartValueMaterial(arrProduct) {
  allRecipesSum[countAllRecipesSum] = structuredClone(arrProduct); //глубокое копирование
  countAllRecipesSum++;
  console.log(allRecipesSum)

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
  createNewElemList(
    [{
        nameIngredient: arrProduct[0].nameProduct,
        amount: arrProduct[0].outputValue,
        color: colorWhite,
      },
    ],listSumProducts,elemListSumProducts,0);
  arrProduct.splice(0, 1);
  startArrSum = startArrSum.concat(arrProduct);
  createNewElemList(startArrSum, listSum, elemListSum, 0);
}
function deleteProductFromSum(product) {
  console.log(product)
  let deletedArrProduct = [];
  console.log('lenght   ',allRecipesSum.length)
  //получение массива данных удаляемого элемента
  for(let i=0; i<allRecipesSum.length; i++){
    // console.log(allRecipesSum[i][0].nameProduct)
    if(allRecipesSum[i][0].nameProduct === product.nameIngredient
      && allRecipesSum[i][0].outputValue === product.amount){
      // console.log(productName, '[fp[fpg[fpg[')
      // console.log(allRecipesSum[i]) //массив удаляемых ингредиентов
      deletedArrProduct = structuredClone(allRecipesSum[i])
      console.log(allRecipesSum)
      allRecipesSum.splice(i,1); --countAllRecipesSum
      arrSumProductToXLSX.splice(i,1); --countArrSumProductToXLSX;
      break;
    }
  }
  console.log(deletedArrProduct)

  //удаление данных из суммы
  for (let i = 0; i < startArrSum.length; i++) {
    for (let j = 1; j < deletedArrProduct.length; j++) {
      if (startArrSum[i].nameIngredient == deletedArrProduct[j].nameIngredient) {
        let sumAmount = startArrSum[i].amount - deletedArrProduct[j].amount;
        sumAmount = roundN(sumAmount, roundSecondary);
        startArrSum[i].amount = sumAmount;
        if(sumAmount===0) startArrSum.splice(i,1); --i
        deletedArrProduct.splice(j, 1);
        break;
      }
    }
  }
  console.log(allRecipesSum)
  // arrProduct.splice(0, 1);
  // startArrSum = startArrSum.concat(arrProduct);
  createNewElemList(startArrSum, listSum, elemListSum, 0);
}

function cleanList(list) {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  if(list === listProduct){
    arrProductToXLSX = []
    countArrProductToXLSX =0;
  }else if(list === listSum){
    arrSumToXLSX = []
    countArrSumToXLSX =0;
  }
  else if(list === listSumProducts){
  arrSumProductToXLSX = []
  countArrSumProductToXLSX =0;
  }
}


//ПЕРЕДЕЛАТЬ ОБРАБОТЧИК
let search = document.getElementById("search");
search.addEventListener("focus", () => {
  search.value=''
  liveSearch(selectItemsUl, search);
  setSelectedValue(selectItemsUl, search);
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
function liveSearch(parent, search) {
  let listOfElems = parent.children;
  for (let i = 0; i < listOfElems.length; i++) {
    if (
      listOfElems[i].textContent.toLowerCase().includes(search.value.toLowerCase())) {
      listOfElems[i].style.display = "block";
    } else listOfElems[i].style.display = "none";
  }
}
function setSelectedValue(parent, search) {
  let listOfElems = parent.children;
  for (let i = 0; i < listOfElems.length; i++) {
    listOfElems[i].addEventListener("mousedown", (e) => {
      search.value = e.target.textContent;
    });
  }
}
function getIdSelectedValue(input) {
  let idSelectedValue = "";
  for (let i = 0; i < products.length; i++) {
    if (products[i].name === input.value) {
      console.log(products[i].id);
      idSelectedValue = products[i].id;
      break;
    }
  }
  return idSelectedValue;
}


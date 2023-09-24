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
  addElemLocalStorage,
  deleteElemLocalStorage,
  deleteLocalStorageSumProducts,
  deleteLocalStorageReport
} from "../js2/software/storage.js";

import {
  updateSupabaseByLocalStorage,
  updatelLocalStorageBySupabase
}from "../js2/software/supabase.js"


let nav = document.querySelector(".nav");
navigationNav(nav);



import {
  products,
  startValue
} from "../js/data.js";

const btnExportReport = document.getElementById("btn-export-report");
const btnReportUpdateAmount = document.getElementById("btn-report-update-amount");
const btnReportUpdateRemainder = document.getElementById("btn-report-update-remainder");
const btnReportDeleteStorage = document.getElementById("btn-report-delete-storage");
const btnReportCalcSum = document.getElementById("btn-report-calc-sum");
const btnAddAllIngredients = document.getElementById("btn-add-all-ingredients");
const btnAddNewIngredient = document.getElementById("btn-add-new-ingredient");
// const btnSaveNewElem = document.getElementById("btn-save-new-elem");

// let nameNewElem = document.getElementById("name-new-elem");

export const listReport = document.getElementById("list-report");
const elemListReport = document.getElementById("elem-list-report");


btnReportUpdateAmount.addEventListener("click", () => {
  //обнуление всех расходов
  for (let j = 0; j < localStorage.length; j++) {
    let key = localStorage.key(j);
    //получение значений продукта
    let product = JSON.parse(localStorage.getItem(key));
    if(!product.nameProduct){
      //сохранение продукта в локальное хранилище
      let keyNameProduct = product.name; //название ингредиента - ключ
      let obj = {
        name: product.name,
        remainder: product.remainder,
        coming: product.coming,
        amount: 0,
        sum: product.sum,
        color: product.color,
      };
      addElemLocalStorage(obj, keyNameProduct);
    }
  }
  //обновление имеющихся расходов
  //глубокое копирование списка с суммой
  let arrSumToXLSXClone = structuredClone(arrSumToXLSX);
  for (let i = 0; i < arrSumToXLSXClone.length; i++) {
    let repeat = false;
    for (let j = 0; j < localStorage.length; j++) {
      let key = localStorage.key(j);
      //если в хранилище уже есть этот продукт, обновляем только расход
      if (key === arrSumToXLSXClone[i].nameIngredient) {
        repeat = true;
        //получение значений продукта
        let product = JSON.parse(localStorage.getItem(key));
        console.log(arrSumToXLSXClone[i]);
        //сохранение продукта в локальное хранилище
        let keyNameProduct = arrSumToXLSXClone[i].nameIngredient; //название ингредиента - ключ
        let obj = {
          name: product.name,
          remainder: product.remainder,
          coming: product.coming,
          amount: arrSumToXLSXClone[i].amount, //обновление расхода
          // 'sum' : roundN( Number(product.remainder)
          // + Number(product.coming)
          // - Number(arrSumToXLSXClone[i].amount),
          // 3),
          sum: product.sum,
          color: arrSumToXLSXClone[i].color,
        };
        addElemLocalStorage(obj, keyNameProduct);
        break;
      }
    }
    //если в хранилище нет продукта, добавляем как новый
    if (!repeat) {
      //сохранение нового продукта в локальное хранилище
      let keyNameProduct = arrSumToXLSXClone[i].nameIngredient; //название ингредиента - ключ
      let obj = {
        name: arrSumToXLSXClone[i].nameIngredient,
        remainder: 0,
        coming: 0,
        amount: arrSumToXLSXClone[i].amount,
        sum: 0,
        color: arrSumToXLSXClone[i].color,
      };
      addElemLocalStorage(obj, keyNameProduct);
    }
  }
  cleanList(listReport);
  createNewElemList();
  // updateStorageInput();
});
btnReportDeleteStorage.addEventListener("click", () => {
  console.log("delete");
  // localStorage.clear();
  deleteLocalStorageReport()
  cleanList(listReport);
  createNewElemList();
});
btnReportUpdateRemainder.addEventListener("click", () => {
  for (let j = 0; j < localStorage.length; j++) {
    let key = localStorage.key(j);
    //получение значений продукта
    let product = JSON.parse(localStorage.getItem(key));
    if(!product.nameProduct){
      //сохранение продукта в локальное хранилище
      let keyNameProduct = product.name; //название ингредиента - ключ
      let obj = {
        name: product.name,
        remainder: product.sum,
        coming: 0,
        amount: 0,
        sum: 0,
        color: product.color,
      };
      addElemLocalStorage(obj, keyNameProduct);
    }
  }
  cleanList(listReport);
  createNewElemList();
  // updateStorageInput();
});
btnReportCalcSum.addEventListener("click", () => {
  for (let j = 0; j < localStorage.length; j++) {
    let key = localStorage.key(j);
    //получение значений продукта
    let product = JSON.parse(localStorage.getItem(key));
    if(!product.nameProduct){
      //сохранение продукта в локальное хранилище
      let keyNameProduct = product.name; //название ингредиента - ключ
      let obj = {
        name: product.name,
        remainder: product.remainder,
        coming: product.coming,
        amount: product.amount,
        sum: updateSum(product),
        color: product.color,
      };
      addElemLocalStorage(obj, keyNameProduct);
    }
  }
  cleanList(listReport);
  createNewElemList();
  // updateStorageInput();
});
btnAddAllIngredients.addEventListener("click", () => {
  //очистка хранилища и списка
  // localStorage.clear();
  deleteLocalStorageReport()
  cleanList(listReport);
  //заполнение хранилища
  for (let i = 0; i < products.length; i++) {
    products[i].ingredientsPrimary.forEach((ingredient) => {
      let keyNameProduct = ingredient.nameIngredient; //название ингредиента - ключ
      let obj = {
        name: ingredient.nameIngredient,
        remainder: 0,
        coming: 0,
        amount: 0,
        sum: 0,
        color: setColorPrimary(ingredient),
      };
      addElemLocalStorage(obj, keyNameProduct);
      // console.log(ingredient.nameIngredient)
    });
    products[i].ingredientsSecondary.forEach((ingredient) => {
      let keyNameProduct = ingredient.nameIngredient; //название ингредиента - ключ
      let obj = {
        name: ingredient.nameIngredient,
        remainder: 0,
        coming: 0,
        amount: 0,
        sum: 0,
        color: setColorSecondary(ingredient),
      };
      addElemLocalStorage(obj, keyNameProduct);
      // console.log(ingredient.nameIngredient)
    });
  }
  function setColorPrimary(ingredient) {
    if (
      ingredient.nameIngredient.includes("орех") ||
      ingredient.nameIngredient.includes("изолят") ||
      ingredient.nameIngredient.includes("клетчатка") ||
      ingredient.nameIngredient.includes("крахмал") ||
      ingredient.nameIngredient.includes("крупа") ||
      ingredient.nameIngredient.includes("лук") ||
      ingredient.nameIngredient.includes("меланж") ||
      ingredient.nameIngredient.includes("мука") ||
      ingredient.nameIngredient.includes("молоко")
    ) return colorPrimaryThree;
    else return colorPrimaryTwo;
  }
  function setColorSecondary(ingredient) {
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

  //вывод хранилища в список
  createNewElemList();
  //обработчик
  // updateStorageInput();
});
//модалка для добавление нового ингредиента
const modalSaveIngredient = document.getElementById('modal-save-ingredient');
btnAddNewIngredient.addEventListener('click', ()=>{
  modalSaveIngredient.style.display = "block";
})
// let categoryPrimary = document.getElementsByName("category-primary");
// // динамика отображения подгрупп
// for (let i = 0; i < categoryPrimary.length; i++) {
//   let second1 = document.querySelector(".second1");
//   let second2 = document.querySelector(".second2");
//   let second3 = document.querySelector(".second3");
//   categoryPrimary[i].addEventListener("change", () => {
//     if (categoryPrimary[i].checked) {
//       if (
//         categoryPrimary[i].closest(".adding__radioElem ").querySelector("h3")
//           .textContent === "специи"
//       ) {
//         console.log("перебор подгруппы специй");
//         second1.style.display = "flex";
//         second2.style.display = "flex";
//         second3.style.display = "flex";
//       } else {
//         console.log("перебор подгруппы сырья");
//         second1.style.display = "none";
//         second2.style.display = "none";
//         second3.style.display = "none";
//       }
//       // console.log(categoryPrimary[i].closest('.adding__radioElem ').querySelector('h3').textContent)
//     }
//   });
// }
// btnAddNewIngredient.addEventListener("click", () => {
//   if (addingBlock.style.display === "none") {
//     listSumBlock.style.display = "none";
//     addingBlock.style.display = "flex";
//   } else {
//     listSumBlock.style.display = "flex";
//     addingBlock.style.display = "none";
//   }
// });
// btnSaveNewElem.addEventListener("click", () => {
//   //сохранение нового продукта в локальное хранилище
//   let keyNameProduct = nameNewElem.value; //название ингредиента - ключ
//   let obj = {
//     name: nameNewElem.value,
//     remainder: 0,
//     coming: 0,
//     amount: 0,
//     sum: 0,
//     color: getColorNewElem(),
//   };
//   addElemLocalStorage(obj, keyNameProduct);
//   cleanList(listReport);
//   createNewElemList();
//   updateStorageInput();

//   function getColorNewElem() {
//     let categoryPrimary = document.getElementsByName("category-primary");
//     for (let i = 0; i < categoryPrimary.length; i++) {
//       if (categoryPrimary[i].checked) {
//         if (
//           categoryPrimary[i].closest(".adding__radioElem").querySelector("h3")
//             .textContent === "специи"
//         ) {
//           // console.log('перебор подгруппы специй')
//           let categorySecondary =
//             document.getElementsByName("category-secondary");
//           for (let j = 0; j < categorySecondary.length; j++) {
//             if (categorySecondary[j].checked) {
//               if (
//                 categorySecondary[j]
//                   .closest(".adding__radioElem")
//                   .querySelector("h4").textContent === "природные"
//               ) {
//                 return colorSecondaryOne;
//               } else if (
//                 categorySecondary[j]
//                   .closest(".adding__radioElem")
//                   .querySelector("h4").textContent === "химозные"
//               ) {
//                 return colorSecondaryTwo;
//               } else return colorSecondaryTree;
//             }
//           }
//         } else {
//           return colorPrimaryTwo;
//         }
//         // console.log(categoryPrimary[i].closest('.adding__radioElem ').querySelector('h3').textContent)
//       }
//     }
//   }
// });

btnExportReport.addEventListener("click", () => {
  let arr = [];
  let countArr = 0;
  //создаем дубликат хранилища
  for (let j = 0; j < localStorage.length; j++) {
    let key = localStorage.key(j);
    //получение значений продукта
    let product = JSON.parse(localStorage.getItem(key));
    if(!product.nameProduct){
      arr[countArr++] = product;
    }
  }
  //фильтрация по алфавиту и цвету
  arr = filterArrProduct(arr);

  //убираем цвет
  for (let i = 0; i < arr.length; i++) {
    delete arr[i].color;
  }
  // console.log(arr)

  //создаем рабочий лист и рабочую тетрадь
  const worksheet = XLSX.utils.json_to_sheet(arr);
  const workbook = XLSX.utils.book_new();
  //исправить заголовки начиная с а1
  XLSX.utils.sheet_add_aoa(
    worksheet,
    [["Наименование", "Остаток на", "Приход", "Расход", "Остаток на"]],
    { origin: "A1" }
  );
  //рассчитать ширину столбца на 100 символов
  worksheet["!cols"] = [
    { wpx: 200 }, //a
    { wpx: 60 }, //b
    { wpx: 60 },
    { wpx: 60 },
    { wpx: 60 },
  ]; //c

  //добавление рабочего листа в рабочую тетрадь
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  // создаем xlsx файл и пробуем сохранить его локально
  XLSX.writeFile(workbook, "Perort.xlsx");
});
function filterArrProduct(arrElem) {
  let newElemArr = [];
  let countNewElemArr = 0;

  //сортировка по алфавиту, начиная с 1го
  arrElem.sort((a, b) => (a.name > b.name ? 1 : -1)); //сортировка массива

  //перебор оставшегося массива по цветам
  for (let i = 1; i < arrElem.length; i++) {
    if (arrElem[i].color == colorPrimaryOne) {
      newElemArr[countNewElemArr++] = arrElem[i];
    }
  }
  for (let i = 1; i < arrElem.length; i++) {
    if (arrElem[i].color == colorPrimaryTwo) {
      newElemArr[countNewElemArr++] = arrElem[i];
    }
  }
  for (let i = 1; i < arrElem.length; i++) {
    if (arrElem[i].color == colorPrimaryThree) {
      newElemArr[countNewElemArr++] = arrElem[i];
    }
  }
  for (let i = 1; i < arrElem.length; i++) {
    if (arrElem[i].color == colorSecondaryOne) {
      newElemArr[countNewElemArr++] = arrElem[i];
    }
  }
  for (let i = 1; i < arrElem.length; i++) {
    if (arrElem[i].color == colorSecondaryTwo) {
      newElemArr[countNewElemArr++] = arrElem[i];
    }
  }
  for (let i = 1; i < arrElem.length; i++) {
    if (arrElem[i].color == colorSecondaryTree) {
      newElemArr[countNewElemArr++] = arrElem[i];
    }
  }
  return newElemArr;
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

// export function updateStorageInput() {
//   let arrElems = listReport.children;
//   for (let i = 0; i < arrElems.length; i++) {
//     arrElems[i].querySelector('[name="coming"]').addEventListener("input", () => {
//         // updateSum(arrElems[i]);
//         for (let j = 0; j < localStorage.length; j++) {
//           let key = localStorage.key(j);
//           if (key ===arrElems[i].querySelector('[name="name-product"]').textContent) {
//             //получение значений продукта
//             let product = JSON.parse(localStorage.getItem(key));
//             let keyNameProduct = product.name;
//             let obj = {
//               name: product.name,
//               remainder: product.remainder,
//               coming: Number(
//                 arrElems[i].querySelector('[name="coming"]').value
//               ), //обновление расхода
//               amount: product.amount,
//               // 'sum' : updateSum(arrElems[i]),
//               sum: product.sum,
//               color: product.color,
//             };
//             addElemLocalStorage(obj, keyNameProduct);
//             checkSum(
//               arrElems[i],
//               arrElems[i].querySelector('[name="remainder-sum"]').value
//             );
//             break;
//           }
//         }
//       });
//     arrElems[i].querySelector('[name="amount"]').addEventListener("input", () => {
//         // updateSum(arrElems[i]);
//         for (let j = 0; j < localStorage.length; j++) {
//           let key = localStorage.key(j);
//           if (
//             key ===
//             arrElems[i].querySelector('[name="name-product"]').textContent
//           ) {
//             //получение значений продукта
//             let product = JSON.parse(localStorage.getItem(key));
//             let keyNameProduct = product.name;
//             let obj = {
//               name: product.name,
//               remainder: product.remainder,
//               coming: product.coming, //обновление
//               amount: Number(
//                 arrElems[i].querySelector('[name="amount"]').value
//               ),
//               // 'sum' : updateSum(arrElems[i]),
//               sum: product.sum,
//               color: product.color,
//             };
//             addElemLocalStorage(obj, keyNameProduct);
//             checkSum(
//               arrElems[i],
//               arrElems[i].querySelector('[name="remainder-sum"]').value
//             );
//             break;
//           }
//         }
//       });
//     arrElems[i].querySelector('[name="remainder"]').addEventListener("input", () => {
//         // updateSum(arrElems[i]);
//         for (let j = 0; j < localStorage.length; j++) {
//           let key = localStorage.key(j);
//           if (
//             key ===
//             arrElems[i].querySelector('[name="name-product"]').textContent
//           ) {
//             //получение значений продукта
//             let product = JSON.parse(localStorage.getItem(key));
//             let keyNameProduct = product.name;
//             let obj = {
//               name: product.name,
//               remainder: Number(
//                 arrElems[i].querySelector('[name="remainder"]').value
//               ),
//               coming: product.coming, //обновление расхода
//               amount: product.amount,
//               // 'sum' : updateSum(arrElems[i]),
//               sum: product.sum,
//               color: product.color,
//             };
//             addElemLocalStorage(obj, keyNameProduct);
//             checkSum(
//               arrElems[i],
//               arrElems[i].querySelector('[name="remainder-sum"]').value
//             );
//             break;
//           }
//         }
//       });
//     arrElems[i].querySelector('[name="remainder-sum"]').addEventListener("input", () => {
//         // updateSum(arrElems[i]);
//         for (let j = 0; j < localStorage.length; j++) {
//           let key = localStorage.key(j);
//           if (
//             key ===
//             arrElems[i].querySelector('[name="name-product"]').textContent
//           ) {
//             //получение значений продукта
//             let product = JSON.parse(localStorage.getItem(key));
//             let keyNameProduct = product.name;
//             let obj = {
//               name: product.name,
//               remainder: product.remainder,
//               coming: product.coming,
//               amount: product.amount,
//               sum: Number(
//                 arrElems[i].querySelector('[name="remainder-sum"]').value
//               ),
//               color: product.color,
//             };
//             addElemLocalStorage(obj, keyNameProduct);
//             // console.log(arrElems[i].querySelector('[name="remainder-sum"]').value)
//             checkSum(
//               arrElems[i],
//               arrElems[i].querySelector('[name="remainder-sum"]').value
//             );
//             break;
//           }
//         }
//       });
//   }
//   //при вводе данных пересчитываем сумму
//   function updateSum(elem) {
//     elem.querySelector('[name="remainder-sum"]').value = roundN(
//       Number(elem.querySelector('[name="remainder"]').value) +
//         Number(elem.querySelector('[name="coming"]').value) -
//         Number(elem.querySelector('[name="amount"]').value),
//       3
//     );
//     return elem.querySelector('[name="remainder-sum"]').value;
//   }
// }

function updateSum(product) {
  let sum = roundN(
    Number(product.remainder) + Number(product.coming) - Number(product.amount),
    3
  );
  return sum;
}
function checkSum(elem, value) {
  let sum = roundN(
    Number(elem.querySelector('[name="remainder"]').value) +
      Number(elem.querySelector('[name="coming"]').value) -
      Number(elem.querySelector('[name="amount"]').value),
    3
  );
  if (sum > value) {
    elem.querySelector('[name="hint"]').style.color = "red";
    elem.querySelector('[name="hint"]').value = roundN(value - sum, 3);
    elem.querySelector('[name="coming"]').style.color = "red";
    elem.querySelector('[name="amount"]').style.color = "red";
    elem.querySelector('[name="coming"]').style.borderColor = "red";
    elem.querySelector('[name="amount"]').style.borderColor = "red";
  } else if (sum < value) {
    elem.querySelector('[name="hint"]').style.color = "green";
    elem.querySelector('[name="hint"]').value = roundN(value - sum, 3);
    elem.querySelector('[name="coming"]').style.color = "green";
    elem.querySelector('[name="amount"]').style.color = "green";
    elem.querySelector('[name="coming"]').style.borderColor = "green";
    elem.querySelector('[name="amount"]').style.borderColor = "green";
  } else if (sum == value) {
    elem.querySelector('[name="hint"]').style.color = "black";
    elem.querySelector('[name="hint"]').value = roundN(value - sum, 3);
    elem.querySelector('[name="hint"]').style.color = "white";
    elem.querySelector('[name="coming"]').style.color = "black";
    elem.querySelector('[name="amount"]').style.color = "black";
    elem.querySelector('[name="coming"]').style.borderColor = "black";
    elem.querySelector('[name="amount"]').style.borderColor = "black";
  }
}

export function createNewElemList() {
  let arrProductsClone = [];
  let countArrProductsClone = 0;
  //глубокое копирование хранилища
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    let product = JSON.parse(localStorage.getItem(key));
    if(!product.nameProduct){
      arrProductsClone[countArrProductsClone++] = structuredClone(product);
    }
  }

  //сортировка по алфавиту
  arrProductsClone.sort((a, b) => (a.name > b.name ? 1 : -1));
  //вывод списка с хранилища
  for (let i = 0; i < arrProductsClone.length; i++) {
    if (arrProductsClone[i].color == colorWhite) {
      addInList(arrProductsClone[i]);
    }
  }
  for (let i = 0; i < arrProductsClone.length; i++) {
    if (arrProductsClone[i].color == colorPrimaryOne) {
      addInList(arrProductsClone[i]);
    }
  }
  for (let i = 0; i < arrProductsClone.length; i++) {
    if (arrProductsClone[i].color == colorPrimaryTwo) {
      addInList(arrProductsClone[i]);
    }
  }
  for (let i = 0; i < arrProductsClone.length; i++) {
    if (arrProductsClone[i].color == colorPrimaryThree) {
      addInList(arrProductsClone[i]);
    }
  }
  for (let i = 0; i < arrProductsClone.length; i++) {
    if (arrProductsClone[i].color == colorSecondaryOne) {
      addInList(arrProductsClone[i]);
    }
  }
  for (let i = 0; i < arrProductsClone.length; i++) {
    if (arrProductsClone[i].color == colorSecondaryTwo) {
      addInList(arrProductsClone[i]);
    }
  }
  for (let i = 0; i < arrProductsClone.length; i++) {
    if (arrProductsClone[i].color == colorSecondaryTree) {
      addInList(arrProductsClone[i]);
    }
  }
  function addInList(product) {
    let newElemListProduct = elemListReport.cloneNode(true);
    newElemListProduct.querySelector('[name="name-product"]').textContent = product.name;
    newElemListProduct.querySelector('[name="remainder"]').value = product.remainder;
    newElemListProduct.querySelector('[name="coming"]').value = product.coming;
    newElemListProduct.querySelector('[name="amount"]').value = product.amount;
    newElemListProduct.querySelector('[name="remainder-sum"]').value = product.sum;
    newElemListProduct.style.background = product.color;
    listReport.appendChild(newElemListProduct);
    checkSum(
      newElemListProduct,
      newElemListProduct.querySelector('[name="remainder-sum"]').value
    );

    newElemListProduct.querySelector(".sign").addEventListener("click", () => {
      //обновление внешнее (только список)
      let newSum = roundN(
        Number(newElemListProduct.querySelector('[name="remainder"]').value) +
          Number(newElemListProduct.querySelector('[name="coming"]').value) -
          Number(newElemListProduct.querySelector('[name="amount"]').value),
        3
      );
      newElemListProduct.querySelector('[name="remainder-sum"]').value = newSum;

      //обновление элемента с экрана
      let keyNameProduct = product.name; //название ингредиента - ключ
      let obj = {
        name: product.name,
        remainder: Number(
          newElemListProduct.querySelector('[name="remainder"]').value
        ),
        coming: Number(
          newElemListProduct.querySelector('[name="coming"]').value
        ),
        amount: Number(
          newElemListProduct.querySelector('[name="amount"]').value
        ),
        sum: newSum, //внутренне обновление суммы одного элемента
        color: product.color,
      };
      addElemLocalStorage(obj, keyNameProduct);

      checkSum(
        newElemListProduct,
        newElemListProduct.querySelector('[name="remainder-sum"]').value
      );
    });

    newElemListProduct.querySelector(".delete").addEventListener("click", () => {
        // newElemListProduct.remove(); //удаление с экрана
        listReport.removeChild(newElemListProduct);  //удаление с экрана
        let keyNameProduct = product.name; //название ингредиента - ключ
        deleteElemLocalStorage(keyNameProduct); //удаление с хранилища
    });

    addEventInputElem(newElemListProduct);
  }
}

window.addEventListener("load", () => {
  //вывод списка на экран
  cleanList(listReport);
  createNewElemList();
  //обновление списка (длина списка !=0)
  // updateStorageInput();


  // updatelLocalStorageBySupabase() зде ь через await
  // cleanList(listReport);
  // createNewElemList();
});
export function cleanList(list) {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}


//РЕАЛИЗАЦИЯ ПОИСКА
let search = document.getElementById("report-search");

search.addEventListener("focus", () => {
  search.value = "";
  liveSearch(listReport, search);
});
search.addEventListener("keyup", () => {
  liveSearch(listReport, search);
});

//supabase
const btnExportSupabase = document.getElementById("btn-export-supabase");
const btnImportSupabase = document.getElementById("btn-import-supabase");

btnExportSupabase.addEventListener("click", () => {
  updateSupabaseByLocalStorage()
});
btnImportSupabase.addEventListener("click", () => {
  importData()
});

async function importData(){
  await updatelLocalStorageBySupabase();

  cleanList(listReport);
  createNewElemList();
}

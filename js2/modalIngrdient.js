import {
  colorPrimaryOne,
  colorPrimaryTwo,
  colorPrimaryThree,
  colorSecondaryOne,
  colorSecondaryTwo,
  colorSecondaryTree,
  colorWhite,
} from "./commonFunc.js";

// import {
//   products,
//   startValue
// } from "../js/data.js";

import {
  addElemLocalStorage,
  // deleteElemLocalStorage,
  deleteLocalStorageSumProducts,
} from "../js2/software/storage.js";

  
//   import {
//     updatelLocalStorageBySupabase
//   } from "./supabase.js"

const btnSaveNewIngredient = document.getElementById("btn-save-new-ingredient");
const btnCancelModal = document.querySelector(".cancel")
let nameNewIngredient = document.getElementById("name-new-ingredient");
  
  // export const listReport = document.getElementById("list-report");
  // const elemListReport = document.getElementById("elem-list-report");

//модалка для добавление нового ингредиента
const modalSaveIngredient = document.getElementById('modal-save-ingredient');

btnCancelModal.addEventListener('click', ()=>{
  console.log('кукусики')
  modalSaveIngredient.style.display = "none";
})

let categoryPrimary = document.getElementsByName("category-primary");  //сырье/специи

window.addEventListener('load', ()=>{
  showCategory()
})
function showCategory(){
  // динамика отображения подгрупп при первоначльной загрузке
  for (let i = 0; i < categoryPrimary.length; i++) { //перебор 2х кнопок
  //подгруппа специй
    let second1 = document.querySelector(".second1");
    let second2 = document.querySelector(".second2");
    let second3 = document.querySelector(".second3");

    //подгруппа сырья
    let second4 = document.querySelector(".second4");
    let second5 = document.querySelector(".second5");

    //для первоначального отображения
    if (categoryPrimary[i].checked) {
      if (categoryPrimary[i].closest(".adding__radioElem ").querySelector("h3").textContent === "специи") {
        console.log("перебор подгруппы специй");
        second1.style.display = "flex";
        second2.style.display = "flex";
        second3.style.display = "flex";

        second4.style.display = "none";
        second5.style.display = "none";

      } else {
        console.log("перебор подгруппы сырья");
        second4.style.display = "flex";
        second5.style.display = "flex";

        second1.style.display = "none";
        second2.style.display = "none";
        second3.style.display = "none";
      }
    }

    //для изменения отображения в зависимости от кнопок
    categoryPrimary[i].addEventListener("change", () => { //слушатель на каждую кнопку
      if (categoryPrimary[i].checked) {
        if (categoryPrimary[i].closest(".adding__radioElem ").querySelector("h3").textContent === "специи") {
          console.log("перебор подгруппы специй");
          second1.style.display = "flex";
          second2.style.display = "flex";
          second3.style.display = "flex";

          second4.style.display = "none";
          second5.style.display = "none";

        } else {
          console.log("перебор подгруппы сырья");
          second4.style.display = "flex";
          second5.style.display = "flex";

          second1.style.display = "none";
          second2.style.display = "none";
          second3.style.display = "none";
        }
      }
    });
  }
}

btnSaveNewIngredient.addEventListener("click", () => {
  //сохранение нового продукта в локальное хранилище
  let keyNameProduct = nameNewIngredient.value; //название ингредиента - ключ
    let obj = {
      name: nameNewIngredient.value,
      remainder: 0,
      coming: 0,
      amount: 0,
      sum: 0,
      color: getColorNewElem(),
    };
    addElemLocalStorage(obj, keyNameProduct);

    //отрисовка нового списка на экране
    // cleanList(listReport);
    // createNewElemList();
    // updateStorageInput();
  
    function getColorNewElem() {
      let categoryPrimary = document.getElementsByName("category-primary");
      for (let i = 0; i < categoryPrimary.length; i++) {
        if (categoryPrimary[i].checked) {
          if (categoryPrimary[i].closest(".adding__radioElem").querySelector("h3").textContent === "специи") {
            // console.log('перебор подгруппы специй')
            let categorySecondary = document.getElementsByName("category-secondary");
            for (let j = 0; j < categorySecondary.length; j++) {
              if (categorySecondary[j].checked) {
                if (categorySecondary[j].closest(".adding__radioElem").querySelector("h3").textContent === "природные") {
                  return colorSecondaryOne;
                } else if (categorySecondary[j].closest(".adding__radioElem").querySelector("h3").textContent === "химозные") {
                  return colorSecondaryTwo;
                } else return colorSecondaryTree;
              }
            }
          } else {
            // console.log('перебор подгруппы сырья')
            let categorySecondary = document.getElementsByName("category-secondary2");
            for (let j = 0; j < categorySecondary.length; j++) {
              if (categorySecondary[j].checked) {
                if (categorySecondary[j].closest(".adding__radioElem").querySelector("h3").textContent === "основные") {
                  return colorPrimaryTwo;
                } else return colorPrimaryThree;
              }
            }
          }
          // console.log(categoryPrimary[i].closest('.adding__radioElem ').querySelector('h3').textContent)
        }
      }
    }

    modalSaveIngredient.style.display = "none";
  });






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
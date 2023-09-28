import {
  colorPrimaryOne,
  colorPrimaryTwo,
  colorPrimaryThree,
  colorSecondaryOne,
  colorSecondaryTwo,
  colorSecondaryTree,
  liveSearch,
  colorWhite,
  CATEGORY,
  SUBCATEGORY_PRIMARY,
  SUBCATEGORY_SECONDARY,
  getSubcategoryByCategory,
  getCategoryByColor,
  getSubcategoryByColor,
  getColorBySubcategory,
  cleanList,
  isOpenModal,
  getObjIngredient,
} from "./commonFunc.js";

import {
  getDataIngredients,
  setDataIngredients,
}from "../js2/software/supabase.js"


//модалка для загрузки
const modalLoad = document.getElementById('modal-load');
//модалка для добавление нового ингредиента
const modalSaveIngredient = document.getElementById('modal-save-ingredient');

window.addEventListener('load', ()=>{
  createNewElemListIngredients();
})

let oneIngredient = modalSaveIngredient.querySelector('.adding-product__ingredient');

let searchIngredient = oneIngredient.querySelector('[name="search-ingredient"]');
searchIngredient.value = '';

let searchCategory = oneIngredient.querySelector('[name="search-category"]');
searchCategory.value = getCategoryByColor('');
let selectCategory = oneIngredient.querySelector('[name="select-category"]');

let searchSubcategory = oneIngredient.querySelector('[name="search-subcategory"]');
searchSubcategory.value = getSubcategoryByColor('');
let selectSubcategory = oneIngredient.querySelector('[name="select-subcategory"]');

function createNewElemListIngredients() {
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
          searchCategory.value = getCategoryByColor('');
          searchSubcategory.value = getSubcategoryByColor('');
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
        searchCategory.value = getCategoryByColor('');
          searchSubcategory.value = getSubcategoryByColor('');
      }
  });
  searchSubcategory.addEventListener("keyup", () => {
      liveSearch(selectSubcategory, searchSubcategory);
  });

  const btnUpdateProduct = modalSaveIngredient.querySelector('[name="btn-update-product"]');

  const btnCancelModalSaveIngredient = modalSaveIngredient.querySelector('[name="btn-delete-product"]');
  btnCancelModalSaveIngredient.addEventListener('click', ()=>{
    modalSaveIngredient.style.display = 'none';
  })
}
export async function saveNewIngredientInSupabase (){
  let objIngredient = getObjIngredient(modalSaveIngredient);
  //добавление айдишника
  let dataIngredients = await getDataIngredients();
  objIngredient.id = dataIngredients.length+1;
  isOpenModal(modalLoad,true)
  // isOpenModalLoad(true);
  //сохранение в базу ингредиентов
  await setDataIngredients(objIngredient);
  isOpenModal(modalLoad,false);
  // isOpenModalLoad(false);
  isOpenModal(modalSaveIngredient,false);
  // modalSaveIngredient.style.display = "none";
}








// let categoryPrimary = document.getElementsByName("category-primary");  //сырье/специи

// window.addEventListener('load', ()=>{
//   showCategory()
// })
// function showCategory(){
//   // динамика отображения подгрупп при первоначльной загрузке
//   for (let i = 0; i < categoryPrimary.length; i++) { //перебор 2х кнопок
//   //подгруппа специй
//     let second1 = document.querySelector(".second1");
//     let second2 = document.querySelector(".second2");
//     let second3 = document.querySelector(".second3");

//     //подгруппа сырья
//     let second4 = document.querySelector(".second4");
//     let second5 = document.querySelector(".second5");

//     //для первоначального отображения
//     if (categoryPrimary[i].checked) {
//       if (categoryPrimary[i].closest(".adding__radioElem ").querySelector("h3").textContent === "специи") {
//         console.log("перебор подгруппы специй");
//         second1.style.display = "flex";
//         second2.style.display = "flex";
//         second3.style.display = "flex";

//         second4.style.display = "none";
//         second5.style.display = "none";

//       } else {
//         console.log("перебор подгруппы сырья");
//         second4.style.display = "flex";
//         second5.style.display = "flex";

//         second1.style.display = "none";
//         second2.style.display = "none";
//         second3.style.display = "none";
//       }
//     }

//     //для изменения отображения в зависимости от кнопок
//     categoryPrimary[i].addEventListener("change", () => { //слушатель на каждую кнопку
//       if (categoryPrimary[i].checked) {
//         if (categoryPrimary[i].closest(".adding__radioElem ").querySelector("h3").textContent === "специи") {
//           console.log("перебор подгруппы специй");
//           second1.style.display = "flex";
//           second2.style.display = "flex";
//           second3.style.display = "flex";

//           second4.style.display = "none";
//           second5.style.display = "none";

//         } else {
//           console.log("перебор подгруппы сырья");
//           second4.style.display = "flex";
//           second5.style.display = "flex";

//           second1.style.display = "none";
//           second2.style.display = "none";
//           second3.style.display = "none";
//         }
//       }
//     });
//   }
// }

// btnSaveNewIngredient.addEventListener("click", () => {
//   //сохранение нового продукта в локальное хранилище
//   let keyNameProduct = nameNewIngredient.value; //название ингредиента - ключ
//     let obj = {
//       name: nameNewIngredient.value,
//       remainder: 0,
//       coming: 0,
//       amount: 0,
//       sum: 0,
//       color: getColorNewElem(),
//     };
//     addElemLocalStorage(obj, keyNameProduct);

//     //отрисовка нового списка на экране
//     // cleanList(listReport);
//     // createNewElemList();
//     // updateStorageInput();
  
//     function getColorNewElem() {
//       let categoryPrimary = document.getElementsByName("category-primary");
//       for (let i = 0; i < categoryPrimary.length; i++) {
//         if (categoryPrimary[i].checked) {
//           if (categoryPrimary[i].closest(".adding__radioElem").querySelector("h3").textContent === "специи") {
//             // console.log('перебор подгруппы специй')
//             let categorySecondary = document.getElementsByName("category-secondary");
//             for (let j = 0; j < categorySecondary.length; j++) {
//               if (categorySecondary[j].checked) {
//                 if (categorySecondary[j].closest(".adding__radioElem").querySelector("h3").textContent === "природные") {
//                   return colorSecondaryOne;
//                 } else if (categorySecondary[j].closest(".adding__radioElem").querySelector("h3").textContent === "химозные") {
//                   return colorSecondaryTwo;
//                 } else return colorSecondaryTree;
//               }
//             }
//           } else {
//             // console.log('перебор подгруппы сырья')
//             let categorySecondary = document.getElementsByName("category-secondary2");
//             for (let j = 0; j < categorySecondary.length; j++) {
//               if (categorySecondary[j].checked) {
//                 if (categorySecondary[j].closest(".adding__radioElem").querySelector("h3").textContent === "основные") {
//                   return colorPrimaryTwo;
//                 } else return colorPrimaryThree;
//               }
//             }
//           }
//           // console.log(categoryPrimary[i].closest('.adding__radioElem ').querySelector('h3').textContent)
//         }
//       }
//     }

//     modalSaveIngredient.style.display = "none";
//   });

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
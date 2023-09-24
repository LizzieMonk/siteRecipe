// import {
//     cleanList,
//     listReport,
//     createNewElemList,
//   } from "../report.js";

  import {
    colorPrimaryOne,
    colorPrimaryTwo,
    colorPrimaryThree,
    colorSecondaryOne,
    colorSecondaryTwo,
    colorSecondaryTree,
    colorWhite,
  } from "../commonFunc.js";

  import {
    addElemLocalStorage,
    deleteLocalStorageReport
  } from "./storage.js";

  import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
  // const { createClient } = supabase

  const _supabase = createClient(
    "https://cdwhmgrvcopgzerbhmui.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkd2htZ3J2Y29wZ3plcmJobXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQzMzYwNjksImV4cCI6MjAwOTkxMjA2OX0.fcu2NCaTAC7RxURmPHXUKqm7p3-sCv4e9f2mg0c6jJg"
  );

  async function ll() {
      // await deleteAllDataSupabase()
    let dataReport = await getDataReport();
    let id = dataReport.length + 1; //значение id для создания следующего элемента
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let isInTheDatabase = false;
      //если в базе есть, обновляем
      for (let j = 0; j < dataReport.length; j++) {
        if (dataReport[j].name === key) {
          let product = JSON.parse(localStorage.getItem(key));
          let obj = {
            name: product.name,
            remainder: Number(product.remainder),
            coming: Number(product.coming),
            amount: Number(product.amount),
            sum: Number(product.sum),
            color: product.color,
          };
          updateDataReport(obj, dataReport[j].id);
          isInTheDatabase = true;
          break;
        }
      }
      //если в базе нет, добавляем как новый
      if (!isInTheDatabase) {
        let product = JSON.parse(localStorage.getItem(key));
        let idObj = id++;
        let obj = {
          id: idObj,
          name: product.name,
          remainder: Number(product.remainder),
          coming: Number(product.coming),
          amount: Number(product.amount),
          sum: Number(product.sum),
          color: product.color,
        };
        setDataReport(obj);
      }
    }
  
    //удаляем в базе те, которых нет в локальном хранилище
    // for(let i=0; i<dataReport.length; i++){
    //     let isInTheDatabase = false;
    //     for(let j=0; j<localStorage.length; j++){
    //         let key = localStorage.key(j);
    //         if(dataReport[i].name === key){
    //             isInTheDatabase = true;
    //             break;
    //         }
    //     }
    //     if(!isInTheDatabase){
    //         // deleteDataReport(dataReport[i].id)
    //         // deleteDataReport(3)
    //         // let startValue = dataReport[i].id+1;
    //         let startValue = 4;
    //         console.log('используемая длина', dataReport.length)
    //         for(let j=startValue; j<--dataReport.length; j++){  //начиная со слд элемента
    //             // await deleteDataReport(j)
    //             let product = dataReport[j+1];
    //             // let idObj = j;
    //             // let obj = {
    //             //     'id': idObj,
    //             //     'name' : product.name,
    //             //     'remainder' : product.remainder,
    //             //     'coming' : product.coming,
    //             //     'amount' : product.amount,
    //             //     'sum': product.sum,
    //             //     'color': product.color,
    //             // }
    //             console.log(product)
    //             console.log('используемая длина', dataReport.length)
    //             // await setDataReport(obj)
    //         }
    //         // lengthDeletedArr--;
    //     }
    // }
  }

  async function deleteAllDataSupabase(){
      let dataReport = await getDataReport();
      for(let i=0; i < dataReport.length; i++){
          // await deleteDataReport(i+1)
          await deleteDataReport(dataReport[i].id)
      }
  }
  async function prob(){
      console.log('начало')
      isOpenModalLoad(true)
      let dataReport = await getDataReport();
      for(let i=70; i<dataReport.length; i++){
        let dataReportTwo = await getDataReport();
      }
      console.log('конец')
      isOpenModalLoad(false)
  }

  export async function updateSupabaseByLocalStorage(){
      // let dataReport = await getDataReport() //length =0
      isOpenModalLoad(true)
      //очистка базы
      await deleteAllDataSupabase()
  
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
              remainder: Number(product.remainder),
              coming: Number(product.coming),
              amount: Number(product.amount),
              sum: Number(product.sum),
              color: product.color,
            };
            await setDataReport(obj);
          }
      }
      isOpenModalLoad(false)
  }

  export async function updatelLocalStorageBySupabase() {
    isOpenModalLoad(true)
    //очистка хранилища
    // localStorage.clear();
    deleteLocalStorageReport()
    //заполнение хранилища базой
    let dataReport = await getDataReport();
    console.log(dataReport)
    for (let i = 0; i < dataReport.length; i++) {
      //сохранение нового продукта в локальное хранилище
      let keyNameProduct = dataReport[i].name; //название ингредиента - ключ
      let obj = {
        name: dataReport[i].name,
        remainder: dataReport[i].remainder,
        coming: dataReport[i].coming,
        amount: dataReport[i].amount,
        sum: dataReport[i].sum,
        color: dataReport[i].color,
      };
      addElemLocalStorage(obj, keyNameProduct);
    }
  
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let product = JSON.parse(localStorage.getItem(key));
      console.log(product)
    }
    isOpenModalLoad(false)
  }

//---------------------report

  //получение данных
  export async function getDataReport() {
    const { data, error } = await _supabase.from("report").select();
  
    return data; //promise
  }

  //добавление новых данных
  async function setDataReport(obj) {
    const { error } = await _supabase.from("report").insert(
      obj
      // {
      //     id: 4,
      //     name: 'newName',
      //     remainder: 1,
      //     coming: 1,
      //     amount: 1,
      //     sum: 1
      // }
    );
  }

  //обновление данных по id
  export async function updateDataReport(obj, id) {
    const { error } = await _supabase
      .from("report")
      .update(
        obj
        // {name: 'newName', amount: 2,}
      )
      .eq("id", id);
  }

  //удаление данных по id
  async function deleteDataReport(id) {
    const { error } = await _supabase
    .from("report")
    .delete()
    .eq("id", id);
  }
//---------------------ingredients

  //получение данных
 export async function getDataIngredients() {
    const { data, error } = await _supabase.from("ingredients").select();
    return data; //promise
  }

  //добавление новых данных
 export async function setDataIngredients(obj) {
    const { error } = await _supabase.from("ingredients").insert(
      obj
    );
  }

  //обновление данных по id
  export async function updateDataIngredients(obj, id) {
    const { error } = await _supabase
      .from("ingredients")
      .update(
        obj
      )
      .eq("id", id);
  }

  //удаление данных по id
  async function deleteDataIngredients(id) {
    const { error } = await _supabase
    .from("ingredients")
    .delete()
    .eq("id", id);
  }
//---------------------products

  //получение данных
 export async function getDataProducts() {
    const { data, error } = await _supabase.from("recipes").select();
    return data; //promise
  }

  //добавление новых данных
 export async function setDataProducts(obj) {
    const { error } = await _supabase.from("recipes").insert(
      obj
    );
  }

  //обновление данных по id
  export async function updateDataProducts(obj, id) {
    const { error } = await _supabase
      .from("recipes")
      .update(
        obj
      )
      .eq("id", id);
  }

  //удаление данных по id
  async function deleteDataProducts(id) {
    const { error } = await _supabase
    .from("recipes")
    .delete()
    .eq("id", id);
  }





//   window.addEventListener("load", () => {
//     console.log(getDataReport());
//   });

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


  // //обновить цвет
  // const btnUpdateColor = document.getElementById("update-color");
  
  // btnUpdateColor.addEventListener('click', ()=>{
  //   updateColor()
  // })
  
  // async function updateColor (){
  //   isOpenModalLoad(true)
  
  //   let dataReport = await getDataReport();
  //   for(let i=0; i<dataReport.length; i++){
  //     if(dataReport[i].color== "#A5E6B2"){  // colorPrimaryOne = "#A5E6B2";
  //       let obj = {
  //           name: dataReport[i].name,
  //           remainder: dataReport[i].remainder,
  //           coming: dataReport[i].coming,
  //           amount: dataReport[i].amount,
  //           sum: dataReport[i].sum,
  //           color: colorPrimaryOne,
  //         };
  //       await updateDataReport(obj, dataReport[i].id)
  //       // console.log(dataReport[i].id,obj)
  //     }
  //     else if(dataReport[i].color== "#D7F7DD"){  //  colorPrimaryTwo = "#D7F7DD";
  //       if (
  //         dataReport[i].name.includes("орех") ||
  //         dataReport[i].name.includes("изолят") ||
  //         dataReport[i].name.includes("клетчатка") ||
  //         dataReport[i].name.includes("крахмал") ||
  //         dataReport[i].name.includes("крупа") ||
  //         dataReport[i].name.includes("лук") ||
  //         dataReport[i].name.includes("меланж") ||
  //         dataReport[i].name.includes("мука") ||
  //         dataReport[i].name.includes("молоко")
  //       ) {
  //         let obj = {
  //           name: dataReport[i].name,
  //           remainder: dataReport[i].remainder,
  //           coming: dataReport[i].coming,
  //           amount: dataReport[i].amount,
  //           sum: dataReport[i].sum,
  //           color: colorPrimaryThree,
  //         };
  //         // console.log(obj.name)
  //         await updateDataReport(obj, dataReport[i].id)
  //       }
  //       else{
  //         let obj = {
  //           name: dataReport[i].name,
  //           remainder: dataReport[i].remainder,
  //           coming: dataReport[i].coming,
  //           amount: dataReport[i].amount,
  //           sum: dataReport[i].sum,
  //           color: colorPrimaryTwo,
  //         };
  //         await updateDataReport(obj, dataReport[i].id)
  //       }
  //     }
  //     else if(dataReport[i].color== "#A0CADE"){ //  colorSecondaryOne = "#A0CADE";
  //       let obj = {
  //         name: dataReport[i].name,
  //         remainder: dataReport[i].remainder,
  //         coming: dataReport[i].coming,
  //         amount: dataReport[i].amount,
  //         sum: dataReport[i].sum,
  //         color: colorSecondaryOne,
  //       };
  //       await updateDataReport(obj, dataReport[i].id)
  //     }
  //     else if(dataReport[i].color== "#C4ECFF"){  // colorSecondaryTwo = "#C4ECFF";
  //       let obj = {
  //         name: dataReport[i].name,
  //         remainder: dataReport[i].remainder,
  //         coming: dataReport[i].coming,
  //         amount: dataReport[i].amount,
  //         sum: dataReport[i].sum,
  //         color: colorSecondaryTwo,
  //       };
  //       await updateDataReport(obj, dataReport[i].id)
  //     }
  //     else if(dataReport[i].color== "#F7D6CB"){  // colorSecondaryTree = "#F7D6CB";
  //       let obj = {
  //         name: dataReport[i].name,
  //         remainder: dataReport[i].remainder,
  //         coming: dataReport[i].coming,
  //         amount: dataReport[i].amount,
  //         sum: dataReport[i].sum,
  //         color: colorSecondaryTree,
  //       };
  //       await updateDataReport(obj, dataReport[i].id)
  //     }
  //   }
  //   isOpenModalLoad(false)
  // }
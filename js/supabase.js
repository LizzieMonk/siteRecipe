import {
  cleanList,
  listReport,
  createNewElemList,
  updateStorageInput,
  addElemLocalStorage
} from "./report.js";

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
// const { createClient } = supabase

const _supabase = createClient(
  "https://cdwhmgrvcopgzerbhmui.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkd2htZ3J2Y29wZ3plcmJobXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQzMzYwNjksImV4cCI6MjAwOTkxMjA2OX0.fcu2NCaTAC7RxURmPHXUKqm7p3-sCv4e9f2mg0c6jJg"
);

const btnExportSupabase = document.getElementById("btn-export-supabase");
const btnImportSupabase = document.getElementById("btn-import-supabase");

btnExportSupabase.addEventListener("click", () => {
  console.log("кукусики");
  // for(let j=0; j<localStorage.length; j++) {
  //     let key = localStorage.key(j);
  //     let product = JSON.parse( localStorage.getItem(key) );
  // }
  // console.log(localStorage.length)
  // console.log(getDataReport())
//   deleteAllDataSupabase()
//   ll()
  updateSupabaseByLocalStorage()
});
btnImportSupabase.addEventListener("click", () => {
  updatelLocalStorageBySupabase();
});

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
    for(let i=1; i <= dataReport.length; i++){
        await deleteDataReport(i)
    }
}
async function prob(){
    let dataReport = await getDataReport();
    console.log(dataReport)
    let startValue = 3;
    console.log('используемая длина', dataReport.length) //6
    for(let i=startValue; i<--dataReport.length; i++){
        let oldValue = 0
        let newValue = 0;
        for(let j=0; j<dataReport.length; j++){
            if(dataReport[j].id === startValue){
                oldValue = dataReport[j]
                deleteDataReport(j)
            }
            else if(dataReport[j].id === startValue+1){
                newValue = dataReport[j]
                oldValue.id = startValue
                setDataReport(oldValue)
            }
            // if(oldValue!=0 && newValue!=0){
            //     console.log(oldValue)
            //     console.log(newValue)
            //     oldValue=0;
            //     newValue=0;
            //     break;
            // }
        }
        // console.log(dataReport[i])
    }
    console.log(dataReport)

    // for(let i=0; i<--dataReport.length; i++){ //5
    //     console.log('используемая длина', dataReport.length)
    //     if(dataReport[i].id === 5) console.log(dataReport[i])
    // }
    // let product = dataReport[5];
    // console.log('используемая длина', dataReport[4])
}

async function updateSupabaseByLocalStorage(){
    // let dataReport = await getDataReport() //length =0
    // console.log(dataReport)
    //очистка базы
    await deleteAllDataSupabase()

    //заполнение базы хранилищем
    // let id = 1; //значение id для создания следующего элемента
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let product = JSON.parse(localStorage.getItem(key));
        let idObj = i+1;
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

async function updatelLocalStorageBySupabase() {
  //очистка хранилища
  localStorage.clear();
  //заполнение хранилища базой
  let dataReport = await getDataReport();
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
  cleanList(listReport);
  createNewElemList();
  updateStorageInput();
}

//получение данных
async function getDataReport() {
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
async function updateDataReport(obj, id) {
  const { error } = await _supabase
    .from("report")
    .update(
      obj
      // {name: 'newName', amount: 2,}
    )
    .eq("id", id);
}

async function upsertDataReport() {
  const { data, error } = await _supabase
    .from("report")
    .upsert({ id: 1, name: "Albania" })
    .select();
}

//удаление данных по id
async function deleteDataReport(id) {
  const { error } = await _supabase
  .from("report")
  .delete()
  .eq("id", id);
}

window.addEventListener("load", () => {
  console.log(getDataReport());
});
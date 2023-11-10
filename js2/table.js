import{
    allRecipesSum,
} from './index.js'

import {
    colorPrimaryOne,
    colorPrimaryTwo,
    colorPrimaryThree,
    colorSecondaryOne,
    colorSecondaryTwo,
    colorSecondaryTree,
    colorWhite,
    arrProductToXLSX,
    arrSumToXLSX,
    arrSumProductToXLSX,
    isOpenModal,
  } from "./commonFunc.js";

  import {
    getDataProducts,
    updateSupabaseByLocalStorageSumProducts,
    updateSupabaseByLocalStorageSum,
  }from "../js2/software/supabase.js"

//модалка для загрузки
const modalLoad = document.getElementById('modal-load');


const btnExportProduct = document.getElementById('btn-export-product');
const btnExportSum = document.getElementById('btn-export-sum');
const btnExportSumProduct = document.getElementById('btn-export-sum-products');
const btnExportSumProductCheckBox = document.getElementById('btn-export-sum-products-checkbox');
const btnExportAll = document.getElementById('btn-export-all');

const listSumProducts = document.getElementById("list-sum-products");

btnExportProduct.addEventListener('click', ()=>{
    let arrProductToXLSXClone = structuredClone(arrProductToXLSX);
    //убираем цвет
    for(let i=0; i<arrProductToXLSXClone.length; i++){
        delete arrProductToXLSXClone[i].color;
    }
    console.log(arrProductToXLSXClone)
    arrProductToXLSXClone[0]['nameIngredient'] = arrProductToXLSXClone[0]['nameProduct']
    delete arrProductToXLSXClone[0]['nameProduct']
    arrProductToXLSXClone[0]['amount'] = ''
    let outputValue = arrProductToXLSXClone[0].outputValue
    delete arrProductToXLSXClone[0]['outputValue']
    let outputValueStart = arrProductToXLSXClone[0].outputValueStart
    delete arrProductToXLSXClone[0]['outputValueStart']
    // arrProductToXLSXClone[0]['outputValue'] = outputValue
    // delete arrProductToXLSXClone[0]['outputValue']
    arrProductToXLSXClone.splice(1,0,{
        nameIngredient:'',
        amount:'',
        outputValue: outputValueStart,
    })
    arrProductToXLSXClone.splice(1,0,{
        nameIngredient:'',
        amount:'',
        outputValue: outputValue,
    })
    console.log(arrProductToXLSXClone)

    //создаем рабочий лист и рабочую тетрадь
    const worksheet = XLSX.utils.json_to_sheet(arrProductToXLSXClone);
    const workbook = XLSX.utils.book_new();
    //добавление рабочего листа в рабочую тетрадь
    XLSX.utils.book_append_sheet(workbook, worksheet, "Recipe");
    //исправить заголовки начиная с а1
    XLSX.utils.sheet_add_aoa(worksheet, [["", "", ""]], { origin: "A1" });
    //рассчитать ширину столбца на 100 символов
    // const max_width = 300;
    worksheet["!cols"] = [ { wpx: 197 }, //a
                            { wpx: 50}, //b
                            { wpx: 220} ];//c
    // const max_height = 20
    worksheet["!rows"] = [{ hpx: 40},
                            {hpx: 40},
                            {hpx: 50},
                            {hpx: 20},
                            {hpx: 30}]

    // worksheet["!merges"].push(XLSX.utils.decode_range("A1:B1"));
    worksheet["!merges"] = [{
                                //r-строка c-колонка
                                s: { r: 1, c: 0 }, // s ("start"): c = 1 r = 2 -> "B3"
                                e: { r: 1, c: 2 }  // e ("end"):   c = 4 r = 3 -> "E4"
                            }];

    // создаем xlsx файл и пробуем сохранить его локально
    // XLSX.writeFile(workbook, "Product.xlsx", { compression: true });
    XLSX.writeFile(workbook, "Product.xlsx");


    // //создать объект книги из таблицы
    // var workbook = XLSX.utils.table_to_book(tblExportToXls);

    // // Обработать данные (добавить новую строку)
    // var ws = workbook.Sheets["Sheet1"];
    // XLSX.utils.sheet_add_aoa(ws, [["Created "+new Date().toISOString()]], {origin:-1});

    // // Данные пакета и выпуска (`writeFile` пытается записать и сохранить файл XLSB)
    // XLSX.writeFile(workbook, "Report.xlsx");
})
btnExportSum.addEventListener('click', ()=>{
    let arrSumToXLSXClone = structuredClone(arrSumToXLSX);
    for(let i=0; i<arrSumToXLSXClone.length; i++){
        delete arrSumToXLSXClone[i].color;
    }
    console.log(arrSumToXLSXClone)

    //создаем рабочий лист и рабочую тетрадь
    const worksheet = XLSX.utils.json_to_sheet(arrSumToXLSXClone);
    const workbook = XLSX.utils.book_new();
    //исправить заголовки начиная с а1
    XLSX.utils.sheet_add_aoa(worksheet, [["Наименование", "Расход", ""]], { origin: "A1" });
    //рассчитать ширину столбца на 100 символов
    worksheet["!cols"] = [ { wpx: 200 }, //a
                            { wpx: 50}, //b
                            { wpx: 50} ];//c
    // worksheet["!rows"] = [{ hpx: 50 },
    //                         {hpx: 40},
    //                         {hpx: 40},
    //                         {hpx: 20}]
    // let row = [
    //     {s:{
    //         border:{
    //             top:{
    //                 color: {rgb: "#000"}
    //             },
    //             bottom:{
    //                 color: {rgb: "#000"}
    //             },
    //             left:{
    //                 color: {rgb: "#000"}
    //             },
    //             right:{
    //                 color: {rgb: "#000"}
    //             },
    //         }
    //     }}
    // ]
    // let row = [
    //     { v: "Courier: 24", t: "s", s: { font: { name: "Courier", sz: 24 } } },
    //     { v: "bold & color", t: "s", s: { font: { bold: true, color: { rgb: "FF0000" } } } },
    //     { v: "fill: color", t: "s", s: { fill: { fgColor: { rgb: "E9E9E9" } } } },
    //     { v: "line\nbreak", t: "s", s: { alignment: { wrapText: true } } },
    // ];

    // worksheet = XLSX.utils.aoa_to_sheet([row]);

    //добавление рабочего листа в рабочую тетрадь
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sum");

    // создаем xlsx файл и пробуем сохранить его локально
    // XLSX.writeFile(workbook, "Product.xlsx", { compression: true });
    XLSX.writeFile(workbook, "Sum.xlsx");
})
btnExportSumProduct.addEventListener('click', ()=>{
    let arrSumProductToXLSXClone = structuredClone(arrSumProductToXLSX);
    for(let i=0; i<arrSumProductToXLSXClone.length; i++){
        delete arrSumProductToXLSXClone[i].color;
    }

    //создаем рабочий лист и рабочую тетрадь
    const worksheet = XLSX.utils.json_to_sheet(arrSumProductToXLSXClone);
    const workbook = XLSX.utils.book_new();
    //добавление рабочего листа в рабочую тетрадь
    XLSX.utils.book_append_sheet(workbook, worksheet, "SumProduct");
    //исправить заголовки начиная с а1
    XLSX.utils.sheet_add_aoa(worksheet, [["Продукт", "Кол-во", ""]], { origin: "A1" });
    //рассчитать ширину столбца
    worksheet["!cols"] = [ { wpx: 320 }, //a
                            { wpx: 50}, //b
                            { wpx: 50} ];//c
    worksheet["!rows"] = [{ hpx: 20 },
                            {hpx: 40}, ]

    // создаем xlsx файл и пробуем сохранить его локально
    // XLSX.writeFile(workbook, "Product.xlsx", { compression: true });
    XLSX.writeFile(workbook, "SumProduct.xlsx");
})
btnExportAll.addEventListener('click', ()=>{
    let allRecipesSumClone = structuredClone(allRecipesSum);

    //фильтрация по цвету и алфавиту
    for(let i=0; i<allRecipesSumClone.length; i++){
        allRecipesSumClone[i] = filterArrProduct(allRecipesSumClone[i])
    }
    //убираем цвет
    for(let i=0; i<allRecipesSumClone.length; i++){
        // console.log(allRecipesSumClone[i])
        for(let j=0; j<allRecipesSumClone[i].length; j++){
            // console.log(allRecipesSumClone[i][j])
            delete allRecipesSumClone[i][j].color;
        }
    }
    //перестановка в первом объекте для корректной печати
    for(let i=0; i<allRecipesSumClone.length; i++){
        allRecipesSumClone[i][0]['nameIngredient'] = allRecipesSumClone[i][0]['nameProduct']
        delete allRecipesSumClone[i][0]['nameProduct']
        allRecipesSumClone[i][0]['amount'] = ''
        let outputValue = allRecipesSumClone[i][0].outputValue
        delete allRecipesSumClone[i][0]['outputValue']
        let outputValueStart = allRecipesSumClone[i][0].outputValueStart
        delete allRecipesSumClone[i][0]['outputValueStart']
        allRecipesSumClone[i].splice(1,0,{
            nameIngredient:'',
            amount:'',
            outputValue: outputValueStart,
        })
        allRecipesSumClone[i].splice(1,0,{
            nameIngredient:'',
            amount:'',
            outputValue: outputValue,
        })
    }
    //печать продуктов в алфавитном порядке
    allRecipesSumClone.sort((a, b) => (a[0].nameIngredient > b[0].nameIngredient ? 1 : -1));

    //создаем рабочую тетрадь
    const workbook = XLSX.utils.book_new();
    //вносим листы с рецептурами в одну тетрадь
    for(let i=0; i<allRecipesSumClone.length; i++){
        //создаем рабочий лист
        const worksheet = XLSX.utils.json_to_sheet(allRecipesSumClone[i]);
        //добавление рабочего листа в рабочую тетрадь
        XLSX.utils.book_append_sheet(workbook, worksheet, `Recipe${i}`);
        //исправить заголовки начиная с а1
        XLSX.utils.sheet_add_aoa(worksheet, [["", "", ""]], { origin: "A1" });
        worksheet["!cols"] = [{wpx: 197},  //a
                                {wpx: 50},  //b
                                {wpx: 220}];  //c
        worksheet["!rows"] = [{ hpx: 40},
                                {hpx: 40},
                                {hpx: 50},
                                {hpx: 20},
                                {hpx: 30}]
        worksheet["!merges"] = [{
                                //r-строка c-колонка
                                s: { r: 1, c: 0 }, // s ("start"): c = 1 r = 2 -> "B3"
                                e: { r: 1, c: 2 }  // e ("end"):   c = 4 r = 3 -> "E4"
                            }];
    }

    // создаем xlsx файл и пробуем сохранить его локально
    // XLSX.writeFile(workbook, "Product.xlsx", { compression: true });
    XLSX.writeFile(workbook, "Products.xlsx");
})
btnExportSumProductCheckBox.addEventListener('click', ()=>{
    //находим выбранные li с экрана
    let arrExportCheckBox =[];
    let countArrExportCheckBox =0;
    for(let i=0; i<listSumProducts.children.length; i++){
        if(listSumProducts.children[i].querySelector('[name="export-sum-products-checkbox"]').checked){
            arrExportCheckBox[countArrExportCheckBox++] = listSumProducts.children[i];
            // console.log(listSumProducts.children[i].querySelector('[name="name-product"]').textContent)
        }
    }

    //клонируем массив всех продуктов
    let allRecipesSumClone = structuredClone(allRecipesSum);

    //перебираем массив, находим совпадения с выбранными на экране
    for(let i=0; i<allRecipesSumClone.length; i++){
        let repeat =0;
        for(let j=0; j<arrExportCheckBox.length; j++){
            if(allRecipesSumClone[i][0].nameProduct == arrExportCheckBox[j].querySelector('[name="name-product"]').textContent){
                repeat++; //есть совпадение
                break;
            }
        }
        //если нет совпадений, удаляем с массива
        if(repeat ==0) {
            allRecipesSumClone.splice(i,1)
            i--;
        }
    }

    //фильтрация по цвету и алфавиту
    for(let i=0; i<allRecipesSumClone.length; i++){
        allRecipesSumClone[i] = filterArrProduct(allRecipesSumClone[i])
    }
    //убираем цвет
    for(let i=0; i<allRecipesSumClone.length; i++){
        console.log(allRecipesSumClone[i])
        for(let j=0; j<allRecipesSumClone[i].length; j++){
            console.log(allRecipesSumClone[i][j])
            delete allRecipesSumClone[i][j].color;
        }
    }
    //перестановка в первом объекте для корректной печати
    for(let i=0; i<allRecipesSumClone.length; i++){
        allRecipesSumClone[i][0]['nameIngredient'] = allRecipesSumClone[i][0]['nameProduct']
        delete allRecipesSumClone[i][0]['nameProduct']
        allRecipesSumClone[i][0]['amount'] = ''
        let outputValue = allRecipesSumClone[i][0].outputValue
        delete allRecipesSumClone[i][0]['outputValue']
        let outputValueStart = allRecipesSumClone[i][0].outputValueStart
        delete allRecipesSumClone[i][0]['outputValueStart']
        allRecipesSumClone[i].splice(1,0,{
            nameIngredient:'',
            amount:'',
            outputValue: outputValueStart,
        })
        allRecipesSumClone[i].splice(1,0,{
            nameIngredient:'',
            amount:'',
            outputValue: outputValue,
        })
    }
    //печать продуктов в алфавитном порядке
    allRecipesSumClone.sort((a, b) => (a[0].nameIngredient > b[0].nameIngredient ? 1 : -1));

    //создаем рабочую тетрадь
    const workbook = XLSX.utils.book_new();
    //вносим листы с рецептурами в одну тетрадь
    for(let i=0; i<allRecipesSumClone.length; i++){
        //создаем рабочий лист
        const worksheet = XLSX.utils.json_to_sheet(allRecipesSumClone[i]);
        //добавление рабочего листа в рабочую тетрадь
        XLSX.utils.book_append_sheet(workbook, worksheet, `Recipe${i}`);
        //исправить заголовки начиная с а1
        XLSX.utils.sheet_add_aoa(worksheet, [["", "", ""]], { origin: "A1" });
        worksheet["!cols"] = [{wpx: 197},  //a
                                {wpx: 50},  //b
                                {wpx: 220}];  //c
        worksheet["!rows"] = [{ hpx: 40},
                                {hpx: 40},
                                {hpx: 50},
                                {hpx: 20},
                                {hpx: 30}]
        worksheet["!merges"] = [{
                                //r-строка c-колонка
                                s: { r: 1, c: 0 }, // s ("start"): c = 1 r = 2 -> "B3"
                                e: { r: 1, c: 2 }  // e ("end"):   c = 4 r = 3 -> "E4"
                            }];
    }

    // создаем xlsx файл и пробуем сохранить его локально
    // XLSX.writeFile(workbook, "Product.xlsx", { compression: true });
    XLSX.writeFile(workbook, "Products.xlsx");
})

function filterArrProduct(arrElem) {
    let newElemArr = []
    let countNewElemArr = 0;
    newElemArr[countNewElemArr++] = arrElem[0]  //добавление первого элемента в новый массив

    //сортировка по алфавиту, кроме первого элемента
    let firstElemArr = arrElem[0]; //сохранение первого
    arrElem.splice(0, 1); //удаление первого
    arrElem.sort((a, b) => (a.nameIngredient > b.nameIngredient ? 1 : -1)); //сортировка массива без первого
    arrElem.unshift(firstElemArr); //возвращаем первый

    //перебор оставшегося массива по цветам
    let addEmptyObj = 12;
    for (let i = 1; i < arrElem.length; i++) {
      if (arrElem[i].color == colorPrimaryOne) {
        addEmptyObj--;
        newElemArr[countNewElemArr++] = arrElem[i]
      }
    }
    for (let i = 1; i < arrElem.length; i++) {
      if (arrElem[i].color == colorPrimaryTwo) {
        addEmptyObj--;
        newElemArr[countNewElemArr++] = arrElem[i]
       }
    }
    for (let i = 1; i < arrElem.length; i++) {
      if (arrElem[i].color == colorPrimaryThree) {
        addEmptyObj--;
        newElemArr[countNewElemArr++] = arrElem[i]
       }
    }
    // let addEmptyObj = 9;
    for (let i = 1; i < arrElem.length; i++) {
      if (arrElem[i].color == colorSecondaryOne) {

        //добавление пустых объектов(муляж) для нормальной печати
        while(addEmptyObj>0){
            newElemArr[countNewElemArr++] = {
            nameIngredient:'',
            amount:'',
            color:''
            }
            addEmptyObj--;
        }

        newElemArr[countNewElemArr++] = arrElem[i]
        }
    }
    for (let i = 1; i < arrElem.length; i++) {
      if (arrElem[i].color == colorSecondaryTwo) {

        //добавление пустых объектов(муляж) для нормальной печати
        while(addEmptyObj>0){
            newElemArr[countNewElemArr++] = {
            nameIngredient:'',
            amount:'',
            color:''
            }
            addEmptyObj--;
        }

        newElemArr[countNewElemArr++] = arrElem[i]
        }
    }
    for (let i = 1; i < arrElem.length; i++) {
      if (arrElem[i].color == colorSecondaryTree) {
        newElemArr[countNewElemArr++] = arrElem[i]
      }
    }
    return newElemArr;
}

//сохранение
const btnSaveAll = document.getElementById('btn-save-all')
btnSaveAll.addEventListener('click', async ()=>{
    isOpenModal(modalLoad, true);
    await updateSupabaseByLocalStorageSumProducts(allRecipesSum);  //async
    await updateSupabaseByLocalStorageSum(arrSumToXLSX);  //async
    isOpenModal(modalLoad,false);
})

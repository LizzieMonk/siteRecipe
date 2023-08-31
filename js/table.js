// importScripts("https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/shim.min.js");
// importScripts("https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js");
import{
    arrProductToXLSX,
    arrSumToXLSX,
    arrSumProductToXLSX,
    allRecipesSum,
    colorPrimaryOne,
    colorPrimaryTwo,
    colorSecondaryOne,
    colorSecondaryTwo,
    colorSecondaryTree
} from './main.js'

const btnExportProduct = document.getElementById('btn-export-product');
const btnExportSum = document.getElementById('btn-export-sum');
const btnExportSumProduct = document.getElementById('btn-export-sum-products');
const btnExportAll = document.getElementById('btn-export-all');
// const tblExportToXls = document.getElementById('tbl-export-to-xls');

// var data = [
//     {"name":"John", "city": "Seattle"},
//     {"name":"Mike", "city": "Los Angeles"},
//     {"name":"Zach", "city": "New York"}
// ];

// /* this line is only needed if you are not adding a script tag reference */
// if(typeof XLSX == 'undefined') XLSX = require('xlsx');

// /* make the worksheet */
// var ws = XLSX.utils.json_to_sheet(data);

// /* add to workbook */
// var wb = XLSX.utils.book_new();
// XLSX.utils.book_append_sheet(wb, ws, "People");

// /* generate an XLSX file */
// XLSX.writeFile(wb, "sheetjs.xlsx");

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
    worksheet["!cols"] = [ { wpx: 190 }, //a
                            { wpx: 50}, //b
                            { wpx: 180} ];//c
    // const max_height = 20
    worksheet["!rows"] = [{ hpx: 40},
                            {hpx: 40},
                            {hpx: 40},
                            {hpx: 20},
                            {hpx: 30}]

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
    //добавление рабочего листа в рабочую тетрадь
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sum");
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

    // создаем xlsx файл и пробуем сохранить его локально
    // XLSX.writeFile(workbook, "Product.xlsx", { compression: true });
    XLSX.writeFile(workbook, "Sum.xlsx");
})
btnExportSumProduct.addEventListener('click', ()=>{
    let arrSumProductToXLSXClone = structuredClone(arrSumProductToXLSX);
    for(let i=0; i<arrSumProductToXLSXClone.length; i++){
        delete arrSumProductToXLSXClone[i].color;
    }
    console.log(arrSumProductToXLSXClone)

    //создаем рабочий лист и рабочую тетрадь
    const worksheet = XLSX.utils.json_to_sheet(arrSumProductToXLSXClone);
    const workbook = XLSX.utils.book_new();
    //добавление рабочего листа в рабочую тетрадь
    XLSX.utils.book_append_sheet(workbook, worksheet, "SumProduct");
    //исправить заголовки начиная с а1
    XLSX.utils.sheet_add_aoa(worksheet, [["Продукт", "Кол-во", ""]], { origin: "A1" });
    //рассчитать ширину столбца на 100 символов
    worksheet["!cols"] = [ { wpx: 200 }, //a
                            { wpx: 50}, //b
                            { wpx: 50} ];//c
    // worksheet["!rows"] = [{ hpx: 50 },
    //                         {hpx: 40},
    //                         {hpx: 40},
    //                         {hpx: 20}]

    // создаем xlsx файл и пробуем сохранить его локально
    // XLSX.writeFile(workbook, "Product.xlsx", { compression: true });
    XLSX.writeFile(workbook, "SumProduct.xlsx");
})
btnExportAll.addEventListener('click', ()=>{
    console.log(allRecipesSum)
    let allRecipesSumClone = structuredClone(allRecipesSum);

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
    // console.log(allRecipesSumClone)

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
        worksheet["!cols"] = [{wpx: 190},  //a
                            {wpx: 50},  //b
                            {wpx: 180}];  //c
        worksheet["!rows"] = [{ hpx: 40},
                            {hpx: 40},
                            {hpx: 40},
                            {hpx: 20},
                            {hpx: 30}]
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
    for (let i = 1; i < arrElem.length; i++) {
      if (arrElem[i].color == colorPrimaryOne) {
        newElemArr[countNewElemArr++] = arrElem[i]
      }
    }
    for (let i = 1; i < arrElem.length; i++) {
      if (arrElem[i].color == colorPrimaryTwo) {
        newElemArr[countNewElemArr++] = arrElem[i]
       }
    }
    for (let i = 1; i < arrElem.length; i++) {
      if (arrElem[i].color == colorSecondaryOne) {
        newElemArr[countNewElemArr++] = arrElem[i]
        }
    }
    for (let i = 1; i < arrElem.length; i++) {
      if (arrElem[i].color == colorSecondaryTwo) {
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







// function ExportToExcel(type, fn, dl) {
//     var elt = document.getElementById('tbl_exporttable_to_xls');
//     var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
//     return dl ?
//       XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
//       XLSX.writeFile(wb, fn || ('MySheetName.' + (type || 'xlsx')));
//  }
// importScripts("https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/shim.min.js");
// importScripts("https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js");
import{
    arrProductToXLSX,
    arrSumToXLSX,
    arrSumProductToXLSX
} from './main.js'

const btnExportProduct = document.getElementById('btn-export-product');
const btnExportSum = document.getElementById('btn-export-sum');
const btnExportSumProduct = document.getElementById('btn-export-sum-products');
const tblExportToXls = document.getElementById('tbl-export-to-xls');

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
    for(let i=0; i<arrProductToXLSXClone.length; i++){
        delete arrProductToXLSXClone[i].color;
    }
    console.log(arrProductToXLSXClone)
    arrProductToXLSXClone[0]['nameIngredient'] = arrProductToXLSXClone[0]['nameProduct']
    delete arrProductToXLSXClone[0]['nameProduct']
    arrProductToXLSXClone[0]['amount'] = ''
    let outputValue = arrProductToXLSX[0].outputValue
    delete arrProductToXLSXClone[0]['outputValue']
    arrProductToXLSXClone[0]['outputValue'] = outputValue
    // delete arrProductToXLSXClone[0]['outputValue']
    console.log(arrProductToXLSXClone)

    //создаем рабочий лист и рабочую тетрадь
    const worksheet = XLSX.utils.json_to_sheet(arrProductToXLSXClone);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Recipe");
    //исправить заголовки начиная с а1
    XLSX.utils.sheet_add_aoa(worksheet, [["", "", ""]], { origin: "A1" });
    //рассчитать ширину столбца на 100 символов
    // const max_width = 300;
    worksheet["!cols"] = [ { wpx: 300 }, //a
                            { wpx: 100}, //b
                            { wpx: 100} ];
    // const max_height = 20
    worksheet["!rows"] = [{ hpx: 50 },
                            {hpx: 50},
                            {hpx: 20}]

    // создаем xlsx файл и пробуем сохранить его локально
    XLSX.writeFile(workbook, "Product.xlsx", { compression: true });




    // //создать объект книги из таблицы
    // var workbook = XLSX.utils.table_to_book(tblExportToXls);

    // // Обработать данные (добавить новую строку)
    // var ws = workbook.Sheets["Sheet1"];
    // XLSX.utils.sheet_add_aoa(ws, [["Created "+new Date().toISOString()]], {origin:-1});

    // // Данные пакета и выпуска (`writeFile` пытается записать и сохранить файл XLSB)
    // XLSX.writeFile(workbook, "Report.xlsx");
})
btnExportSum.addEventListener('click', ()=>{
    let arrSumToXLSXClone = structuredClone(arrSumToXLSX)
    for(let i=0; i<arrSumToXLSXClone.length; i++){
        delete arrSumToXLSXClone[i].color;
    }
    console.log(arrSumToXLSXClone)
    //создаем рабочий лист и рабочую тетрадь
    const worksheet = XLSX.utils.json_to_sheet(arrSumToXLSXClone);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sum");

    // создаем xlsx файл и пробуем сохранить его локально
    XLSX.writeFile(workbook, "Sum.xlsx", { compression: true });
})
btnExportSumProduct.addEventListener('click', ()=>{
    let arrSumProductToXLSXClone = structuredClone(arrSumProductToXLSX)
    for(let i=0; i<arrSumProductToXLSXClone.length; i++){
        delete arrSumProductToXLSXClone[i].color;
    }
    console.log(arrSumProductToXLSXClone)
    //создаем рабочий лист и рабочую тетрадь
    const worksheet = XLSX.utils.json_to_sheet(arrSumProductToXLSXClone);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SumProducts");

    // создаем xlsx файл и пробуем сохранить его локально
    XLSX.writeFile(workbook, "SumProducts.xlsx", { compression: true });
})

// function ExportToExcel(type, fn, dl) {
//     var elt = document.getElementById('tbl_exporttable_to_xls');
//     var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
//     return dl ?
//       XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
//       XLSX.writeFile(wb, fn || ('MySheetName.' + (type || 'xlsx')));
//  }
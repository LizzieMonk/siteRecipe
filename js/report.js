import{
    arrProductToXLSX,
    arrSumToXLSX,
    arrSumProductToXLSX,
    allRecipesSum,
    colorWhite,
    colorPrimaryOne,
    colorPrimaryTwo,
    colorSecondaryOne,
    colorSecondaryTwo,
    colorSecondaryTree
} from './main.js'


const btnReport = document.getElementById("btn-report");

const btnCalc = document.getElementById("btn-calc");
const btnSum = document.getElementById("btn-sum");
const btnClean = document.getElementById("btn-clean");

const listProductBlock = document.querySelector(".ul-block__product");
const listSumProductsBlock = document.querySelector(".ul-block__sum-products");
const listReportBlock = document.querySelector(".ul-block__report");

const btnExportReport = document.getElementById('btn-export-report');
const btnReportUpdateAmount = document.getElementById('btn-report-update-amount')
const btnReportUpdateRemainder = document.getElementById('btn-report-update-remainder')
const btnReportDeleteStorage = document.getElementById('btn-report-delete-storage')
const btnReportCalcSum = document.getElementById('btn-report-calc-sum')

const listReport = document.getElementById("list-report");
const elemListReport = document.getElementById("elem-list-report");

btnReport.addEventListener('click',()=>{
    console.log('clicked')
    cleanList(listReport)
    createNewElemList()
    if(btnCalc.matches('.btn-passive')){
        btnCalc.classList.remove('btn-passive')
        btnCalc.disabled = false;
        btnSum.classList.remove('btn-passive')
        btnSum.disabled = false;
        btnClean.classList.remove('btn-passive')
        btnClean.disabled = false;

        listProductBlock.style.display = 'flex'
        listSumProductsBlock.style.display = 'flex'
        listReportBlock.style.display = 'none'
    }
    else{
        btnCalc.classList.add('btn-passive');
        btnCalc.disabled = true;
        btnSum.classList.add('btn-passive');
        btnSum.disabled = true;
        btnClean.classList.add('btn-passive');
        btnClean.disabled = true;

        listProductBlock.style.display = 'none'
        listSumProductsBlock.style.display = 'none'
        listReportBlock.style.display = 'flex'

        //вывод списка на экран
        cleanList(listReport)
        createNewElemList()
        //обновление списка (длина списка !=0)
        updateStorageInput()
    }
})
btnReportUpdateAmount.addEventListener('click', ()=>{
    console.log('update')
    //глубокое копирование списка с суммой
    let arrSumToXLSXClone = structuredClone(arrSumToXLSX);
    for(let i=0; i<arrSumToXLSXClone.length; i++){
        let repeat = false;
        for(let j=0; j<localStorage.length; j++) {
            let key = localStorage.key(j);
            //если в хранилище уже есть этот продукт, обновляем расход
            if(key===arrSumToXLSXClone[i].nameIngredient){
                repeat = true;
                //получение значений продукта
                let product = JSON.parse( localStorage.getItem(key) );
                console.log(arrSumToXLSXClone[i])
                //сохранение продукта в локальное хранилище
                let keyNameProduct = arrSumToXLSXClone[i].nameIngredient //название ингредиента - ключ
                let obj = {
                    'name' : product.name,
                    'remainder' : product.remainder,
                    'coming' : product.coming,
                    'amount' : arrSumToXLSXClone[i].amount, //обновление расхода
                    // 'sum' : roundN( Number(product.remainder)
                    // + Number(product.coming)
                    // - Number(arrSumToXLSXClone[i].amount),
                    // 3),
                    'sum' : product.sum,
                    'color': arrSumToXLSXClone[i].color,
                }
                createLocalStorage(obj, keyNameProduct)
                break;
            }
        }
        //если в хранлище нет продукта, добавляем как новый
        if(!repeat){
            //сохранение нового продукта в локальное хранилище
            let keyNameProduct = arrSumToXLSXClone[i].nameIngredient //название ингредиента - ключ
            let obj = {
                'name' : arrSumToXLSXClone[i].nameIngredient,
                'remainder' : 0,
                'coming' : 0,
                'amount' : arrSumToXLSXClone[i].amount,
                'sum': 0,
                'color': arrSumToXLSXClone[i].color,
            }
            createLocalStorage(obj, keyNameProduct)
        }
    }
    cleanList(listReport)
    createNewElemList()
    updateStorageInput()
})
btnReportDeleteStorage.addEventListener('click', ()=>{
    console.log('delete')
    localStorage.clear()
    cleanList(listReport)
    createNewElemList()
})
btnReportUpdateRemainder.addEventListener('click', ()=>{
    for(let j=0; j<localStorage.length; j++) {
        let key = localStorage.key(j);
        //получение значений продукта
        let product = JSON.parse( localStorage.getItem(key) );
        //сохранение продукта в локальное хранилище
        let keyNameProduct = product.name //название ингредиента - ключ
        let obj = {
            'name' : product.name,
            'remainder' : product.sum,
            'coming' : 0,
            'amount' : 0,
            'sum': 0,
            'color': product.color,
        }
        createLocalStorage(obj, keyNameProduct)
    }
    cleanList(listReport)
    createNewElemList()
    updateStorageInput()
})
btnReportCalcSum.addEventListener('click', ()=>{
    for(let j=0; j<localStorage.length; j++) {
        let key = localStorage.key(j);
        //получение значений продукта
        let product = JSON.parse( localStorage.getItem(key) );
        //сохранение продукта в локальное хранилище
        let keyNameProduct = product.name //название ингредиента - ключ
        let obj = {
            'name' : product.name,
            'remainder' : product.remainder,
            'coming' : product.coming,
            'amount' : product.amount,
            'sum':  updateSum(product),
            'color': product.color,
        }
        createLocalStorage(obj, keyNameProduct)
    }
    cleanList(listReport)
    createNewElemList()
    updateStorageInput()
})
btnExportReport.addEventListener('click', ()=>{
    let arr = []
    let countArr = 0
    for(let j=0; j<localStorage.length; j++) {
        let key = localStorage.key(j);
        //получение значений продукта
        let product = JSON.parse( localStorage.getItem(key) );
        arr[countArr++] = product
    }
    for(let i=0; i<arr.length; i++){
        delete arr[i].color;
    }
    console.log(arr)

    //ДОБАВИТЬ СОРТИРОВКУ

    //создаем рабочий лист и рабочую тетрадь
    const worksheet = XLSX.utils.json_to_sheet(arr);
    const workbook = XLSX.utils.book_new();
    //исправить заголовки начиная с а1
    XLSX.utils.sheet_add_aoa(worksheet, [["Наименование", "Остаток", "Приход", "Расход", "Сумма"]], { origin: "A1" });
    //рассчитать ширину столбца на 100 символов
    worksheet["!cols"] = [ { wpx: 200 }, //a
                            { wpx: 50}, //b
                            { wpx: 50},
                            { wpx: 50},
                            { wpx: 50} ];//c

    //добавление рабочего листа в рабочую тетрадь
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    // создаем xlsx файл и пробуем сохранить его локально
    XLSX.writeFile(workbook, "Perort.xlsx");
})


function updateStorageInput (){
    let arrElems = listReport.children;
    for(let i=0; i<arrElems.length; i++){
        arrElems[i].querySelector('[name="coming"]').addEventListener('input', ()=>{
            // updateSum(arrElems[i]);
            for(let j=0; j<localStorage.length; j++) {
                let key = localStorage.key(j);
                if(key === arrElems[i].querySelector('[name="name-product"]').textContent){
                    //получение значений продукта
                    let product = JSON.parse( localStorage.getItem(key) );
                    let keyNameProduct = product.name
                    let obj = {
                        'name' : product.name,
                        'remainder' : product.remainder,
                        'coming' : Number(arrElems[i].querySelector('[name="coming"]').value), //обновление расхода
                        'amount' : product.amount,
                        // 'sum' : updateSum(arrElems[i]),
                        'sum' : product.sum,
                        'color': product.color,
                    }
                    createLocalStorage(obj, keyNameProduct)
                    checkSum(arrElems[i], arrElems[i].querySelector('[name="remainder-sum"]').value)
                    break;
                }
            }
        })
        arrElems[i].querySelector('[name="amount"]').addEventListener('input', ()=>{
            // updateSum(arrElems[i]);
            for(let j=0; j<localStorage.length; j++) {
                let key = localStorage.key(j);
                if(key === arrElems[i].querySelector('[name="name-product"]').textContent){
                    //получение значений продукта
                    let product = JSON.parse( localStorage.getItem(key) );
                    let keyNameProduct = product.name
                    let obj = {
                        'name' : product.name,
                        'remainder' : product.remainder,
                        'coming' : product.coming, //обновление
                        'amount' : Number(arrElems[i].querySelector('[name="amount"]').value),
                        // 'sum' : updateSum(arrElems[i]),
                        'sum' : product.sum,
                        'color': product.color,
                    }
                    createLocalStorage(obj, keyNameProduct)
                    checkSum(arrElems[i], arrElems[i].querySelector('[name="remainder-sum"]').value)
                    break;
                }
            }
        })
        arrElems[i].querySelector('[name="remainder"]').addEventListener('input', ()=>{
            // updateSum(arrElems[i]);
            for(let j=0; j<localStorage.length; j++) {
                let key = localStorage.key(j);
                if(key === arrElems[i].querySelector('[name="name-product"]').textContent){
                    //получение значений продукта
                    let product = JSON.parse( localStorage.getItem(key) );
                    let keyNameProduct = product.name
                    let obj = {
                        'name' : product.name,
                        'remainder' : Number(arrElems[i].querySelector('[name="remainder"]').value),
                        'coming' : product.coming, //обновление расхода
                        'amount' : product.amount,
                        // 'sum' : updateSum(arrElems[i]),
                        'sum' : product.sum,
                        'color': product.color,
                    }
                    createLocalStorage(obj, keyNameProduct)
                    checkSum(arrElems[i], arrElems[i].querySelector('[name="remainder-sum"]').value)
                    break;
                }
            }
        })
        arrElems[i].querySelector('[name="remainder-sum"]').addEventListener('input', ()=>{
            // updateSum(arrElems[i]);
            for(let j=0; j<localStorage.length; j++) {
                let key = localStorage.key(j);
                if(key === arrElems[i].querySelector('[name="name-product"]').textContent){
                    //получение значений продукта
                    let product = JSON.parse( localStorage.getItem(key) );
                    let keyNameProduct = product.name
                    let obj = {
                        'name' : product.name,
                        'remainder' : product.remainder,
                        'coming' : product.coming,
                        'amount' : product.amount,
                        'sum' : Number(arrElems[i].querySelector('[name="remainder-sum"]').value),
                        'color': product.color,
                    }
                    createLocalStorage(obj, keyNameProduct)
                    // console.log(arrElems[i].querySelector('[name="remainder-sum"]').value)
                    checkSum(arrElems[i], arrElems[i].querySelector('[name="remainder-sum"]').value)
                    break;
                }
            }
        })
    }
    //при вводе данных пересчитываем сумму
    function updateSum(elem){
        elem.querySelector('[name="remainder-sum"]').value = roundN(
            Number(elem.querySelector('[name="remainder"]').value)
            + Number(elem.querySelector('[name="coming"]').value)
            - Number(elem.querySelector('[name="amount"]').value),
            3);
        return elem.querySelector('[name="remainder-sum"]').value
    }
}

function updateSum(product){
    let sum = roundN(
        Number(product.remainder)
        + Number(product.coming)
        - Number(product.amount),
        3);
    return sum
}
function checkSum(elem, value){
    let sum = roundN(
        Number(elem.querySelector('[name="remainder"]').value)
        + Number(elem.querySelector('[name="coming"]').value)
        - Number(elem.querySelector('[name="amount"]').value),
        3)
    if(sum>value){
        elem.querySelector('[name="hint"]').style.color = 'red'
        elem.querySelector('[name="hint"]').value = roundN((value-sum),3)
        elem.querySelector('[name="coming"]').style.color = 'red'
        elem.querySelector('[name="amount"]').style.color = 'red'
        elem.querySelector('[name="coming"]').style.borderColor = 'red'
        elem.querySelector('[name="amount"]').style.borderColor = 'red'
    }
    else if(sum<value){
        elem.querySelector('[name="hint"]').style.color = 'green'
        elem.querySelector('[name="hint"]').value = roundN((value-sum),3)
        elem.querySelector('[name="coming"]').style.color = 'green'
        elem.querySelector('[name="amount"]').style.color = 'green'
        elem.querySelector('[name="coming"]').style.borderColor = 'green'
        elem.querySelector('[name="amount"]').style.borderColor = 'green'
    }
    else if(sum==value){
        elem.querySelector('[name="hint"]').style.color = 'black'
        elem.querySelector('[name="hint"]').value = roundN((value-sum),3)
        elem.querySelector('[name="hint"]').style.color = 'white'
        elem.querySelector('[name="coming"]').style.color = 'black'
        elem.querySelector('[name="amount"]').style.color = 'black'
        elem.querySelector('[name="coming"]').style.borderColor = 'black'
        elem.querySelector('[name="amount"]').style.borderColor = 'black'
    }
}

function createListReport(){
    // cleanList(listReport)
    // let arrSumToXLSXClone = structuredClone(arrSumToXLSX);
    // for(let i=0; i<arrSumToXLSXClone.length; i++){
    //     // delete arrSumToXLSXClone[i].color;
    // }
    createNewElemList()
}

// function createNewElemList(arrElems) {
//     for (let i = 0; i < arrElems.length; i++) {
//         let newElemListProduct = elemListReport.cloneNode(true);
//         newElemListProduct.querySelector('[name="name-product"]').textContent = arrElems[i].nameIngredient;
//         newElemListProduct.querySelector('[name="amount"]').value = arrElems[i].amount;
//         newElemListProduct.querySelector('[name="remainder-sum"]').value =
//                 Number(newElemListProduct.querySelector('[name="remainder"]').value)
//                 + Number(newElemListProduct.querySelector('[name="coming"]').value)
//                 + Number(newElemListProduct.querySelector('[name="amount"]').value);
//         newElemListProduct.style.background = arrElems[i].color;
//         listReport.appendChild(newElemListProduct);

//         //при изменении (вводе данных) пересчитывать сумму
//         newElemListProduct.querySelector('[name="coming"]').addEventListener('input', ()=>{
//             newElemListProduct.querySelector('[name="remainder-sum"]').value =
//                 Number(newElemListProduct.querySelector('[name="remainder"]').value)
//                 + Number(newElemListProduct.querySelector('[name="coming"]').value)
//                 + Number(newElemListProduct.querySelector('[name="amount"]').value);
//         })
//         newElemListProduct.querySelector('[name="amount"]').addEventListener('input', ()=>{
//             newElemListProduct.querySelector('[name="remainder-sum"]').value =
//                 Number(newElemListProduct.querySelector('[name="remainder"]').value)
//                 + Number(newElemListProduct.querySelector('[name="coming"]').value)
//                 + Number(newElemListProduct.querySelector('[name="amount"]').value);
//         })

//         //сохранение продукта в локальное хранилище
//         let keyNameProduct = arrElems[i].nameIngredient //название ингредиента - ключ
//         let obj = {
//             'name' : arrElems[i].nameIngredient,
//             'remainder' : Number(newElemListProduct.querySelector('[name="remainder"]').value),
//             'coming' : Number(newElemListProduct.querySelector('[name="coming"]').value),
//             'amount' : Number(newElemListProduct.querySelector('[name="amount"]').value),
//             'color': arrElems[i].color,
//         }
//         createLocalStorage(obj, keyNameProduct)
// }}

function createNewElemList() {
    let arrProductsClone = []
    let countArrProductsClone = 0;
    //глубокое копирование хранилища
    for(let i=0; i<localStorage.length; i++) {
        let key = localStorage.key(i);
        let product = JSON.parse( localStorage.getItem(key) );
        arrProductsClone[countArrProductsClone++] = structuredClone(product)
    }
    console.log(arrProductsClone)

    //сортировка по алфавиту
    arrProductsClone.sort((a, b) => (a.name > b.name ? 1 : -1));
    //вывод списка с хранилища
    for(let i=0; i< arrProductsClone.length; i++) {
        if ( arrProductsClone[i].color == colorWhite) {
            addInList(arrProductsClone[i])
        }
    }
    for(let i=0; i< arrProductsClone.length; i++) {
        if ( arrProductsClone[i].color == colorPrimaryOne) {
            addInList(arrProductsClone[i])
        }
    }
    for(let i=0; i< arrProductsClone.length; i++) {
        if ( arrProductsClone[i].color == colorPrimaryTwo) {
            addInList(arrProductsClone[i])
        }
    }
    for(let i=0; i< arrProductsClone.length; i++) {
        if ( arrProductsClone[i].color == colorSecondaryOne) {
            addInList(arrProductsClone[i])
        }
    }
    for(let i=0; i< arrProductsClone.length; i++) {
        if ( arrProductsClone[i].color == colorSecondaryTwo) {
            addInList(arrProductsClone[i])
        }
    }
    for(let i=0; i< arrProductsClone.length; i++) {
        if ( arrProductsClone[i].color == colorSecondaryTree) {
            addInList(arrProductsClone[i])
        }
    }
    function addInList (product){
        let newElemListProduct = elemListReport.cloneNode(true);
        newElemListProduct.querySelector('[name="name-product"]').textContent = product.name;
        newElemListProduct.querySelector('[name="remainder"]').value = product.remainder;
        newElemListProduct.querySelector('[name="coming"]').value = product.coming;
        newElemListProduct.querySelector('[name="amount"]').value = product.amount;
        newElemListProduct.querySelector('[name="remainder-sum"]').value = product.sum;
        newElemListProduct.style.background = product.color;
        listReport.appendChild(newElemListProduct);
        checkSum(newElemListProduct, newElemListProduct.querySelector('[name="remainder-sum"]').value)

        newElemListProduct.querySelector('.sign').addEventListener('click', ()=>{
            //обновление внешнее (только список)
            let newSum =  roundN(
                Number(newElemListProduct.querySelector('[name="remainder"]').value)
                + Number(newElemListProduct.querySelector('[name="coming"]').value)
                - Number(newElemListProduct.querySelector('[name="amount"]').value)
                ,3);
            newElemListProduct.querySelector('[name="remainder-sum"]').value = newSum

            // console.log(product.remainder)
            // console.log(product.coming)
            // console.log(product.amount)
            // console.log(product.sum)
            // console.log(updateSum(product))

            //обновление элемента с экрана
            let keyNameProduct = product.name //название ингредиента - ключ
            let obj = {
                'name' : product.name,
                'remainder' : Number(newElemListProduct.querySelector('[name="remainder"]').value),
                'coming' : Number(newElemListProduct.querySelector('[name="coming"]').value),
                'amount' :  Number(newElemListProduct.querySelector('[name="amount"]').value),
                'sum':  newSum, //внутренне обновление суммы одного элемента
                'color': product.color,
            }
            createLocalStorage(obj, keyNameProduct)

            checkSum(newElemListProduct, newElemListProduct.querySelector('[name="remainder-sum"]').value)
        })
    }
}


// function createNewElemList() {
//     for(let i=0; i<localStorage.length; i++) {
//         let key = localStorage.key(i);
//         // console.log(`${key}: ${localStorage.getItem(key)}`);

//         let product = JSON.parse( localStorage.getItem(key) );
//         console.log(product)

//         let newElemListProduct = elemListReport.cloneNode(true);
//         newElemListProduct.querySelector('[name="name-product"]').textContent = product.name;
//         newElemListProduct.querySelector('[name="remainder"]').value = product.remainder;
//         newElemListProduct.querySelector('[name="coming"]').value = product.coming;
//         newElemListProduct.querySelector('[name="amount"]').value = product.amount;
//         newElemListProduct.querySelector('[name="remainder-sum"]').value =
//                 Number(product.remainder)
//                 + Number(product.coming)
//                 + Number(product.amount);
//         // newElemListProduct.style.background = arrElems[i].color;
//         listReport.appendChild(newElemListProduct);

//     }
// //     for (let i = 0; i < arrElems.length; i++) {
// //         let newElemListProduct = elemListReport.cloneNode(true);
// //         newElemListProduct.querySelector('[name="name-product"]').textContent = arrElems[i].nameIngredient;
// //         newElemListProduct.querySelector('[name="amount"]').value = arrElems[i].amount;
// //         newElemListProduct.querySelector('[name="remainder-sum"]').value =
// //                 Number(newElemListProduct.querySelector('[name="remainder"]').value)
// //                 + Number(newElemListProduct.querySelector('[name="coming"]').value)
// //                 + Number(newElemListProduct.querySelector('[name="amount"]').value);
// //         newElemListProduct.style.background = arrElems[i].color;
// //         listReport.appendChild(newElemListProduct);

// //         //при изменении (вводе данных) пересчитывать сумму
// //         newElemListProduct.querySelector('[name="coming"]').addEventListener('input', ()=>{
// //             newElemListProduct.querySelector('[name="remainder-sum"]').value =
// //                 Number(newElemListProduct.querySelector('[name="remainder"]').value)
// //                 + Number(newElemListProduct.querySelector('[name="coming"]').value)
// //                 + Number(newElemListProduct.querySelector('[name="amount"]').value);
// //         })
// //         newElemListProduct.querySelector('[name="amount"]').addEventListener('input', ()=>{
// //             newElemListProduct.querySelector('[name="remainder-sum"]').value =
// //                 Number(newElemListProduct.querySelector('[name="remainder"]').value)
// //                 + Number(newElemListProduct.querySelector('[name="coming"]').value)
// //                 + Number(newElemListProduct.querySelector('[name="amount"]').value);
// //         })

// //         //сохранение продукта в локальное хранилище
// //         let keyNameProduct = arrElems[i].nameIngredient //название ингредиента - ключ
// //         let obj = {
// //             'name' : arrElems[i].nameIngredient,
// //             'remainder' : Number(newElemListProduct.querySelector('[name="remainder"]').value),
// //             'coming' : Number(newElemListProduct.querySelector('[name="coming"]').value),
// //             'amount' : Number(newElemListProduct.querySelector('[name="amount"]').value)
// //         }
// //         createLocalStorage(obj, keyNameProduct)
// // }
// }


function createLocalStorage(obj, keyNameProduct){
    // localStorage.test = 0;
    localStorage.setItem(keyNameProduct, JSON.stringify(obj));
    // localStorage.keyNameProduct = JSON.stringify(obj);

    let product = JSON.parse( localStorage.getItem(keyNameProduct) );
    // let user = JSON.parse( localStorage.user );
    console.log( product.name );
    console.log( product.remainder );
    console.log( product.coming );
    console.log( product.amount );
    console.log( product.color );
}

window.addEventListener('load', ()=>{
    // listProductBlock.style.display = 'none'
    // listSumProductsBlock.style.display = 'none'

    listReportBlock.style.display = 'none'
    cleanList(listReport)
    createNewElemList()
    updateStorageInput()

    // //вывод списка на экран
    // cleanList(listReport)
    // createNewElemList()
    // //обновление списка (длина списка !=0)
    // updateStorageInput()

    // btnExportReport.style.display = 'none'
})
function cleanList(list) {
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
}


function roundN(number, count) {
    return Math.round(number * Math.pow(10, count)) / Math.pow(10, count);
}
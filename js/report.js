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
                    'sum' : roundN( Number(product.remainder)
                    + Number(product.coming)
                    - Number(arrSumToXLSXClone[i].amount),
                    3),
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
                'sum': arrSumToXLSXClone[i].amount,
                'color': arrSumToXLSXClone[i].color,
            }
            createLocalStorage(obj, keyNameProduct)
        }
    }
    cleanList(listReport)
    createNewElemList()
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
            'sum': product.sum,
            'color': product.color,
        }
        createLocalStorage(obj, keyNameProduct)
    }
    cleanList(listReport)
    createNewElemList()
    updateStorageInput()
})

function updateStorageInput (){
    let arrElems = listReport.children;
    for(let i=0; i<arrElems.length; i++){
        arrElems[i].querySelector('[name="coming"]').addEventListener('input', ()=>{
            console.log('input')
            updateSum(arrElems[i]);
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
                        'sum' : updateSum(arrElems[i]),
                        'color': product.color,
                    }
                    createLocalStorage(obj, keyNameProduct)
                    break;
                }
            }
        })
        arrElems[i].querySelector('[name="amount"]').addEventListener('input', ()=>{
            updateSum(arrElems[i]);
            for(let j=0; j<localStorage.length; j++) {
                let key = localStorage.key(j);
                if(key === arrElems[i].querySelector('[name="name-product"]').textContent){
                    //получение значений продукта
                    let product = JSON.parse( localStorage.getItem(key) );
                    let keyNameProduct = product.name
                    let obj = {
                        'name' : product.name,
                        'remainder' : product.remainder,
                        'coming' : product.coming, //обновление расхода
                        'amount' : Number(arrElems[i].querySelector('[name="amount"]').value),
                        'sum' : updateSum(arrElems[i]),
                        'color': product.color,
                    }
                    createLocalStorage(obj, keyNameProduct)
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

    // //вывод списка на экран
    // cleanList(listReport)
    // createNewElemList()
    // //обновление списка (длина списка !=0)
    // updateStorageInput()

    btnExportReport.style.display = 'none'
})
function cleanList(list) {
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
}


function roundN(number, count) {
    return Math.round(number * Math.pow(10, count)) / Math.pow(10, count);
}
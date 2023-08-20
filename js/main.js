import {
    products, startValue
} from './data.js'

const colorPrimaryOne = '#A5E6B2';
const colorPrimaryTwo = '#D7F7DD';
const colorSecondaryOne = '#A0CADE';
const colorSecondaryTwo = '#C4ECFF';
const colorSecondaryTree = '#F7D6CB'
const colorWhite = 'white';

const roundPrimary = 1;
const roundSecondary = 3;
const roundWhole = 0;


const selectItems = document.getElementById('select-items');
const btnCalc = document.getElementById('btn-calc');
const btnSum = document.getElementById('btn-sum');
const btnClean = document.getElementById('btn-clean');
const inputOutputValue = document.getElementById('input-output-value');

window.addEventListener('load', ()=>{
    products.forEach(elem =>{
        let newOption = document.createElement('option');
        newOption.text = elem.name;
        newOption.value = elem.id;
        newOption = selectItems.appendChild(newOption);
    }
    )
    cleanList(listProduct);
    cleanList(listSum);
    cleanList(listSumProducts);
})

const listProduct = document.getElementById('list-product');
const elemListProduct = document.getElementById('elem-list-product');

btnCalc.addEventListener('click', ()=>{
    cleanList(listProduct);
    createNewElemList(getStartValuetMaterial(selectItems.value, inputOutputValue.value),listProduct,elemListProduct, 1); //'1', '200'
})
btnSum.addEventListener('click', ()=>{
    cleanList(listProduct);
    createNewElemList(getStartValuetMaterial(selectItems.value, inputOutputValue.value),listProduct,elemListProduct, 1);
    cleanList(listSum);
    sumStartValueMaterial(getStartValuetMaterial(selectItems.value, inputOutputValue.value)); //arr
})
let startArrSum =[{
    nameIngredient:'всего сырья',
    amount:0,
    color:colorPrimaryOne
}];
btnClean.addEventListener('click', ()=>{
    cleanList(listProduct);
    cleanList(listSum);
    cleanList(listSumProducts);
    startArrSum =[{
        nameIngredient:'всего сырья',
        amount:0,
        color:colorPrimaryOne,
    }];
})

function getStartValuetMaterial (idProduct, endValueMaterial){ //string, string
    idProduct = Number(idProduct); //number-1
    endValueMaterial = Number(endValueMaterial); //number-200
    let arrAllValues = [];
    let arrAllValuesCount = 0;
    for(let i=0; i<products.length; i++){
        if(products[i].id == idProduct){
            // allMaterials = (endValueMaterial * startValue / products[i].outputValue).toFixed(1);  //'181.8' строка в экспоненциальной форме
            let allMaterials = endValueMaterial * startValue / products[i].outputValue; // 14.285714285714286-число
            allMaterials = roundN(allMaterials,roundPrimary) //14.3-число
            // console.log('всего сырья  ',allMaterials);

            arrAllValues[arrAllValuesCount] = {
                nameProduct:products[i].name,
                outputValue:endValueMaterial,
                color:colorWhite,
            };
            arrAllValuesCount++;
            arrAllValues[arrAllValuesCount] = {
                nameIngredient:'всего сырья',
                amount:allMaterials,
                color:colorPrimaryOne
            };
            arrAllValuesCount++;

            products[i].ingredientsPrimary.forEach(ingredient =>{
                let valuePrimaryIngredient =  allMaterials*ingredient.amount/100; //number
                valuePrimaryIngredient = roundN(valuePrimaryIngredient,roundPrimary); //number

                arrAllValues[arrAllValuesCount] = {
                    nameIngredient:ingredient.nameIngredient,
                    amount: valuePrimaryIngredient,
                    color: colorPrimaryTwo
                }
                arrAllValuesCount++;
            })
            products[i].ingredientsSecondary.forEach(ingredient =>{
                let valueSecondaryIngredient =  allMaterials*ingredient.amount/startValue; //number
                if(ingredient.nameIngredient.includes('пакет') ||
                ingredient.nameIngredient.includes('скрепки') ||
                ingredient.nameIngredient.includes('скрепка') ||
                ingredient.nameIngredient.includes('петли') ||
                ingredient.nameIngredient.includes('петля') ||
                ingredient.nameIngredient.includes('контейнер') ||
                ingredient.nameIngredient.includes('тарелка')) valueSecondaryIngredient = roundN(valueSecondaryIngredient,roundWhole);
                else valueSecondaryIngredient = roundN(valueSecondaryIngredient,roundSecondary); //number

                // console.log(valueSecondaryIngredient);

                arrAllValues[arrAllValuesCount] = {
                    nameIngredient:ingredient.nameIngredient,
                    amount: valueSecondaryIngredient,
                    color: setColorPrimary(ingredient),
                }
                arrAllValuesCount++;
            })
            // return arrAllValues;
            break;
        }
    }
    return arrAllValues;
}

function setColorPrimary (ingredient){
    if(ingredient.nameIngredient.includes('черева') ||
        ingredient.nameIngredient.includes('шпагат') ||
        ingredient.nameIngredient.includes('фиброуз') ||
        ingredient.nameIngredient.includes('пакет') ||
        ingredient.nameIngredient.includes('скрепки') ||
        ingredient.nameIngredient.includes('скрепка') ||
        ingredient.nameIngredient.includes('петли') ||
        ingredient.nameIngredient.includes('петля') ||
        ingredient.nameIngredient.includes('коллаген') ||
        ingredient.nameIngredient.includes('контейнер') ||
        ingredient.nameIngredient.includes('тарелка')) return colorSecondaryTree
    else if(ingredient.nameIngredient.includes('соль') ||
        ingredient.nameIngredient.includes('нпс') ||
        ingredient.nameIngredient.includes('крахмал') ||
        ingredient.nameIngredient.includes('молоко') ||
        ingredient.nameIngredient.includes('порошок') ||
        ingredient.nameIngredient.includes('манка') ||
        ingredient.nameIngredient.includes('лук') ||
        ingredient.nameIngredient.includes('перец') ||
        ingredient.nameIngredient.includes('кориандр') ||
        ingredient.nameIngredient.includes('масло') ||
        ingredient.nameIngredient.includes('семена') ||
        ingredient.nameIngredient.includes('гречка') ||
        ingredient.nameIngredient.includes('орех') ||
        ingredient.nameIngredient.includes('мука') ||
        ingredient.nameIngredient.includes('чеснок') ||
        ingredient.nameIngredient.includes('тмин') ||
        ingredient.nameIngredient.includes('изолят') ||
        ingredient.nameIngredient.includes('лист') ||
        ingredient.nameIngredient.includes('клетчатка')) return colorSecondaryOne
    else return colorSecondaryTwo;
}

function roundN (number, count){
    return Math.round(number * Math.pow(10, count)) / Math.pow(10, count);
}

function createNewElemList(arrElems, list, child, firstPosition){
    if(firstPosition > 0){
        let firstElemArr = arrElems[0]; //сохранение первого
        arrElems.splice(0,1)  //удаление первого
        arrElems.sort((a, b) => a.nameIngredient > b.nameIngredient ? 1 : -1); //сортировка массива без первого
        arrElems.unshift(firstElemArr);  //возвращаем первый
    } else  arrElems.sort((a, b) => a.nameIngredient > b.nameIngredient ? 1 : -1);

    for(let i=firstPosition; i<arrElems.length; i++){
        if(arrElems[i].color == colorWhite){
            let newElemListProduct = child.cloneNode(true);
            newElemListProduct.querySelector('[name="name-product"]').textContent = arrElems[i].nameIngredient;
            newElemListProduct.querySelector('[name="value-product"]').textContent = arrElems[i].amount;
            newElemListProduct.style.background = arrElems[i].color;
            list.appendChild(newElemListProduct);
        }
    }
    for(let i=firstPosition; i<arrElems.length; i++){
        if(arrElems[i].color == colorPrimaryOne){
            let newElemListProduct = child.cloneNode(true);
            newElemListProduct.querySelector('[name="name-product"]').textContent = arrElems[i].nameIngredient;
            newElemListProduct.querySelector('[name="value-product"]').textContent = arrElems[i].amount;
            newElemListProduct.style.background = arrElems[i].color;
            list.appendChild(newElemListProduct);
        }
    }
    for(let i=firstPosition; i<arrElems.length; i++){
        if(arrElems[i].color == colorPrimaryTwo){
            let newElemListProduct = child.cloneNode(true);
            newElemListProduct.querySelector('[name="name-product"]').textContent = arrElems[i].nameIngredient;
            newElemListProduct.querySelector('[name="value-product"]').textContent = arrElems[i].amount;
            newElemListProduct.style.background = arrElems[i].color;
            list.appendChild(newElemListProduct);
        }
    }
    for(let i=firstPosition; i<arrElems.length; i++){
        if(arrElems[i].color == colorSecondaryOne){
            let newElemListProduct = child.cloneNode(true);
            newElemListProduct.querySelector('[name="name-product"]').textContent = arrElems[i].nameIngredient;
            newElemListProduct.querySelector('[name="value-product"]').textContent = arrElems[i].amount;
            newElemListProduct.style.background = arrElems[i].color;
            list.appendChild(newElemListProduct);
        }
    }
    for(let i=firstPosition; i<arrElems.length; i++){
        if(arrElems[i].color == colorSecondaryTwo){
            let newElemListProduct = child.cloneNode(true);
            newElemListProduct.querySelector('[name="name-product"]').textContent = arrElems[i].nameIngredient;
            newElemListProduct.querySelector('[name="value-product"]').textContent = arrElems[i].amount;
            newElemListProduct.style.background = arrElems[i].color;
            list.appendChild(newElemListProduct);
        }
    }
    for(let i=firstPosition; i<arrElems.length; i++){
        if(arrElems[i].color == colorSecondaryTree){
            let newElemListProduct = child.cloneNode(true);
            newElemListProduct.querySelector('[name="name-product"]').textContent = arrElems[i].nameIngredient;
            newElemListProduct.querySelector('[name="value-product"]').textContent = arrElems[i].amount;
            newElemListProduct.style.background = arrElems[i].color;
            list.appendChild(newElemListProduct);
        }
    }
    // for(let i=firstPosition; i<arrElems.length; i++){
    //     let newElemListProduct = child.cloneNode(true);
    //     newElemListProduct.querySelector('[name="name-product"]').textContent = arrElems[i].nameIngredient;
    //     newElemListProduct.querySelector('[name="value-product"]').textContent = arrElems[i].amount;
    //     newElemListProduct.style.background = arrElems[i].color;
    //     list.appendChild(newElemListProduct);
    // }
}
const listSum = document.getElementById('list-sum');
const elemListSum = document.getElementById('elem-list-sum');
const listSumProducts = document.getElementById('list-sum-products');
const elemListSumProducts = document.getElementById('elem-list-sum-products');


function sumStartValueMaterial (arrProduct){
    for(let i=0; i<startArrSum.length; i++){
        for(let j=1; j<arrProduct.length; j++){
            if(startArrSum[i].nameIngredient == arrProduct[j].nameIngredient){
                let sumAmount = startArrSum[i].amount+arrProduct[j].amount;
                sumAmount = roundN(sumAmount,roundSecondary);
                startArrSum[i].amount = sumAmount;
                arrProduct.splice(j,1)
                break;
            }
        }
    }
    createNewElemList([{
        nameIngredient:arrProduct[0].nameProduct,
        amount: arrProduct[0].outputValue,
        color:colorWhite,
    }], listSumProducts, elemListSumProducts, 0);
    arrProduct.splice(0,1)
    startArrSum = startArrSum.concat(arrProduct);
    createNewElemList(startArrSum, listSum, elemListSum, 0);
    // getStartValueMaterialSaveProducts();
}
function cleanList (list){
    while(list.firstChild){
        list.removeChild(list.firstChild);
    }
}



// function getStartValueMaterialSaveProducts(){
//     let elemsList = listSumProducts.children;
//     listSumProducts.forEach(elem =>{
//         elem.addEventListener('click', ()=>{
//             console.log('d[f[pdf[dpf[p')
//         })
//     })
// }


import {
    products, startValue
} from './data.js'

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
}];

btnClean.addEventListener('click', ()=>{
    cleanList(listProduct);
    cleanList(listSum);
    cleanList(listSumProducts);
    startArrSum =[{
        nameIngredient:'всего сырья',
        amount:0,
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
            allMaterials = roundN(allMaterials,1) //14.3-число
            // console.log('всего сырья  ',allMaterials);

            arrAllValues[arrAllValuesCount] = {
                nameProduct:products[i].name,
                outputValue:endValueMaterial,
            };
            arrAllValuesCount++;
            arrAllValues[arrAllValuesCount] = {
                nameIngredient:'всего сырья',
                amount:allMaterials,
            };
            arrAllValuesCount++;

            products[i].ingredientsPrimary.forEach(ingredient =>{
                let valuePrimaryIngredient =  allMaterials*ingredient.amount/100; //number
                valuePrimaryIngredient = roundN(valuePrimaryIngredient,3); //number
                // console.log(valuePrimaryIngredient);

                arrAllValues[arrAllValuesCount] = {
                    nameIngredient:ingredient.nameIngredient,
                    amount: valuePrimaryIngredient,
                }
                arrAllValuesCount++;
            })
            products[i].ingredientsSecondary.forEach(ingredient =>{
                let valueSecondaryIngredient =  allMaterials*ingredient.amount/startValue; //number
                valueSecondaryIngredient = roundN(valueSecondaryIngredient,3); //number
                // console.log(valueSecondaryIngredient);

                arrAllValues[arrAllValuesCount] = {
                    nameIngredient:ingredient.nameIngredient,
                    amount: valueSecondaryIngredient,
                }
                arrAllValuesCount++;
            })
            return arrAllValues;
            break;
        }
    }
}
function roundN (number, count){
    return Math.round(number * Math.pow(10, count)) / Math.pow(10, count);
}

function createNewElemList(arrElems, list, child, firstPosition){
    for(let i=firstPosition; i<arrElems.length; i++){
         let newElemListProduct = child.cloneNode(true);
         newElemListProduct.querySelector('[name="name-product"]').textContent = arrElems[i].nameIngredient;
         newElemListProduct.querySelector('[name="value-product"]').textContent = arrElems[i].amount;
         list.appendChild(newElemListProduct);
    }
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
                sumAmount = roundN(sumAmount,3);
                startArrSum[i].amount = sumAmount;
                arrProduct.splice(j,1)
                break;
            }
        }
    }
    createNewElemList([{
        nameIngredient:arrProduct[0].nameProduct,
        amount: arrProduct[0].outputValue,
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


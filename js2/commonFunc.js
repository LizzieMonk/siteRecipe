export const colorPrimaryOne = "#B5FFE4";
export const colorPrimaryTwo = "#A4EDE4";
export const colorPrimaryThree = "#9ED0DE";
export const colorSecondaryOne = "#B9C6F5";
export const colorSecondaryTwo = "#D3BAFF";
export const colorSecondaryTree = "#F6B4FA";
export const colorWhite = "white";

export const roundPrimary = 1;
export const roundSecondary = 3;
export const roundWhole = 0;

export function roundN(number, count) {
    return Math.round(number * Math.pow(10, count)) / Math.pow(10, count);
}

export function navigationNav(nav){
    nav.addEventListener('click', (event)=>{
        console.log(event.target)
        if(event.target.classList.contains('btn_a-data')){
            document.location.href = './data.html'
        }
        else if(event.target.classList.contains('btn_a-sum')){
            document.location.href = './index.html'
        }
        else if(event.target.classList.contains('btn_a-report')){
            document.location.href = './report.html'
        }
    })
}

export function liveSearch(parent, search) {
    let listOfElems = parent.children;
    for (let i = 0; i < listOfElems.length; i++) {
      if (listOfElems[i].textContent.toLowerCase().includes(search.value.toLowerCase())) {
        listOfElems[i].style.display = "flex";
      } else listOfElems[i].style.display = "none";
    }
}

export let arrProductToXLSX =[];
export let arrSumToXLSX =[];
export let arrSumProductToXLSX =[];

export function setValueArrToXLSX(arr, index, value){
    // arrProductToXLSX[countArrProductToXLSX++] = arrElems[0];
    if(arr == 'arrProductToXLSX' ){
        arrProductToXLSX[index] = value
    }
    else if(arr == 'arrSumToXLSX'){
        arrSumToXLSX[index] = value
    }
    else if(arr == 'arrSumProductToXLSX'){
        arrSumProductToXLSX[index] = value
    }
    // arr[index] = value
}
export function deleteValueArrToXLSX(arr, index){
    // arrProductToXLSX[countArrProductToXLSX++] = arrElems[0];
    if(arr == 'arrProductToXLSX' ){
        arrProductToXLSX.splice(index, 1);
    }
    else if(arr == 'arrSumToXLSX' ){
        arrSumToXLSX.splice(index, 1);
    }
    else if(arr == 'arrSumProductToXLSX'){
        arrSumProductToXLSX.splice(index, 1);
    }
    // arr.splice(index, 1);
}
export function cleanArrToXLSX(arr){
    if(arr == 'arrProductToXLSX' ){
        arrProductToXLSX = [];
    }
    else if(arr == 'arrSumToXLSX' ){
        arrSumToXLSX = [];
    }
    else if(arr == 'arrSumProductToXLSX'){
        arrSumProductToXLSX = [];
    }
    // arr = [];
}
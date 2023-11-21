let inputName= document.getElementById('inputName')
let inputComment= document.getElementById('inputComment')
let submitBtn =document.getElementById('submitBtn');
let guests_info = document.getElementById('guests_info');

let guestName= inputName.value;
let guestComment = inputComment.value;

var obj =JSON.parse(josnString);//JSON string into an object
var newGuest= {guestName, guestComment};// create a object

obj.guests.push(newGuest);

var newJsonString= JSON.stringify(obj);//Object->JSON 
console.log(newGuest)

function displayGuestInfo (){

    guests_info.innerHTML='';

    for(var i=guests.length-1; i>=0; i--){

        let divItem = document.createElement("div"); // this create each row
        divItem.className ="container p-2";
    divItem.innerHTML = `
    <p>${guests[i].name}</p> <p>${guests[i].comment} </p>
    `
    guests_info.appendChild(divItem);
    }
}

submitBtn.addEventListener('click', displayGuestInfo);

function toggleCard(cardId) {
    var card = document.getElementById(cardId);
    card.classList.toggle('expanded');
}
//form fields creation for the person
var flag=false;
function askYesNoQuestion(question) {
    flag=true;
    let answer = prompt(question + " (yes or no)");
    if (answer.toLowerCase() === "yes") {
      return true;
    } else if (answer.toLowerCase() === "no") {
      return false;
    } else {
      // If the user enters an invalid response, prompt again
      alert("Please enter 'yes' or 'no'");
      
      return askYesNoQuestion(question);
    }
  }

let answer;
document.getElementById('num-people').addEventListener('input',function(){
    var numberPeople=parseInt(this.value);
    var people=document.querySelector('#people-details');
    let i=0;
    people.innerHTML=`<h4>Please enter each person details(name,email,phonen no):</h4>`
    if(flag===false){
     answer= askYesNoQuestion("Including You?");
    }
    if(answer){
        var div=document.createElement('div');
        div.innerHTML=`
        <label for="person-name-${i}">Name:</label>
        <input type="text" id="person-name-${i}" name="person-name-${i}" value="${userId}" min="0" step="0.01" required><br>
        <h3>Other Person Details Please</h3>
        `;
        people.appendChild(div);
       i++;
    }
    for(i;i<numberPeople;i++){
        var div=document.createElement('div');
        div.innerHTML=`
        <label for="person-name-${i}">Name:</label>
        <input type="text" id="person-name-${i}" name="person-name-${i}" ><br>
        <label for="person-email-${i}">Email:</label>
        <input type="email" id="person-email-${i}" name="person-email-${i}" ><br>
        <label for="person-phone-${i}">Phone:</label>
        <input type="text" id="person-phone-${i}" name="person-phone-${i}" ><br>
        `;
        people.appendChild(div);
    }

})
//manual and equal distribution 
document.querySelectorAll('input[name="distribution-type"]').forEach(function(value){
        value.addEventListener('change',function(){
            var manualDistribution=document.getElementById('manual-distribution');
            if(this.value == 'manual'){
                manualDistribution.style.display='block';
                populateManualDistribution();
            }
            else{
                manualDistribution.style.display='block';
                populateDistribution();
            }
        })
});
//for the equal distribution
function populateDistribution(){
    var numPeople = parseInt(document.getElementById('num-people').value);
    var manualDistribution = document.getElementById('manual-distribution');
    let price=document.getElementById('price').value;
    let val=(price==0)?0:price/numPeople;
    manualDistribution.innerHTML = '';
    for (var i = 0; i < numPeople; i++) {
        var div = document.createElement('div');
        div.className='amountss';
        div.innerHTML = `
            <label for="person-amount-${i}">Amount for Person ${i + 1}:</label>
            <input type="number" id="person-amount-${i}" name="person-amount-${i}" value="${val}" min="0" step="0.01" required><br>
        `;
        manualDistribution.appendChild(div);
    }   
}
document.getElementById('num-people').addEventListener('input', populateDistribution);
document.getElementById('price').addEventListener('input', populateDistribution);
//for manual distribution
function populateManualDistribution() {
    var numPeople = parseInt(document.getElementById('num-people').value);
    var manualDistribution = document.getElementById('manual-distribution');
    manualDistribution.innerHTML = ''; // Clear previous content

    for (var i = 0; i < numPeople; i++) {
        var div = document.createElement('div');
        div.className='amountss';
        div.innerHTML = `
            <label for="person-amount-${i}">Amount for Person ${i + 1}:</label>
            <input type="number" class="values" id="person-amount-${i}" name="person-amount-${i}" onchange="checkLimit()" min="0" step="0.01" required><br>
        `;
        manualDistribution.appendChild(div);
    }
}
// Function to check if manually distributed amounts exceed the total price
function checkLimit() {
    var price = parseFloat(document.getElementById('price').value);
    const numPeople = parseInt(document.getElementById('num-people').value);
    let totalManualAmount = 0;
    // Loop through each manually entered amount and sum them up
    for (let i = 0; i < numPeople; i++) {
        const amount = parseFloat(document.getElementById(`person-amount-${i}`).value);
        totalManualAmount += amount;
        if (totalManualAmount > price) {
            alert('The total manually distributed amount exceeds the total price!');
            document.getElementById(`person-amount-${i}`).value='';
            // You can take appropriate action here, such as resetting the amounts or displaying an error message
        }
    }

    // Check if the total manually distributed amount exceeds the total price
}
// Call the function to attach event listeners once the DOM content is loaded
//data handling..
let userId,userName,userEmail,userPhone;
class Transactions{
    constructor (itemName,price,date,numPeople,peopleDetails){
        this.itemName=itemName;
        this.price=price;
        this.date=date;
        this.numPeople=numPeople;
        this.peopleDetails=peopleDetails;
    }
}
async function addTransaction() {
    const itemName = document.querySelector('#item-name').value;
    const price = document.querySelector('#price').value;
    const date = document.querySelector('#date').value;
    const numPeople = document.querySelector('#num-people').value;

    // Array to store details of each person
    const peopleDetails = [];

    // Loop through each person to collect their details
    for (let i = 0; i < numPeople; i++) {
        let personName = document.querySelector(`#person-name-${i}`).value;
        let personEmail,personPhone
        console.log(personName,userId);
        if(i==0 && personName==userId){
             personName=userName;
             personEmail = userEmail;
             personPhone = userPhone;
        }
        else{
         personEmail = document.querySelector(`#person-email-${i}`).value;
         personPhone = document.querySelector(`#person-phone-${i}`).value;
        }
        const amt = document.querySelector(`#person-amount-${i}`).value;
        peopleDetails.push({
            personName,
            personEmail,
            personPhone,
            amt
        });
    }

    // Create an object representing the transaction
    const transactionData = {
        userId,
        itemName,
        price,
        date,
        numPeople,
        peopleDetails
    };

    // Send the transaction data to the server
    try{
        const response= await fetch('http://localhost:5000/api/addTransaction',{
            method: 'POST',
			    headers: {
			        'Content-Type': 'application/json',
			    },
			    body: JSON.stringify(transactionData),
        })
        if (response.ok) {
            const data = await response.json();
            console.log('ok find..');
        }
        else{
            console.error('Error creating new transaction', response.statusText);
        }
         }
        catch(error){
                console.log(error);
        }

    // Clear input fields
    document.querySelector('#item-name').value = '';
    document.querySelector('#price').value = '';
    document.querySelector('#date').value = '';
    document.querySelector('#num-people').value = '';
    for (let i = 0; i < numPeople; i++) {
        if(i==0 && peopleDetails[0].personName==userName){
            document.querySelector(`#person-name-${i}`).value = '';
        }
        else{
        document.querySelector(`#person-name-${i}`).value = '';
        document.querySelector(`#person-email-${i}`).value = '';
        document.querySelector(`#person-phone-${i}`).value = '';
        document.querySelector(`#person-amount-${i}`).value = '';
        }
    }
    flag=false;
}

async function fetchTransaction() {
    const transactionsDisplay = document.querySelector('.display-content');
    transactionsDisplay.innerHTML = '';  // Clear the display content

    try {
        const response = await fetch(`http://localhost:5000/api/allTransactions/${userId}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const allTransactionsArray=await response.json();
        console.log(allTransactionsArray);
        console.log('Type of allTransactionsArray:', typeof allTransactionsArray);


        // Check if allTransactionsArray is an array and has items
        if (allTransactionsArray) {
            allTransactionsArray.forEach(transaction => {
                console.log('Transaction:', transaction);  // Debug: Check each transaction

                const transactionCard = document.createElement('div');
                transactionCard.classList.add('transaction-card');

                const transactionHeader = document.createElement('h2');
                transactionHeader.classList.add('transaction-header');
                transactionHeader.textContent = `Item Name: ${transaction.itemName || 'N/A'}, Price: ${transaction.price || 'N/A'}`;
               
                const removeButton = document.createElement('button');
                removeButton.classList.add('remove-button');
                removeButton.textContent = 'Remove';
                removeButton.onclick = function() {
                    deleteDocument(transaction._id);
                };
                console.log(transaction._id);
                removeButton.dataset.objectId=transaction.objectId;
                transactionHeader.appendChild(removeButton);
                transactionCard.appendChild(transactionHeader);
                const transactionContent = document.createElement('div');
                transactionContent.classList.add('transaction-content');

                const transactionDetails = document.createElement('p');
                transactionDetails.textContent = `Date: ${transaction.date || 'N/A'}, Number of People: ${transaction.numPeople || 'N/A'}`;
                transactionContent.appendChild(transactionDetails);

                const peopleFieldset = document.createElement('fieldset');
                const peopleLegend = document.createElement('legend');
                peopleLegend.textContent = 'People Details';
                peopleFieldset.appendChild(peopleLegend);

                let i = 1;  // Initialize the counter for each transaction
                if (Array.isArray(transaction.peopleDetails)) {
                    transaction.peopleDetails.forEach(person => {
                        const personDetails = document.createElement('p');
                        personDetails.textContent = `Name: ${person.personName || 'N/A'}, Email: ${person.personEmail || 'N/A'}, Phone: ${person.personPhone || 'N/A'}, Amount: ${person.amt || 'N/A'}`;
                        peopleFieldset.appendChild(personDetails);

                        if (i < transaction.numPeople) {
                            const hr = document.createElement('hr');
                            peopleFieldset.appendChild(hr);
                        }
                        i++;
                    });
                } else {
                    const noPeopleMessage = document.createElement('p');
                    noPeopleMessage.textContent = 'No people details available.';
                    peopleFieldset.appendChild(noPeopleMessage);
                }

                transactionContent.appendChild(peopleFieldset);
                transactionCard.appendChild(transactionContent);
                transactionsDisplay.appendChild(transactionCard);
            });
        } else {
            const transactionCard = document.createElement('div');
            transactionCard.classList.add('transaction-card');
            const transactionHeader = document.createElement('h3');
            transactionHeader.classList.add('transaction-content');
            transactionHeader.textContent = 'There are no transactions';
            transactionCard.appendChild(transactionHeader);
            transactionsDisplay.appendChild(transactionCard);
        }
    } catch (error) {
        console.error('Error occurred during fetching the transactions:', error);
    }
}
document.querySelector('.display-bill').addEventListener('click', function () {
    fetchTransaction();
});


async function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams.get(name));
    userId=urlParams.get(name);
    try{
        const response = await fetch(`http://localhost:5000/api/users/${userId}`); // Replace with your API endpoint
                if (response.ok) {
                    const userData = await response.json();
                    userName=userData.name;
                    userEmail=userData.email;
                    userPhone=userData.phone;
                    console.log(userName,userEmail)
                }
                else{
                console.log(response.json());
                console.log('Not Exists');
                }
    }catch(error){
        console.log(error);
    }
     urlParams.get(name);
}

document.addEventListener('DOMContentLoaded', function() {
     getQueryParameter('userId');
});
async function deleteDocument(objectId) {
   // const objectId=this.dataset.objectId;
    console.log(objectId);
    try {
        const response = await fetch(`http://localhost:5000/api/delete/${objectId}`, {
            method: 'DELETE',
        });
        const message = await response.text();
        console.log(message);
        fetchTransaction();
    } catch (err) {
        console.error('Error:', err);
    }
    
}
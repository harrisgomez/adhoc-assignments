// your code goes here ...

// Validate data entry (age is required and > 0, relationship is required)
// Add people to a growing household list
// Reset the entry form after each addition
// Remove a previously added person from the list
// Display the household list in the HTML as it is modified
// Serialize the household as JSON upon form submission as a fake trip to the server

var form = document.getElementsByTagName('form')[0];
var add = document.getElementsByClassName('add')[0];

add.addEventListener('click', function (e) {
    e.preventDefault();

    // Construct the member object
    var member = {};
    var age = form[0].value;
    var relationship = form[1].value;
    var smoker = form[2].checked ? 'Yes' : 'No';

    member.age = age;
    member.relationship = relationship.charAt(0).toUpperCase() + relationship.slice(1);
    member.smoker = smoker;

    if (isValid(member)) {
        addMember(member);
        form.reset();
    }
});

// HELPER FUNCTIONS

function isValid(member) {
    // Validate the required form fields
    var isValid = true;
    
    if (!member.age.length || member.age <= 0 || isNaN(member.age)) isValid = false;
    if (!member.relationship.length) isValid = false;

    return isValid;
}

function addMember(member) {
    // Build the DOM elements

    // Create item containing household member info
    var list = document.getElementsByClassName('household')[0];
    var item = document.createElement('LI');
    var text = `
        Age: ${member.age}, 
        Relationship: ${member.relationship}, 
        Smoker: ${member.smoker}
    `;
    var textNode = document.createTextNode(text);

    // Include button to remove household member
    var remove = document.createElement('BUTTON');
    remove.innerHTML = 'X';
    remove.onclick = function() {
        list.removeChild(item);
    }

    item.appendChild(remove);
    item.appendChild(textNode);
    list.appendChild(item);
}
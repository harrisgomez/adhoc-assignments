// your code goes here ...

// Member Class for constructing household members
function Member(age, relationship, isSmoker) {
    var uniqueId = new Date().getTime();

    this.id = uniqueId;
    this.age = age;
    this.relationship = relationship;
    this.isSmoker = isSmoker;
}

Member.prototype.validate = function() {
    var errors = [];
    var message = '';

    if (!this.age) {
        message = 'Age field is required.';
        errors.push(message);
    } else if (isNaN(this.age) || this.age <= 0) {
        message = 'Age should be a valid number.';
        errors.push(message);
    }

    if (!this.relationship) {
        message = 'Relationship field is required.';
        errors.push(message);
    }

    return errors;
};


// HouseholdManager Class for validating, adding, and removing members
// This will also be responsible for serializing the final list
function HouseholdManager() {
    this.members = [];
}

HouseholdManager.prototype.addMember = function(member) {
    // Validate the member before adding to members list
    var errorsArr = member.validate();
    
    if (errorsArr.length > 0) throw { message: errorsArr };

    this.members.push(member);
};

HouseholdManager.prototype.removeMember = function(id) {
    for (var i = 0; i < this.members.length; i++) {
        if (this.members[i].id === parseInt(id)) this.members.splice(i, 1);
    }
};

HouseholdManager.prototype.serialize = function() {
    return JSON.stringify(this.members.map(function(member) {
        return {
            age: member.age,
            relationship: member.relationship,
            isSmoker: member.isSmoker
        };
    }), null, 4); // prettifys the json
};

// FormManager Class for handling any DOM events
function FormManager() {
    this.householdManager = new HouseholdManager;

    // Form inputs
    this.form = document.querySelector('form');
    this.ageField = document.querySelector('input[name="age"]');
    this.relationshipField = document.querySelector('select[name="rel"]');
    this.smokerField = document.querySelector('input[name="smoker"]');

    // Form buttons
    this.addBtn = document.querySelector('button.add');
    this.submitBtn = document.querySelector('button[type="submit"]');

    // Display areas
    this.membersList = document.querySelector('ol.household');
    this.debug = document.querySelector('pre.debug');
    this.errors = document.createElement('P');
    this.form.prepend(this.errors);
}

FormManager.prototype.handleAddMember = function(e) {
    e.preventDefault();

    // Get input values and instantiate new member
    var member = new Member(
        this.ageField.value,
        this.relationshipField.value,
        this.smokerField.checked
    );

    try {
        this.householdManager.addMember(member);
        this.clearForm();
        this.clearErrors();
        this.displayMembers();
    } catch(err) {
        this.displayErrors(err);
    }
};

FormManager.prototype.handleSubmit = function(e) {
    e.preventDefault();
    
    var serialized = this.householdManager.serialize();

    this.debug.innerHTML = serialized;
    this.debug.style.display = 'block';
};

FormManager.prototype.handleDelete = function(e) {
    var id = e.target.parentNode.getAttribute('id');
    
    this.householdManager.removeMember(id);
    this.displayMembers();
};

FormManager.prototype.displayMembers = function() {
    // Clear list area on initial render
    var _this = this;
    var membersList = this.membersList;
    membersList.innerHTML = '';

    this.householdManager.members.forEach(function(member) {
        var item = document.createElement('LI');
        var deleteBtn = document.createElement('BUTTON');
        
        // Parse the member and render the desired text
        item.setAttribute('id', member.id);
        item.innerHTML = `
            Age: ${member.age}, 
            Relationship: ${member.relationship.charAt(0).toUpperCase() + member.relationship.slice(1)}, 
            Smoker: ${member.isSmoker ? 'Yes' : 'No'}
        `;

        // Include delete button for each member instance
        deleteBtn.innerHTML = 'X';
        deleteBtn.onclick = _this.handleDelete.bind(_this);
        
        // Append the items to the DOM
        item.prepend(deleteBtn);
        membersList.append(item);
    });
};

FormManager.prototype.clearForm = function() {
    this.form.reset();
};

FormManager.prototype.displayErrors = function(errors) {
    this.errors.innerHTML = errors.message.join(' ');
};

FormManager.prototype.clearErrors = function() {
    this.errors.innerHTML = '';
};

FormManager.prototype.initializeEvents = (function(formInstance) {
    formInstance.addBtn.onclick = formInstance.handleAddMember.bind(formInstance);
    formInstance.submitBtn.onclick = formInstance.handleSubmit.bind(formInstance);
})(new FormManager);

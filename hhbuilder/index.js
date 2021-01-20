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
    this.members.push(member);
};

HouseholdManager.prototype.removeMember = function(id) {
    for (var i = 0; i < this.members.length; i++) {
        if (members[i].id === id) this.splice(i, 1);
    }
};

// FormManager Class for handling any DOM events
function FormManager() {
    // Form inputs
    this.form = document.querySelector('form');
    this.ageField = document.querySelector('input[name=age]');
    this.relationshipField = document.querySelector('select[name=rel]');
    this.smokerField = document.querySelector('input[name=smoker]');
}

FormManager.prototype.initializeEvents = function() {
    this.addBtn.onclick = this.handleAddMember.bind(this);
    this.submitBtn.onclick = this.handleSubmit.bind(this);
};
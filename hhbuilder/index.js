// your code goes here ...
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
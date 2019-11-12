let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let petSchema = mongoose.Schema({
    name: {type: String},
    typeOfPet: {type: String},
    id: {
        type: Number, 
        required: true}
});

let Pet = mongoose.model('Pet', petSchema);

let PetList = {
    post: function(newPet) {
        return Pet.create(newPet)
            .then(pet => {
                return pet;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    getAll: function() {
        return Pet.find()
            .then(pet => {
                return pet;
            })
            .catch(err => {
                throw Error(err);
            })
    },
    get: function(idToFind) {
        return Pet.findOne({id:idToFind})
            .then(pet => {
                return pet;
            })
            .catch(err => {
                throw Error(err);
            })
    },
    put: function(idToFind, updatedPet) {
        return Pet.findOneAndUpdate({id:idToFind}, {$set: {updatedPet}}, {new:true})
            .then(pet => {
                return pet;
            })
            .catch(err => {
                throw Error(err);
            })
    }
}

module.exports = {PetList};
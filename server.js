let express = require('express');
let morgan = require('morgan');
let bp = require('body-parser');

let jsonParser = bp.json();

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let { PetList } = require('./model');

let {DATABASE_URL, PORT} = require('./config');

let app = express();

app.use(express.static('public'));
app.use(morgan('dev'));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

let nameOfPets = [
    {
        name: "Burbuja",
        typeOfPet: "Dog",
        id: 90
    },
    {
        name: "Kia",
        typeOfPet: "Dog",
        id: 110
    },
    {
        name: "Jagger",
        typeOfPet: "Dog",
        id: 66
    },
    {
        name: "Zury",
        typeOfPet: "Dog",
        id: 1
    },
    {
        name: "Kiki",
        typeOfPet: "Hamster",
        id: 3
    }
];

app.post("/api/postPet", jsonParser, (req, res, next) => {
    let { name, typeOfPet, id } = req.body;

    if (!name || !typeOfPet || !id) {
        res.statusMessage = "Missing field in the body";
        return res.status(406).json({
            message: "Missing field in the body",
            status: 406
        })
    }

    // We still need to validate that the ID doesn't exist

    let newPet = {
        name,
        typeOfPet,
        id
    };

    PetList.post(newPet)
        .then(pet => {
            return res.status(201).json(pet);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB";
            return res.status(500).json({
                message: "Something went wrong with the DB",
                status: 500
            })
        })
});

app.get("/api/pets", (req, res, next) => {
    PetList.getAll()
        .then(pet => {
            return res.status(201).json(pet);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB";
            return res.status(500).json({
                message: "Something went wrong with the DB",
                status: 500
            })
        })
})

app.get("/api/pets/byId", (req, res, next) => {
    console.log(req.query.id);
    if (req.query.id == undefined) {
        res.statusMessage = "Pet not found";
        return res.status(404).json({
            code: 404,
            message: "Pet not found"
        })
    }
    PetList.get(req.query.id)
        .then(pet => {
            return res.status(201).json(pet);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB";
            return res.status(500).json({
                message: "Something went wrong with the DB",
                status: 500
            })
        })
})

app.put('/api/updatePet/:id', jsonParser, (req, res, next) => {
    if (req.body.name == undefined || req.body.typeOfPet == undefined || req.body.id == undefined) {
        res.statusMessage = "Missing field in body";
        return res.status(406).json({
            code: 406,
            message: "Missing field in body"
        })
    }

    if (req.body.id != req.params.id) {
        res.statusMessage = "Bad request. Id in param must match id in body";
        return res.status(400).json({
            code: 400,
            message: "Bad request. Id in param must match id in body"
        })
    }
    let { name, typeOfPet, id } = req.body;
    PetList.get(id)
        .then(pet => {
            let updatedPet = {
                name,
                typeOfPet,
                id
            };
            console.log("I MADE IT")
            if (pet != null) {
                PetList.put(id, updatedPet)
                    .then(pet => {
                        return res.status(201).json(pet);
                    })
                    .catch(err => {
                        res.statusMessage = "Something went wrong with the DB";
                        return res.status(500).json({
                            message: "Something went wrong with the DB",
                            status: 500
                        })
                    })
            }
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB";
            return res.status(500).json({
                message: "Something went wrong with the DB",
                status: 500
            })
        })

    res.statusMessage = "Pet not found";
    return res.status(404).json({
        code: 404,
        message: "Pet not found"
    })

});



/*
app.get('/api/pets', (req, res, next) => {
    console.log("Red query", req.query);
    return res.status(200).json(nameOfPets);
    
    //res.statusMessage = "Something went wrong.";
    //return res.status(400).json({
      //  code: 400,
        //message: "Something went wrong!"
    //})
    
}); 
*/

/* ORIGINAL
app.get('/api/pets/:id', (req, res, next) => {
    console.log("Red param", req.params);
    console.log("Red query", req.query);
    return res.status(200).json(nameOfPets);
});
*/

/*
app.get('/api/pets/byId', (req, res, next) => {
    console.log("Red param", req.params);
    console.log("Red query", req.query);

    if (req.query.id == undefined) {
        res.statusMessage = "Missing id param";
        return res.status(406).json({
            code: 406,
            message: "Missing id param"
        })
    }

    let foundId = false;
    let index;
    for (let i = 0; i < nameOfPets.length; i++) {
        if (nameOfPets[i].id == req.query.id) {
            index = i;
            foundId = true;
        }
    }

    if (!foundId) {
        res.statusMessage = "Pet id not found in the list";
        return res.status(404).json({
            code: 404,
            message: "Pet id not found in the list"
        })
    }
    return res.status(200).json(nameOfPets[index]);
});

app.post('/api/postPet', jsonParser, (req, res, next) => {
    console.log("I AM HERE");
    console.log(req.body);
    console.log(req.body.name);
    if (req.body.name == undefined || req.body.id == undefined || req.body.typeOfPet == undefined) {
        res.statusMessage = "Missing field in body";
        return res.status(406).json({
            code: 406,
            message: "Missing field in body"
        }) 
    }
    for (let i = 0; i < nameOfPets.length; i++) {
        if (nameOfPets[i].id == req.body.id) {
            res.statusMessage = "Repeated identified";
            return res.status(409).json({
                code: 409,
                message: "Repeated idenfitier"
            })
        }
    }

    nameOfPets.push({
        name: req.body.name, 
        typeOfPet: req.body.typeOfPet,
        id: req.body.id
    })
    res.statusMessage = "Pet added";
    return res.status(201).json({
        code: 201,
        message: "Pet added"
    });
    

});

app.delete('/api/removePet/:id', (req, res, next) => {
    console.log("I AM HERE");
    if (req.params.id == undefined) {
        res.statusMessage = "Pet not found";
        return res.status(404).json({
            code: 404,
            message: "Pet not found"
        })
    }
    for (let i = 0; i < nameOfPets.length; i++) {
        if (nameOfPets[i].id == req.params.id) {
            nameOfPets.splice(i, 1);
            res.statusMessage = "Succesfully deleted pet";
            return res.status(200).json({
                code: 200,
                message: "Succesfully deleted pet"
            })
        }
    }
    res.statusMessage = "Pet not found";
    return res.status(404).json({
        code: 404,
        message: "Pet not found"
    })
});

app.put('/api/updatePet/:id', jsonParser, (req, res, next) => {
    console.log("BACK IN BUSINESS");
    
    if (req.body.name == undefined || req.body.typeOfPet == undefined || req.body.id == undefined) {
        res.statusMessage = "Missing field in body";
        return res.status(406).json({
            code: 406,
            message: "Missing field in body"
        })
    }
    
    if (req.body.id != req.params.id) {
        res.statusMessage = "Bad request. Id in param must match id in body";
        return res.status(400).json({
            code: 400,
            message: "Bad request. Id in param must match id in body"
        })
    }
    
    for (let i = 0; i < nameOfPets.length; i++) {
        if (nameOfPets[i].id == req.params.id) {
            nameOfPets[i].id = req.body.id;
            nameOfPets[i].name = req.body.name;
            nameOfPets[i].typeOfPet = req.body.typeOfPet;
            res.statusMessage = "Updated pet object";
            return res.status(200).json({
                code: 200,
                message: "Updated pet object"
            })
        }
    }
    res.statusMessage = "Pet not found";
    return res.status(404).json({
        code: 404,
        message: "Pet not found"
    })

});

*/

/*
IF YOU WANT TO UPLOAD  NODE JS PROJECT TO GITHUB, DON'T FORGET TO DO 
.gititnore node_modules
*/

/*
app.listen('8080', () => {
    console.log("App running on localhost:8080");
});
*/
let server;

function runServer(port, databaseUrl) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, response => {
            if (response) {
                return reject(response);
            }
            else {
                server = app.listen(port, () => {
                    console.log("App is running on port " + port);
                    resolve();
                })
                    .on('error', err => {
                        mongoose.disconnect();
                        return reject(err);
                    })
            }
        });
    });
}

function closeServer() {
    return mongoose.disconnect()
        .then(() => {
            return new Promise((resolve, reject) => {
                console.log('Closing the server');
                server.close(err => {
                    if (err) {
                        return reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
}

runServer(PORT, DATABASE_URL)
    .catch(err => {
        console.log(err);
    });

module.exports = { app, runServer, closeServer };
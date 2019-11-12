
function init() {
    let url="/api/pets/byId?id=1";
    let settings = {
        method: 'GET'
    }
    fetch(url, settings)
    .then(response => {
        if (response.ok) {
            return response.json();
        }

        throw new Error (response.statusText);
    })
    .then(responseJSON => {

        for (let i = 0; i < responseJSON.length; i++) {
            $(".listOfPets").append(`<li>${responseJSON[i].name}</li>`)
        }
        console.log(responseJSON);
    })
    .catch(err => {
        console.log(err);
    })
}

init();
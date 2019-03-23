// Delete methods
Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
};

// VARIABLES
let form = document.getElementById('form');
let name = document.getElementById('name');
let email = document.getElementById('email');
let submit = document.getElementById('submit');
let elements = form.elements;

let territory_id = document.getElementById('territory_id');
let selects = document.getElementById('selects');

territory_id.onchange = () => {
    resetError(elements.territory.parentNode);

    if (document.getElementById('cities_div')) {
        document.getElementById('cities_div').remove();
    }
    if (document.getElementById('district_div')) {
        document.getElementById('district_div').remove();
    }

    axios.post('territory.php', {territory_id: territory_id.value})
        .then((data) => {
                let cities_div = document.createElement('div');
                cities_div.id = 'cities_div';
                cities_div.className = 'form-group';
                let cities_select = cities_div.appendChild(document.createElement('select'));
                cities_select.name = 'cities';

                cities_select.className = 'chosen-select';
                let options = document.createElement('option');
                options.value = '';
                cities_select.appendChild(options);

                for (let city of data.data.cities) {
                    let options = document.createElement('option');
                    options.value = city.ter_id;
                    options.innerHTML = city.ter_name;
                    cities_select.appendChild(options);
                }

                selects.appendChild(cities_div);

                cities_select.onchange = () => {
                    resetError(elements.cities.parentNode);

                    if (document.getElementById('district_div')) {
                        document.getElementById('district_div').remove();
                    }

                    axios.post('territory.php', {city_id: cities_select.value})
                        .then((data) => {
                            let district_div = document.createElement('div');
                            district_div.id = 'district_div';
                            // cities_div.className = 'form-group';
                            let district_select = district_div.appendChild(document.createElement('select'));
                            // cities_select.className = 'chosen-select';
                            district_select.name = 'districts';

                            let options = document.createElement('option');
                            options.value = '';
                            district_select.appendChild(options);
                            if (data.data.districts !== 0) {
                                for (let district of data.data.districts) {
                                    let options = document.createElement('option');
                                    options.value = district.ter_id;
                                    options.innerHTML = district.ter_name;
                                    district_select.appendChild(options);
                                }


                                district_select.onchange = () => {
                                    resetError(elements.districts.parentNode);
                                };

                                selects.appendChild(district_div);
                            }
                        })
                        .catch((err) => {
                            console.error(err)
                        })
                }
            }
        )
        .catch((err) => {
            console.log(err)
        })
};


//PREVENT DEAFULT FOR FORM
$("#form").submit(function (e) {
    return false;
});

// VALIDATION

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function showError(container, errorMessage) {
    container.className = 'error';
    var msgElem = document.createElement('p');
    msgElem.className = "alert alert-danger";
    msgElem.innerHTML = errorMessage;
    container.appendChild(msgElem);
}

function resetError(container) {
    container.className = '';
    if (container.lastChild.className == "alert alert-danger") {
        container.removeChild(container.lastChild);
    }
}


submit.onclick = () => {
    let error = false;
    // RESET ERRORS
    resetError(elements.name.parentNode);
    resetError(elements.email.parentNode);

    resetError(elements.territory.parentNode);
    if (elements.cities) {
        resetError(elements.cities.parentNode)

    }
    if (elements.districts) {
        resetError(elements.districts.parentNode);

    }

    // CHECK ERRORS
    if (name.value.length < 1) {
        showError(elements.name.parentNode, ' Укажите ФИО.');
        error = true;
    }

    if (email.value.length < 1 || (!validateEmail(email.value))) {
        showError(elements.email.parentNode, ' Укажите email.');
        error = true;
    }

    if (!elements.territory.value) {
        showError(elements.territory.parentNode, ' Укажите откуда вы.');
        error = true;
    }

    if (typeof cities_div !== 'undefined') {
        if (!elements.cities.value) {
            return showError(elements.cities.parentNode, ' Укажите откуда вы cities.');
            error = true;
        }
    }

    if (typeof district_div !== 'undefined') {
        if (!elements.districts.value) {
            return showError(elements.districts.parentNode, ' Укажите откуда вы DISTRICTS.');
            error = true;
        }
    }

    let ter_id;

    if (typeof elements.districts !== 'undefined' && elements.districts.value) {
        ter_id = elements.districts.value
    } else if (typeof elements.cities !== 'undefined' && elements.cities.value) {
        ter_id = elements.cities.value
    } else {
        ter_id = elements.territory.value
    }

    if (error === false) {
        axios.post('registration.php', {
            'name': elements.name.value,
            'email': elements.email.value,
            'ter_id': ter_id
        })
            .then((data) => {
                if (data.data.data === 0) {
                    alert('Succes registration')
                } else {
                    alert('Пользователь с таким Email уже существует')
                    let existUser_div = document.createElement('div');
                    divvv.appendChild(existUser_div);
                    existUser_div.id = 'existUser';
                    existUser_div.className = 'form-group';
                    existUser_div.name = 'existUser';
                    let table = document.createElement("table");
                    existUser.appendChild(table);
                    table.id = 'existUserTable';
                    table.className = 'table';
                    let tr = document.createElement("tr");
                    existUserTable.appendChild(tr);
                    let td = document.createElement("td");
                    td.innerText = data.data.data.name;
                    tr.appendChild(td);
                    td = document.createElement("td");
                    td.innerText = data.data.data.email;
                    tr.appendChild(td);
                    td = document.createElement("td");
                    td.innerText = data.data.data.ter_address;
                    tr.appendChild(td);
                }
            })
            .catch((err) => {

            })
    }
};
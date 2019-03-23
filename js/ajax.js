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

    if (document.getElementById('regions_div')) {
        document.getElementById('regions_div').remove();
    }
    if (document.getElementById('district_div')) {
        document.getElementById('district_div').remove();
    }

    axios.post('territory.php', {territory_id: territory_id.value})
        .then((data) => {
                let regions_div = document.createElement('div');
                regions_div.id = 'regions_div';
                // regions_div.className = 'form-group';
                let regions_select = regions_div.appendChild(document.createElement('select'));
                regions_select.name = 'regions';

                // regions_select.className = 'chosen-select';
                let options = document.createElement('option');
                options.value = '';
                regions_select.appendChild(options);

                for (let region of data.data.regions) {
                    let options = document.createElement('option');
                    options.value = region.ter_id;
                    options.innerHTML = region.ter_name;
                    regions_select.appendChild(options);
                }

                selects.appendChild(regions_div);

                regions_select.onchange = () => {
                    resetError(elements.regions.parentNode);

                    if (document.getElementById('district_div')) {
                        document.getElementById('district_div').remove();
                    }

                    axios.post('territory.php', {region_id: regions_select.value})
                        .then((data) => {
                            let district_div = document.createElement('div');
                            district_div.id = 'district_div';
                            // regions_div.className = 'form-group';
                            let district_select = district_div.appendChild(document.createElement('select'));
                            // regions_select.className = 'chosen-select';
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
    if (elements.regions) {
        resetError(elements.regions.parentNode)

    }
    if (elements.districts) {
        resetError(elements.districts.parentNode);

    }

    // CHECK ERRORS
    if (name.value.length < 1) {
        showError(elements.name.parentNode, ' Укажите ФИО.');
        error = true;
    }

    if (email.value.length < 1) {
        showError(elements.email.parentNode, ' Укажите email.');
        error = true;
    }

    if (!elements.territory.value) {
        showError(elements.territory.parentNode, ' Укажите откуда вы.');
        error = true;
    }

    if (typeof regions_div !== 'undefined') {
        if (!elements.regions.value) {
            return showError(elements.regions.parentNode, ' Укажите откуда вы REGIONS.');
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
    } else if (typeof elements.regions !== 'undefined' && elements.regions.value) {
        ter_id = elements.regions.value
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
                    console.log(data.data);
                }
            })
            .catch((err) => {

            })
    }
};
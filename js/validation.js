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

function validate(form) {

    var elems = form.elements;
    resetError(elems.name.parentNode);
    if (!elems.name.value) {
        showError(elems.name.parentNode, ' Укажите ФИО.');
    }

    resetError(elems.email.parentNode);
    if (!elems.email.value) {
        showError(elems.email.parentNode, ' Укажите email.');
    }

    resetError(elems.territory_id.parentNode);
    if (!elems.territory_id.value) {
        showError(elems.territory_id.parentNode, ' Укажите откуда вы.');
    }
}
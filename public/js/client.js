let buttons = document.querySelectorAll('button');
let form = document.getElementById('form-ajouter');
let inputNom = document.getElementById('input-nom');
let inputPrenom = document.getElementById('input-prenom');
let inputCourriel = document.getElementById('input-courriel');
let inputMotPasse = document.getElementById('input-mot_passe');
let inputMotPasseConfirm = document.getElementById('input-mot_passe_confirm');

let erreurNom = document.getElementById('erreur-nom');
let erreurPrenom = document.getElementById('erreur-prenom');
let erreurCourriel = document.getElementById('erreur-courriel');
let erreurMotPasse = document.getElementById('erreur-password');
let erreurMotPasseConfirm = document.getElementById('erreur-password-confirm');
let container = document.querySelector('.container');

const addClientServer = async (event) => {
	event.preventDefault();
	if (!form.checkValidity()) {
		showAlert('Vous devez remplir tous les champs!');

		return;
	}
	let data = {
		nom: inputNom.value,
		prenom: inputPrenom.value,
		courriel: inputCourriel.value,
		mot_passe: inputMotPasse.value,
		mot_passe_confirm: inputMotPasseConfirm.value,
	};
	let response = await fetch('/inscription', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});

	if (response.ok) {
		window.location.replace('/');
		localStorage.setItem('showNotification', 'Votre compte a été crée avec succès!');
	} else if (response.status === 409) {
		console.log('SQLITE_CONSTRAINT');
	}else if (response.status === 400) {
		erreurCourriel.innerText = 'Ce courriel est déjà pris';
		erreurCourriel.classList.remove('hidden');
		showAlert('Ce courriel est déjà pris')
    }
};
const checkNotification = () => {
    const message = localStorage.getItem('showNotification');
    if (message) {
        localStorage.removeItem('showNotification');
        showAlert(message);
    }
};

const showAlert = (message) => {
    let popupAlert = document.getElementById('alerte');
    let notification = document.querySelector('.alert_container');
    notification.style.display = 'flex';
    popupAlert.innerText = message;

    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
};


checkNotification();


const validateNom = () => {
	if (inputNom.validity.valid) {
		erreurNom.classList.add('hidden');
	} else {
		erreurNom.innerText = 'Le nom est requis.';
		erreurNom.classList.remove('hidden');
	}
};


const validatePrenom = () => {
	if (inputPrenom.validity.valid) {
		erreurPrenom.classList.add('hidden');
	} else {
		erreurPrenom.innerText = 'Le prénom est requis.';
		erreurPrenom.classList.remove('hidden');
	}
};


const validateCourriel = () => {
	if (inputCourriel.validity.valid) {
		erreurCourriel.classList.add('hidden');
	} else {
		erreurCourriel.innerText = 'Le courriel est requis.';
		erreurCourriel.classList.remove('hidden');
	}
};


const validateMotPasse = () => {
	if (inputMotPasse.validity.valid) {
		erreurMotPasse.classList.add('hidden');
	} else {
		erreurMotPasse.innerText = 'Le mot de passe est requis.';
		erreurMotPasse.classList.remove('hidden');
	}
};

const validateMotPasseConfirm = () => {
	if (inputMotPasse.value === inputMotPasseConfirm.value) {
		erreurMotPasseConfirm.classList.add('hidden');
	} else {
		erreurMotPasseConfirm.innerText = 'Les deux mots de passe doivent être identique.';
		erreurMotPasseConfirm.classList.remove('hidden');
	}
};

// Ajoute la validation à la soumission du formulaire
if (form) {
	form.addEventListener('submit', validateNom);
	form.addEventListener('submit', validatePrenom);
	form.addEventListener('submit', validateCourriel);
	form.addEventListener('submit', validateMotPasse);
	form.addEventListener('submit', validateMotPasseConfirm);

	// Ajoute l'ajout du cours à la soumission du formulaire
	form.addEventListener('submit', addClientServer);
}



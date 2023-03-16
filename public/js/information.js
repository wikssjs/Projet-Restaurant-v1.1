let formAuth = document.getElementById('form_infos');
let inpuAdresseUtilisateur = document.getElementById('Adresse');
let inputTelephone = document.getElementById('Téléphone');
let inputPostalCodeUtilisateur = document.getElementById('postalCode');
let inputAppartementUtilisateur = document.getElementById('Appartement');
let Pays = document.getElementById('Pays');
let ville = document.getElementById('ville');


let erreurAdresse = document.getElementById('erreurAdresse');
let erreurPostalCode = document.getElementById('erreurPostalCode');
let erreurTelephone = document.getElementById('erreurTelephone');

console.log(formAuth);
const validateAdresseUtilisateur = () => {
	if (inpuAdresseUtilisateur.validity.valid) {
		erreurAdresse.classList.add('hidden');
	} else {
		erreurAdresse.innerText = 'Le champ adresse est requis.';
		erreurAdresse.classList.remove('hidden');
	}
};
const validateCodePostalUtilisateur = () => {
	if (inputPostalCodeUtilisateur.validity.valid) {
		erreurPostalCode.classList.add('hidden');
	} else {
		erreurPostalCode.innerText = 'Le champ code postal est requis.';
		erreurPostalCode.classList.remove('hidden');
	}
};

formAuth.addEventListener('submit', validateAdresseUtilisateur);
formAuth.addEventListener('submit', validateCodePostalUtilisateur);

const validateTelephoneUtilisateur = () => {
	if (inputTelephone.validity.valid) {
		erreurTelephone.classList.add('hidden');
	} else {
		erreurTelephone.innerText = 'Le champ téléphone est requis.';
		erreurTelephone.classList.remove('hidden');
	}
};

formAuth.addEventListener('submit', validateTelephoneUtilisateur);

formAuth.addEventListener('submit', async (event) => {
	event.preventDefault();
	if (!formAuth.checkValidity()) {
		return;
	}

	let data = {
		adresse: inpuAdresseUtilisateur.value,
		telephone: inputTelephone.value,
        code_postal: inputPostalCodeUtilisateur.value,
        appatement: inputAppartementUtilisateur.value,
        pays: Pays.value,
        ville: ville.value,

	};

	let response = await fetch('/information', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});

	if (response.ok) {
		window.location.replace('/informations/livraison');
	} 
	else if (response.status === 401) {
		erreurTelephone.innerText = "Le champ téléphone est requis.";
		erreurTelephone.classList.remove('hidden');
	} 
	else if (response.status === 409) {
		erreurAdresse.innerText = 'Le email est inconnu.';
		erreurAdresse.classList.remove('hidden');
	} else {
		console.log('Autre erreur');
	}
});

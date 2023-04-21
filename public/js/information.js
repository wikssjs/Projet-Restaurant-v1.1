let formAuth = document.getElementById('form_infos');
let inpuAdresseUtilisateur = document.getElementById('Adresse');
let inputTelephone = document.getElementById('Téléphone');
let instructions_speciales = document.getElementById('instructions_speciales');
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
		showAlert('Vous devez fournir une adresse dans le champ indiqué!');

	}
};
const validateCodePostalUtilisateur = () => {
	if (inputPostalCodeUtilisateur.validity.valid) {
		erreurPostalCode.classList.add('hidden');
	} else {
		erreurPostalCode.innerText = 'Le champ code postal est requis.';
		erreurPostalCode.classList.remove('hidden');
		showAlert('Vous devez fournir votre code postal dans le champ indiqué!');
		
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
		showAlert('Vous devez fournir un numéro sur lequel VeraPasta pourra communiquer avec vous!');

	}
};

formAuth.addEventListener('submit', validateTelephoneUtilisateur);

formAuth.addEventListener('submit', async (event) => {
	event.preventDefault();
	if (!formAuth.checkValidity()) {
		showAlert('Vous devez remplir tous les champs indiqués!');
		return;
	}

	let data = {
		adresse: inpuAdresseUtilisateur.value,
		telephone: inputTelephone.value,
		instructions_speciales: instructions_speciales.value,
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
	
});
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
let formPaiement = document.getElementById('form_paiement');
let inpuNumero_carte = document.getElementById('numero-carte');
let inputNom_carte = document.getElementById('nom_carte');
let inputDate_expire = document.getElementById('date_expire');
let inputCode_securit = document.getElementById('input_code_securit');
let infos_client = document.getElementById('infos_client');
let email_Client = document.getElementById('email_Client');
let somme_article = document.getElementById('somme_article');




let erreur_numero_carte = document.getElementById('erreur_numero_carte');
let erreur_nom_carte = document.getElementById('erreur_nom_carte');
let erreur_date_expire = document.getElementById('erreur_date_expire');
let erreur_input_code_securit = document.getElementById('erreur_input_code_securit');

console.log(formPaiement);
const validateNumero_carte = () => {
	if (inpuNumero_carte.validity.valid) {
		erreur_numero_carte.classList.add('hidden');
	} else {
		erreur_numero_carte.innerText = 'Le champ numero de la carte est requis.';
		erreur_numero_carte.classList.remove('hidden');
	}
};
const validateNom_carte = () => {
	if (inpuNumero_carte.validity.valid) {
		erreur_nom_carte.classList.add('hidden');
	} else {
		erreur_nom_carte.innerText = 'Le champ nom du titulaire est requis.';
		erreur_nom_carte.classList.remove('hidden');
	}
};
const validateDate_expire = () => {
	if (inputDate_expire.validity.valid) {
		erreur_date_expire.classList.add('hidden');
	} else {
		erreur_date_expire.innerText = "Le champ date d'expiration est requis.";
		erreur_date_expire.classList.remove('hidden');
	}
};

formPaiement.addEventListener('submit', validateNumero_carte);
formPaiement.addEventListener('submit', validateDate_expire);
formPaiement.addEventListener('submit', validateNom_carte);

const validateTelephoneUtilisateur = () => {
	if (inputNom_carte.validity.valid) {
		erreur_input_code_securit.classList.add('hidden');
	} else {
		erreur_input_code_securit.innerText = 'Le champ code de sécurité est requis.';
		erreur_input_code_securit.classList.remove('hidden');
	}
};

formPaiement.addEventListener('submit', validateTelephoneUtilisateur);

formPaiement.addEventListener('submit', async (event) => {
	event.preventDefault();
	if (!formPaiement.checkValidity()) {
		return;
	}

	let data = {
		numero_carte: Number(inpuNumero_carte.value),
		nom_titulaire_cart: inputNom_carte.value,
        date_expiration: inputDate_expire.value,
        code_securite: inputCode_securit.value,
        adresse_livraison: infos_client.textContent,
		email_Client: email_Client.textContent,
		somme_article: Number(somme_article.textContent.substring(0, somme_article.textContent.length-2)),

	};

	let response = await fetch('/paiement', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});

	if (response.ok) {
		window.location.replace('/paiement/valider');
	}else {
		console.log('Autre erreur');
	}
});

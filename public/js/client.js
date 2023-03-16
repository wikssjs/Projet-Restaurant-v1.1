// Variables représentant les éléments de la page HTML
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

	// Tester si toutes les données entrées sont valide
	if (!form.checkValidity()) {
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

	if (response.ok && inputMotPasse.value === inputMotPasseConfirm.value) {
		window.location.replace('/');
	} else if (response.status === 409) {
		erreurCourriel.innerText = 'Ce courriel est déjà pris';
		erreurCourriel.classList.remove('hidden');
	}
};


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

/**
 * Supprime un cours sur le serveur.
 * @param {Event} event Objet d'information de l'événement.
 */
const removeUtilisateurServeur = async (event) => {
	let button = event.currentTarget;
	console.log(event.currentTarget.dataset.idCours);
	let data = {
		id_utilisateur: Number(button.dataset.idCours),
	};

	let response = await fetch('/users/delete', {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});

	if (response.ok) {
		// On supprime le <li> si la suppression fonctionne sur le serveur
		button.parentNode.remove();
	}
};

// Ajoute la suppression du cours au clic de tous les boutons dans la liste
// de cours
for (let button of buttons) {
	button.addEventListener('click', removeUtilisateurServeur);
}

// const addUserClient = (nom_user, prenom, courriel) => {
// 	let liste = document.createElement('div');
// 	liste.classList.add('listUsers');
// 	let infos = document.createElement('div');
// 	infos.classList.add('infos');
// 	let button = document.createElement('button');
// 	button.classList.add('inscrir');
// 	button.innerText = 'Supprimer';
// 	let nom = document.createElement('div');
// 	nom.classList.add('nom-user');
// 	nom.innerText = 'Nom : ' + nom_user;
// 	let prenom_user = document.createElement('div');
// 	prenom_user.classList.add('prenom-user');
// 	prenom_user.innerText = 'Prénom : ' + prenom;
// 	let courriel_user = document.createElement('div');
// 	courriel_user.classList.add('courriel-user');
// 	courriel_user.innerText = 'Courriel : ' + courriel;
// 	let type_user = document.createElement('div');
// 	type_user.classList.add('type-user');
// 	type_user.innerText = 'Type : regulier';
// 	let inscription = document.createElement('div');
// 	inscription.classList.add('inscription-user');
// 	inscription.innerText = "Nombre d'inscription : 0";
// 	let cours_user = document.createElement('div');
// 	cours_user.classList.add('cours-user');
// 	cours_user.innerText = 'Cours : ';
// 	infos.append(nom);
// 	infos.append(prenom_user);
// 	infos.append(courriel_user);
// 	infos.append(type_user);
// 	infos.append(inscription);
// 	infos.append(cours_user);
// 	liste.append(infos);
// 	liste.append(button);
// 	container.append(liste);
// };

// let source = new EventSource('/stream');
// addUserClient("data.nom", "data.prenom", "data.courriel");
// source.addEventListener('add-utilisateur', (event) => {
// 	let data = JSON.parse(event.data);
// 	addUserClient(data.nom, data.prenom, data.courriel);
// });

// source.addEventListener('delete-utilisateur', (event) => {
// 	let data = JSON.parse(event.data);
// 	let utilisateur = document.querySelector('.user' + data.id);
// 	console.log(utilisateur, data.id);
// 	utilisateur.remove();
// });

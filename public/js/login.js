let formAuth = document.getElementById('form-auth');
let inpuCourrielUtilisateur = document.getElementById('input-courriel-utilisateur');
let inputMotDePasseUtilisateur = document.getElementById('input-mot-de-passe');
let erreurCourriel = document.getElementById('erreur-courriel');
let erreurMotDePasse = document.getElementById('erreur-Mot-de-passe');


const validateCourrielUtilisateur = () => {
	if (inpuCourrielUtilisateur.validity.valid) {
		erreurCourriel.classList.add('hidden');
	} else {
		erreurCourriel.innerText = 'Le courriel est invalide.';
		erreurCourriel.classList.remove('hidden');
	}
};

formAuth.addEventListener('submit', validateCourrielUtilisateur);

const validateMotPasseUtilisateur = () => {
	if (inputMotDePasseUtilisateur.validity.valid) {
		erreurMotDePasse.classList.add('hidden');
	} else {
		erreurMotDePasse.innerText = 'Le mot de passe est invalide.';
		erreurMotDePasse.classList.remove('hidden');
	}
};

formAuth.addEventListener('submit', validateMotPasseUtilisateur);

formAuth.addEventListener('submit', async (event) => {
	event.preventDefault();
	if (!formAuth.checkValidity()) {
		return;
	}

	let data = {
		emailClient: inpuCourrielUtilisateur.value,
		motDePasseClient: inputMotDePasseUtilisateur.value,
	};

	let response = await fetch('/', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});

	if (response.ok) {
		window.location.replace('/home');
	} 
	else if (response.status === 401) {
		erreurMotDePasse.innerText = "Le mot de passe n'est pas correcte.";
		erreurMotDePasse.classList.remove('hidden');
		// window.location.replace('/');

	} 
	else if (response.status === 409) {
		erreurCourriel.innerText = 'Le email est inconnu.';
		erreurCourriel.classList.remove('hidden');
	} else {
		console.log('Autre erreur');
	}
});

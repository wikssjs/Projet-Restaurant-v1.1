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
		localStorage.setItem('showNotification', 'Bienvenu à VeraPasta!');
	} 
	else if (response.status === 401) {
		// erreurCourriel.innerText = "Votre email n'est pas correcte.";
		// erreurCourriel.classList.remove('hidden');
		showAlert("L'email ou le mot de passe n'est pas correcte. Veillez ressayer");

	} 
	else if (response.status === 400) {
		erreurMotDePasse.innerText = "Votre mot de passe n'est pas correcte.";
		erreurMotDePasse.classList.remove('hidden');
		showAlert("Votre mot de passe n'est pas correcte. Veillez ressayer");

	} 

	else {
		console.log('Autre erreur');
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
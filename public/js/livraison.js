let formAuth = document.getElementById('form_liv');
let adresse = document.getElementById('adresse-liv');
let email = document.getElementById('email-liv');

formAuth.addEventListener('submit', async (event) => {
	event.preventDefault();
	if (!formAuth.checkValidity()) {
		return;
	}

	let data = {
		adresse: adresse.value,
		telephone: email.value,
	};

	let response = await fetch('/livraison', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});

	if (response.ok) {
		window.location.replace('/informations/livraison/paiement');
	} 
	
});

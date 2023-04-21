const panier=document.getElementById('quantite');
const btnAjouterAuxPanier=document.querySelectorAll('.svg-icon');
const btnSupprimers=document.querySelectorAll('.btnSupprimer');
const btnQuantePlus=document.querySelectorAll('.quantitePlus');
const btnQuanteMoin = document.querySelectorAll('.quantiteMoin');
const Payer= document.querySelector('.Payer')

const addPlatPanier = async (event) => {
    let data = {
        id_menu: Number(event.currentTarget.dataset.idplat),
    };
    console.log(event.currentTarget.dataset);
    let response = await fetch('/ajout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (response.ok) {
		localStorage.setItem('showNotification', 'Ajout fait avec succes!'); // Stocke l'information de la notification dans le stockage local
        window.location.reload(); // Recharge la page
    } else if (response.status === 401) {
        window.location.replace('/');
		showAlert("Vous devez vous connecter d'abord!")
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


const removeMenuPanier = async (event) => {
	let btnSupprimers=event.currentTarget;
	let data = {
		id_menu: Number(btnSupprimers.dataset.idplat),
	};
	console.log(btnSupprimers);
	let response = await fetch('/supp', {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});

	if (response.ok) {
		localStorage.setItem('showNotification', 'Le plat a été retiré avec succès!');
		window.location.reload();
	}
};

const quantitePlus = async(event) => {
    let data = {
        id_menu: event.currentTarget.dataset.id_menu
    }
	console.log(event.currentTarget.dataset);
    let response = await fetch('/quantitePlus', {
        method: 'PATCH',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    });
	if (response.ok) {
		window.location.reload();
	}
}
const quantiteMoin = async(event) => {
    let data = {
        id_menu: event.currentTarget.dataset.id_menu
    }
    let response = await fetch('/quantiteMoin', {
        method: 'PATCH',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    });
	if (response.ok) {
		window.location.reload();
	}
}

for (let button of btnQuantePlus) {
	button.addEventListener('click', quantitePlus);
}
for (let button of btnQuanteMoin) {
	button.addEventListener('click', quantiteMoin);
}
for (let button of btnAjouterAuxPanier) {
	button.addEventListener('click', addPlatPanier);
}
if (Payer) {
	Payer.addEventListener('click', addPlatPanier);
}
for (let button of btnSupprimers) {
	button.addEventListener('click', removeMenuPanier);
}


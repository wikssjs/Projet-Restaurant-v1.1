const panier=document.getElementById('quantite');
const btnAjouterAuxPanier=document.querySelectorAll('.card-button');
const btnSupprimers=document.querySelectorAll('.btnSupprimer');
const btnQuantePlus=document.querySelectorAll('.quantitePlus');
const btnQuanteMoin = document.querySelectorAll('.quantiteMoin');
const Payer= document.querySelector('.Payer')
let valeur=Number(panier.textContent);
// panier.textContent=(await getPlatsParClients).length
const tabPanier=[];
// console.log(Payer);


const addPlatPanier= async (event) => {
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
		window.location.reload();
	}else if (response.status === 401) {
		window.location.replace('/')
	}
};

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

// if (btnAjouterAuxPanier) {
//     btnAjouterAuxPanier.forEach(btn => {
//         btn.addEventListener('click', (event)=>{
           
//             valeur++;
//             panier.textContent=valeur;
//         })
//     })
    
// }

// if (btnAjouterAuxPanier) {
//     btnAjouterAuxPanier.forEach(btn => {
//         btn.addEventListener('click', (event)=>{
//             valeur++;
//             panier.textContent=valeur;
//         })
//     })
    
// }
// if (ajouterAuxPanier2) {
//     ajouterAuxPanier2.forEach(btn => {
//         btn.addEventListener('click', ()=>{
//             valeur++;
//             panier.textContent=valeur;
//             Payer.textContent=valeur;
//         })
//     })
    
// }
// if (retirerDuPanier) {
//     retirerDuPanier.forEach(btn => {
//         btn.addEventListener('click', ()=>{
//             valeur--;
//             panier.textContent=valeur;
//             Payer.textContent=valeur;
//         })
//     })
    
// }

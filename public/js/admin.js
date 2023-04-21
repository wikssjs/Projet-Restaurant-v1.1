let btn_supprimer=document.querySelectorAll('.btn_supprimer');

let id_plan;
const plat_idPlat_j= document.getElementById('plat_idPlat_j');
const plat_nom_j= document.getElementById('plat_nom_j');
const nom_plat= document.getElementById('nom_plat');
const plat_prix_j= document.getElementById('plat_prix_j');
const plat_img_j= document.getElementById('plat_img_j');
const plat_description_j= document.getElementById('plat_description_j');
// const plat_date_j= document.getElementById('plat_date_j');
const erreur_prix_j= document.getElementById('erreur_prix_j');
const plat_j_submit= document.getElementById('plat_j_submit');



const nom_a= document.getElementById('nom_a');
const image_url_a= document.getElementById('image_url_a');
const description_a= document.getElementById('description_a');
const prix_a= document.getElementById('prix_a');
const erreur_prix_a= document.getElementById('erreur_prix_a');
const form_ajouter_menu= document.getElementById('form_ajouter_menu');

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

// Vérifie si une notification doit être affichée après le rechargement de la page
checkNotification();

const ajoueterMenu = async (event) => {
	event.preventDefault();
	if (!form_ajouter_menu.checkValidity()) {
		showAlert("Veillez remplir tous les champs!");
		return;
	}
	if (!(Number(prix_a.value))){
		showAlert("Le prix n'est pas valide!.")
		return;
	}
	let categori_id= document.getElementById('select1')
	let data = {
		nom: nom_a.value,
		image_url: image_url_a.files[0].name,
		description: description_a.value,
		prix: Number(prix_a.value),
		id_categorie_menu: Number(categori_id.value)
	};

	let response = await fetch('/ajouterUnPlat', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});

	if (response.ok) {
		localStorage.setItem('showNotification', 'Le menu a été ajouter avec succès!');
		window.location.reload();
	}
};

const ajoutIngredForm= document.getElementById('ajoutIngredForm');
const ingred_submit= document.getElementById('ingred_submit');
const Ingred_idPlat= document.getElementById('Ingred_idPlat');
const nom_ingred= document.getElementById('nom_ingred');
const ingred_nom= document.getElementById('ingred_nom');
const Ingred_description= document.getElementById('Ingred_description');

const ajoueterIngredient = async (event) => {
	event.preventDefault();
	if (!ajoutIngredForm.checkValidity()) {
		showAlert("Veillez remplir au moins le champ nom!");
		return;
	}

	let data = {
		nom: ingred_nom.value,
		description: Ingred_description.value,
		id_menu: Number(Ingred_idPlat.value),
	};

	let response = await fetch('/ajouerIngredient', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});

	if (response.ok) {
		localStorage.setItem('showNotification', "L'ingrédient a été ajouter du panier avec succès!");
		window.location.reload();
	}
};

if (ingred_submit) {
	ingred_submit.addEventListener('click',ajoueterIngredient);
}
const validatePrix = () => {

	if (prix_a.validity.valid) {
		erreur_prix_a.classList.remove('hidden');		
	} else if (!(Number(prix_a.value))) {
		erreur_prix_a.classList.add('hidden');
		erreur_prix_a.innerText = "Le prix n'est pas valide!.";
		showAlert("Le prix n'est pas valide!.")
	}
};

if (form_ajouter_menu) {
	form_ajouter_menu.addEventListener('submit', validatePrix);
	form_ajouter_menu.addEventListener('submit', ajoueterMenu);
}
const removeMenu = async (event) => {
	if (confirm("Voulez-vous continuer?")) {
		let btnSupprimers=event.currentTarget;
		let data = {
			id_menu: Number(btnSupprimers.dataset.idplat),
		};
		
		console.log(btnSupprimers);
		let response = await fetch('/supprimerUnPlat', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});
	
		if (response.ok) {
			localStorage.setItem('showNotification', 'Le menu a été supprimer de la base de donnée avec succès!');
			window.location.reload();
		}
		
	}
};
let btn_supp_utilisateurs = document.querySelectorAll('.btn_supp_utilisateur')
const removeUtilisateur = async (event) => {
	if (confirm("Voulez-vous continuer?")) {
		let btnSupprimers=event.currentTarget;
		let data = {
			id_utilisateur: Number(btnSupprimers.dataset.idclient),
		};
		
		let response = await fetch('/supprimerUtilisateur', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});
	
		if (response.ok) {
			localStorage.setItem('showNotification', "L'utilisateur a été supprimer de la base de donnée avec succès!");
			window.location.reload();
		}
		
	}
};

if (btn_supp_utilisateurs) {
	btn_supp_utilisateurs.forEach(btn => {
		btn.addEventListener('click', (e)=>{
			removeUtilisateur(e);		
		})
	});
}
btn_supprimer.forEach(btn => {
	btn.addEventListener('click', (e)=>{
		removeMenu(e);		
	})
	
});

let form_update= document.getElementById('form_update');
let bouton_close= document.getElementById('bouton_close');
let btn_modifier = document.querySelectorAll('.btn_modifier');

let form_ingred= document.getElementById('form_ingred');
let bouton_close_ingred= document.getElementById('bouton_close_ingred');
let btn_ajout_ing = document.querySelectorAll('.btn_ajout_ing');


const remplirFormulaireDeModification=(e)=>{
	let plat_id =document.getElementById('plat_id'+e.currentTarget.dataset.idplat);
	let plat_nom =document.getElementById('plat_nom'+e.currentTarget.dataset.idplat);
	let plat_prix =document.getElementById('plat_prix'+e.currentTarget.dataset.idplat);
	// let plat_img_url =document.getElementById('plat_img_url'+e.currentTarget.dataset.idplat);
	let plat_description =document.getElementById('plat_description'+e.currentTarget.dataset.idplat);
	let plat_date =document.getElementById('plat_date'+e.currentTarget.dataset.idplat);

	id_plan=Number(plat_id.textContent);
	plat_idPlat_j.value= plat_id.textContent;
	plat_nom_j.value= plat_nom.textContent;
	nom_plat.innerText= plat_nom.textContent;
	plat_prix_j.value= plat_prix.textContent.substring(0,plat_prix.textContent.length-1);
	// plat_img_j.value= plat_img_url.textContent;
	// plat_img_j.value= plat_img_url.textContent.substring(13);
	plat_description_j.textContent= plat_description.textContent;

}
const remplirFormulaireIngredient=(e)=>{
	let plat_id =document.getElementById('plat_id'+e.currentTarget.dataset.idplat);
	let plat_nom =document.getElementById('plat_nom'+e.currentTarget.dataset.idplat);

	id_plan=Number(plat_id.textContent);
	Ingred_idPlat.value= plat_id.textContent;
	nom_ingred.innerText= plat_nom.textContent;
}

const modifierPlat = async () => {
	if (!Number(plat_prix_j.value.trim())) {
		erreur_prix_j.classList.add('hidden');
		erreur_prix_j.innerText='Le prix doit être un nombre réel!'
		showAlert("Le prix doit être un nombre réel!");
		return;
	}
	if (plat_nom_j.value=='' || plat_img_j.value=='' || plat_description_j.value=='') {
		showAlert("Veillez remplir tous les champs!");
		return;
	}
	let categori_id= document.getElementById('select2')
	let data = {
		id_menu: id_plan,
		nom: plat_nom_j.value,
		prix: Number(plat_prix_j.value.trim()),
		img_name: plat_img_j.files[0].name,
		description: plat_description_j.value,
		id_categorie_menu: Number(categori_id.value)
	};
	let response = await fetch('/updatePlat', {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});

	if (response.ok) {
		localStorage.setItem('showNotification', "Le plat a été modifier avec succès!");
		window.location.reload();
	}
};

if (btn_modifier) {
	btn_modifier.forEach(btn => {
		btn.addEventListener('click', (e)=>{
			form_update.style.display='flex';
			remplirFormulaireDeModification(e);
		})
	});
}
if (plat_j_submit) {
	plat_j_submit.addEventListener('click', modifierPlat);
}

if (bouton_close) {
	bouton_close.addEventListener('click', ()=>{
		form_update.style.display='none';
	})
}

if (btn_ajout_ing) {
	btn_ajout_ing.forEach(btn => {
		btn.addEventListener('click', (e)=>{
			form_ingred.style.display='flex';
			remplirFormulaireIngredient(e);
		})
	});
}
// plat_j_submit.addEventListener('click', modifierPlat);

if (bouton_close_ingred) {
	bouton_close_ingred.addEventListener('click', ()=>{
		form_ingred.style.display='none';
	})
}
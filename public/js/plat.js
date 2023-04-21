
let form_note= document.getElementById('form_note');
let Note= document.getElementById('Note');
let erreur_note= document.getElementById('erreur_note');


let form_commentaire= document.getElementById('form_commentaire');
let inputNomCommantataire= document.getElementById('nomCommantataire');
let erreur_nom_commentataire= document.getElementById('erreur_nom_commentataire');
let icon_bas_comment = document.querySelector('.icon_bas_comment');


let inputEmailCommantataire= document.getElementById('emailCommantataire');
let erreur_email_commentataire= document.getElementById('erreur_email_commentataire');

let commentaireClient= document.getElementById('commentaireClient');
let erreur_commentaire= document.getElementById('erreur_commentaire');




let btnform = document.querySelector('.commentaire')
let commentaireForm = document.querySelector('.modePaye form')
let btnFormNote = document.querySelector('.Note_client')
// let btnIngredient = document.querySelector('.titleIngh3');
// let listIngre = document.querySelector('.listIngre');
// let basFlech = document.querySelector('.basFlech');
let contenu_form_note = document.querySelector('.contenu_form_note')
let bas = document.querySelector('.bas');




const validateNom = () => {
	if (inputNomCommantataire.validity.valid) {
		erreur_nom_commentataire.classList.add('hidden');
	} else {
		erreur_nom_commentataire.innerText = 'Le nom est requis.';
		erreur_nom_commentataire.classList.remove('hidden');
	}
};


const validateEmail = () => {
	if (inputEmailCommantataire.validity.valid) {
		erreur_email_commentataire.classList.add('hidden');
	} else {
		erreur_email_commentataire.innerText = 'Le courriel est requis.';
		erreur_email_commentataire.classList.remove('hidden');
	}
};


const validateCommentaire = () => {
	if (commentaireClient.validity.valid) {
		erreur_commentaire.classList.add('hidden');
	} else {
		erreur_commentaire.innerText = 'Le champ commentaire est requis.';
		erreur_commentaire.classList.remove('hidden');
	}
};

const validateNote = () => {
	if (Note.validity.valid) {
		erreur_note.classList.add('hidden');
	}else if (Note.value>6 || Note.value< 1) {
        erreur_note.innerText = 'Le champ note est requis et la note doit être entre 1 et 5.';
		erreur_note.classList.remove('hidden');
    }
};



if (btnform) {
    btnform.addEventListener('click', ()=>{
        commentaireForm.classList.toggle('activeForm');
        if (commentaireForm.classList.contains('activeForm')) {
            icon_bas_comment.style.transform='rotate(180deg)';
            icon_bas_comment.style.transition='all 0.4s';
        }else{
            icon_bas_comment.style.transform='rotate(360deg)';
            icon_bas_comment.style.transition='all 0.4s';


        }
    })
}
if (btnFormNote) {
    btnFormNote.addEventListener('click', ()=>{
        contenu_form_note.classList.toggle('activeFormNote')
        contenu_form_note.style.transition='all 0.4s';
        if (contenu_form_note.classList.contains('activeFormNote')) {
            bas.style.transform='rotate(180deg)';
            bas.style.transition='all 0.4s';
        }else{
            bas.style.transform='rotate(360deg)';
            bas.style.transition='all 0.4s';
        }
    })
}
// if (btnIngredient) {
//     btnIngredient.addEventListener('click', ()=>{
//         listIngre.classList.toggle('activeIngredient')
//         listIngre.style.transition='all 0.4s';
//         if (listIngre.classList.contains('activeFormNote')) {
//             basFlech.style.transform='rotate(180deg)';
//             basFlech.style.transition='all 0.4s';
//         }else{
//             basFlech.style.transform='rotate(360deg)';
//             basFlech.style.transition='all 0.4s';
//         }
//     })
// }

const addCommentaire = async(event) => {
    event.preventDefault();

	if (!form_commentaire.checkValidity()) {
		return;
	}

    let data = {
        id_menu: event.currentTarget.dataset.idmenu,
        commentaire: commentaireClient.value,
        nom_utilisateur: inputNomCommantataire.value,
        email: inputEmailCommantataire.value,

    }

    let response = await fetch('/commentaire', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    });
	if (response.ok) {
		window.location.reload();
        localStorage.setItem('showNotification', 'Merci pour votre commentaire!');
	}
}


const addNote = async(event) => {
    event.preventDefault();
	if (!form_note.checkValidity()) {
		return;
	}
    let data = {
        id_menu: event.currentTarget.dataset.idmenu,
        nb_etoiles: Note.value,
    }
    console.log(event.currentTarget.dataset);
    let response = await fetch('/ajoute-note', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    });
	if (response.ok) {
		window.location.reload();
        localStorage.setItem('showNotification', 'Merci!');
	}
}


if (form_commentaire) {
	form_commentaire.addEventListener('submit', validateNom);
	form_commentaire.addEventListener('submit', validateEmail);
	form_commentaire.addEventListener('submit', validateCommentaire);
	form_commentaire.addEventListener('submit', addCommentaire);
}
if (form_note) {
    form_note.addEventListener('submit', validateNote);
	form_note.addEventListener('submit', addNote);
}


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
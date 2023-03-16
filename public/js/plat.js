
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
        // transform: rotate(180deg);
    })
}

const addCommentaire = async(event) => {
    event.preventDefault();

	if (!form_commentaire.checkValidity()) {
		return;
	}

    let data = {
        id_menu: event.currentTarget.dataset.idmenu,
        commentaire: commentaireClient.value,
        nom_commentataire: inputNomCommantataire.value,
        email: inputEmailCommantataire.value,

    }

    let response = await fetch('/commentaire', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    });
	if (response.ok) {
		window.location.reload();
	}
}


const addNote = async(event) => {
    event.preventDefault();
	if (!form_note.checkValidity()) {
		return;
	}
    let data = {
        id_menu: event.currentTarget.dataset.idmenu,
        note: Note.value,
    }
    console.log(event.currentTarget.dataset);
    let response = await fetch('/ajoute-note', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    });
	if (response.ok) {
		window.location.reload();
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



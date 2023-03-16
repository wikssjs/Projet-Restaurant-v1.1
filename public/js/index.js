let user=document.querySelector('.user');
let menu_user=document.querySelector('.menu_user');


var listFunction = {
	open: () => {
		menu_user.style.display = 'flex';
	},
	close: () => {
		menu_user.style.display = 'none';
	},
};
var setuplistener = () => {
	user.addEventListener('mouseover', listFunction.open);
	menu_user.addEventListener('mouseleave', listFunction.close);
};
setuplistener();

window.addEventListener('scroll', ()=>{
    let nav= document.querySelector('.nav');
    let logo= document.querySelector('.logo');
    
    nav.classList.toggle('toggleNav', window.scrollY>0)
    // logo.classList.toggle('.tailleLogo', window.scrollY>0)
    menu_user.classList.toggle('bacgroun', window.screenY>0);
})

let box = document.querySelector('.box');
let eye = document.querySelector('.eyeFermer');

let limite = document.querySelector('.btnVoirPlus');

let voir= false;
const voirPlusMenus = async (event) => {
    let data = {
        limit: 100,
	};
	
	let response = await fetch('/menusPlus', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});

	if (response.ok) {
		window.location.reload();

	}
};

if (limite) {
    limite.addEventListener('click', voirPlusMenus);
}

let inputSearch= document.getElementById('search');
let ntbChercher= document.getElementById('ntbChercher');
const recherche = async (event) => {
    let data = {
        nom_menu: inputSearch.value,
	};
	
	let response = await fetch('/recherche', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});

	if (response.ok) {
		window.location.reload();
	}
};
if (ntbChercher) {
    ntbChercher.addEventListener('click', recherche);
}
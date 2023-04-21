let user=document.querySelector('.user');
let menu_user=document.querySelector('.menu_user');
let header=document.querySelector('header');
let direction_gauche=document.querySelector('.direction_gauche');
let direction_droite=document.querySelector('.direction_droite');
let index=0;
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
    logo.classList.toggle('.tailleLogo', window.scrollY>0)
	if (window.scrollY>0) {
		logo.style.transform='scale(0.8)';
	}
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

limite.addEventListener('click', voirPlusMenus);

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


const btnChangeDroid=()=>{
	index++;
	if (index>8) {
		index=1;
	}
	header.style.backgroundImage = `url('../images/backgroundImg/${index}.jpg')`;
	header.style.transition = '1.2s';
}
const btnChangeGauche=()=>{
	index--;
	if (index<=0) {
		index=8;
	}
	header.style.backgroundImage = `url('../images/backgroundImg/${index}.jpg')`;
	header.style.transition = '1.2s';
}
direction_droite.addEventListener('click', btnChangeDroid)
direction_gauche.addEventListener('click', btnChangeGauche )
let changBacgroud = () => {
	index = Math.floor(Math.random() * 8 + 1);
	header.style.backgroundImage = `url('../images/backgroundImg/${index}.jpg')`;
	header.style.transition = '1.2s';
};

if (header) {
	setInterval(changBacgroud, 10000);
}

let btn_supprimer=document.querySelectorAll('.btn_supprimer');

const removeMenu = async (event) => {
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
		// btnSupprimers.parentNode.remove();
		window.location.reload();
	}
};
btn_supprimer.forEach(btn => {
    btn.addEventListener('click', removeMenu)
});
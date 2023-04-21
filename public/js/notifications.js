// notifications.js
export const checkNotification = () => {
    const message = localStorage.getItem('showNotification');
    if (message) {
        localStorage.removeItem('showNotification');
        showAlert(message);
    }
};

export const showAlert = (message) => {
    let popupAlert = document.getElementById('alerte');
    let notification = document.querySelector('.alert_container');
    notification.style.display = 'flex';
    popupAlert.innerText = message;

    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
};

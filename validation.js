import {isUtilisateurExist} from'./model/utilisateur.model.js';

/**
 * Retourne une valeur indiquant si le ID en paramètre est valide.
 * @param {*} id Un ID à valider.
 * @returns Une valeur indiquant si le ID en paramètre est valide.
 */
 export const isIDValide = (id) => {
    return typeof id === 'number' && id >= 0;
}

/**
 * Retourne une valeur indiquant si le courriel en paramètre est valide.
 * @param {*} courriel Un courriel à valider.
 * @returns Une valeur indiquant si le courriel en paramètre est valide.
 */
export const isTexteValide = (text) => {
    return typeof text === 'string' && !!text;
}

/**
 * Retourne une valeur indiquant si la date en paramètre est valide.
 * @param {*} date Une date à valider.
 * @returns Une valeur indiquant si la date en paramètre est valide.
 */
export const isDateValide = (date) => {
    return typeof date === 'number' && new Date(date).getTime() > 0;
}

/**
 * Retourne une valeur indiquant si la quantité en paramètre est valide.
 * @param {*} quantite Une quantité à valider.
 * @returns Une valeur indiquant si la quantité en paramètre est valide.
 */
export const isQuantiteValide = (quantite) => {
    return typeof quantite === 'number' && quantite > 0;
}

export const isEmailValide = (email) => {
    return typeof email === 'string' && !!email &&
    email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}
export const isEmailConfirm = async(email) => {
    let emailExist= await isUtilisateurExist(email);
    return typeof email === 'string' && !!email && emailExist.length===0;
}

export const isPasswordValide = (password) => {
    return typeof password === 'string' && !!password;
}
export const isPasswordValided = (password, passwordConfirm) => {
    return typeof password === 'string' && !!password && typeof passwordConfirm === 'string' && !!passwordConfirm &&
    passwordConfirm===password;
}
export const contactValide=(body)=>{
    console.log(body);
    return  isTexteValide(body.nom) &&
            isTexteValide(body.prenom) &&
            isEmailValide(body.courriel) &&
            isEmailConfirm(body.courriel);
}

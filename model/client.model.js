import connectionPromise from './connexion.js';
import pkg from 'bcryptjs';

const { hash } = pkg;

export const addClient = async (nom_client, prenom, password, email) => {
	try {
		let connection = await connectionPromise;
		let motDePasseHash = await hash(password, 10);
		await connection.run(
			`INSERT INTO clients (nom_client, prenom, password, email)
            VALUES (?, ?, ?, ?);`,
			[nom_client, prenom, motDePasseHash, email],
		);
	} catch (error) {
		console.log(error);
	}
};

/**
 * Supprime un utilisateur dans la base de données.
 * @param {number} id_utilisateur Le ID du cours à supprimer.
 */
export const removeUser = async (id_utilisateur) => {
	try {
		let connection = await connectionPromise;

		await connection.run(
			`DELETE FROM utilisateur
            WHERE id_utilisateur = ?`,
			[id_utilisateur],
		);
	} catch (error) {
		console.log(error);
	}
};
export const getUsers = async () => {
	let connection = await connectionPromise;
	let resultat = await connection.all(
		`SELECT 
        u.id_utilisateur,
        u.id_type_utilisateur, 
        u.courriel, 
        u.mot_passe, 
        u.prenom, 
        u.nom,
        tu.type,
        COUNT(cu.id_utilisateur) AS inscriptions,
        c.nom AS nom_cours
    FROM utilisateur u
    LEFT JOIN type_utilisateur tu ON u.id_type_utilisateur = tu.id_type_utilisateur
    LEFT JOIN cours_utilisateur cu ON cu.id_utilisateur = u.id_utilisateur
    LEFT JOIN cours c ON c.id_cours = cu.id_cours
    GROUP BY u.id_utilisateur`,
	);
	return resultat;
};

/**
 *  Affiche les données d'un utilisateur dont le courrirel est passé en parametre.
 * @returns les données de utilisateur.
 */
export const getUserByCourriel = async (courriel) => {
	try {
		let connection = await connectionPromise;

		let results = await connection.get(
			`SELECT 
                u.id_utilisateur,
                u.nom,
                u.prenom,
                u.courriel, 
                u.mot_passe,
                tu.type,
                tu.id_type_utilisateur,
                COUNT(cu.id_utilisateur) AS inscriptions
            FROM utilisateur u
            INNER JOIN type_utilisateur tu ON u.id_type_utilisateur = tu.id_type_utilisateur
            LEFT JOIN cours_utilisateur cu ON cu.id_utilisateur = u.id_utilisateur
            GROUP BY u.id_utilisateur
            HAVING u.courriel = ?`,
			[courriel],
		);

		return results;
	} catch (error) {
		console.log(error);
	}
};

/**
 *  Affiche les données d'un utilisateur dont le courrirel est passé en parametre
 * @param {*} courriel 
 * @returns les données de utilisateur
 */
export const isClientExist = async (email) => {
	try {
		let connection = await connectionPromise;

		let results = await connection.all(
			`SELECT * from clients
            	WHERE email = ?`, 
    		[email]
		);

		return results;
	} catch (error) {
		console.log(error);
	}
};

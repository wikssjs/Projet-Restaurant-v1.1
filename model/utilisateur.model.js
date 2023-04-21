import connectionPromise from './connexion.js';
import { hash } from 'bcrypt';

export const addUtilisateur = async (id_type_utilisateur ,nom, prenom, mot_de_passe, email) => {
	try {
		let connection = await connectionPromise;
		let motDePasseHash = await hash(mot_de_passe, 10);
		await connection.run(
			`INSERT INTO utilisateurs (id_type_utilisateur, nom, prenom, mot_de_passe, email)
            VALUES (?, ?, ?, ?, ?);`,
			[id_type_utilisateur, nom, prenom, motDePasseHash, email],
		);
	} catch (error) {
		console.log(error);
	}
};



/**
 *  Affiche les données d'un utilisateur dont le courrirel est passé en parametre
 * @param {*} courriel 
 * @returns les données de utilisateur
 */
export const isUtilisateurExist = async (email) => {
	try {
		let connection = await connectionPromise;

		let results = await connection.all(
			`SELECT * from utilisateurs
            	WHERE email = ?`, 
    		[email]
		);

		return results;
	} catch (error) {
		console.log(error);
	}
};
export const removeUtilisateur = async (id_utilisateur) => {
    try {
        let connection = await connectionPromise;

        await connection.run(
            `DELETE FROM utilisateurs
                WHERE id_utilisateur = ?;`,
            [id_utilisateur]
        );
    }
    catch(error) {
        console.log(error);
    }
}
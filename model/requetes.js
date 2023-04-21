import connectionPromise from "./connexion.js";

export const getUtilisateurs = async () => {
    try {
        let connection = await connectionPromise;

        let results = await connection.all(
            `SELECT *  FROM utilisateurs u
                JOIN type_utilisateurs t on t.id_type_utilisateur= u.id_type_utilisateur;`, 
        );

        return results;
    }
    catch(error) {
        console.log(error);
    }
}
export const rechercherMenus = async (id_utilisateur, nom) => {
    try {
        let connection = await connectionPromise;

        let results = await connection.all(
            `SELECT DISTINCT
                m.nom, 
                m.description, 
                m.prix,
                m.image_url,
                m.id_menu,
                m.id_menu IN (
                    SELECT id_menu
                    FROM commandes
                    WHERE id_utilisateur = ?
                ) AS estAjoute 
            FROM menus m 
            LEFT JOIN commandes c ON c.id_menu = m.id_menu
            WHERE nom LIKE '%' || ? || '%';`, 
            [id_utilisateur, nom]
        );

        return results;
    }
    catch(error) {
        console.log(error);
    }
}
export const getMenus = async (id_utilisateur, limite) => {
    try {
        let connection = await connectionPromise;

        let results = await connection.all(
            `SELECT DISTINCT
                m.nom, 
                m.description, 
                m.prix,
                m.image_url,
                m.id_menu,
                ca.nom Nom_categorie,
                m.id_menu IN (
                   SELECT id_menu
                   FROM commandes
                   WHERE id_utilisateur = ?
                ) AS estAjoute 
            FROM menus m 
            LEFT JOIN commandes c ON c.id_menu = m.id_menu
            LEFT JOIN categories_menu ca ON ca.id_categorie_menu = m.id_categorie_menu
            LIMIT(?);`, 
            [id_utilisateur, limite]
        );

        return results;
    }
    catch(error) {
        console.log(error);
    }
}
export const getCategorieMenu = async () => {
    try {
        let connection = await connectionPromise;

        let results = await connection.all(
            `SELECT * FROM categories_menu;`, 
        );

        return results;
    }
    catch(error) {
        console.log(error);
    }
}
export const getMenuById = async (id_menu) => {
    try {
        let connection = await connectionPromise;

        let results = await connection.all(
            `SELECT * FROM menus
                WHERE id_menu = ?;`, 
            [id_menu]
        );

        return results;
    }
    catch(error) {
        console.log(error);
    }
}
export const getIngredientsParMenu = async (id_menu) => {
    try {
        let connection = await connectionPromise;

        let results = await connection.all(
            `SELECT * FROM ingredients 
                WHERE id_menu = ?;`, 
            [id_menu]
        );
        return results;
    }
    catch(error) {
        console.log(error);
    }
}


export const voirPlat = async (id_utilisateur, id_menu) => {
    try {
        let connection = await connectionPromise;

        let results = await connection.all(
            `SELECT 
                m.nom, m.prix, 
                c.quantite, 
                m.description, 
                m.image_url, 
                u.id_utilisateur,
                m.id_menu,
                m.id_menu IN (
                    SELECT id_menu
                    FROM commandes
                    WHERE id_utilisateur = ?
                 ) AS estAjoute
            FROM menus m 
            LEFT JOIN commandes c ON c.id_menu = m.id_menu 
            LEFT JOIN utilisateurs u ON u.id_utilisateur = c.id_utilisateur
            WHERE m.id_menu = ? ;`, 
            [id_utilisateur, id_menu]
        );

        return results;
    }
    catch(error) {
        console.log(error);
    }
}
export const getCommentaire = async () => {
    try {
        let connection = await connectionPromise;

        let results = await connection.all(
            `SELECT * FROM commentaires;`, 
        );

        return results;
    }
    catch(error) {
        console.log(error);
    }
}
export const getCommentaireParPlat = async (id_menu) => {
    try {
        let connection = await connectionPromise;

        let results = await connection.all(
            ` SELECT 
                co.commentaire, 
                co.date_commentaire,
                co.nom_utilisateur, 
                m.nom ,
                e.nb_etoiles,
                u.id_utilisateur
            FROM commentaires co
            JOIN utilisateurs u ON u.id_utilisateur= co.id_utilisateur
            JOIN menus m ON m.id_menu= co.id_menu
            JOIN etoiles e ON e.id_menu= co.id_menu
            WHERE m.id_menu = ? 
            GROUP BY co.id_commentaire;`, 
            [id_menu]
        );

        return results;
    }
    catch(error) {
        console.log(error);
    }
}


export const getPlatsParUtilisateurPanier = async (id_utilisateur) => {
    try {
        let connection = await connectionPromise;
        let results = await connection.all(
            `SELECT 
                m.nom, 
                m.prix, 
                c.quantite, 
                m.description, 
                m.image_url, 
                m.id_menu
            FROM menus m 
            LEFT JOIN commandes c ON c.id_menu = m.id_menu 
            JOIN utilisateurs u ON u.id_utilisateur = c.id_utilisateur 
            WHERE u.id_utilisateur = ?`, 
            [id_utilisateur]
        );
        return results;
    }
    catch(error) {
        console.log(error);
    }
}
export const getSommePlatsParUtilisateur= async (id_utilisateur) => {
    try {
        let connection = await connectionPromise;

        let results = await connection.all(
            `SELECT sum(m.prix * quantite) AS somme FROM commandes c
                JOIN menus m ON m.id_menu= c.id_menu
                WHERE id_utilisateur = ?;`, 
            [id_utilisateur]
        );
        return results;
    }
    catch(error) {
        console.log(error);
    }
}

export const getQuantitePlatsParUtilisateur = async (id_utilisateur) => {
    try {
        let connection = await connectionPromise;

        let results = await connection.all(
            `SELECT sum( quantite) AS quantite FROM commandes c
                JOIN menus m ON m.id_menu= c.id_menu
                WHERE id_utilisateur = ?;`, 
            [id_utilisateur]
        );
        return results;
    }
    catch(error) {
        console.log(error);
    }
}
export const getMoyenneEtoil = async (id_menu) => {
    try {
        let connection = await connectionPromise;

        let results = await connection.get(
            `SELECT 
                avg(e.nb_etoiles) as moyenne_etoil
            FROM etoiles e
            JOIN menus m ON m.id_menu= e.id_menu
            WHERE e.id_menu = ?;`, 
            [id_menu]
        );
        return results;
    }
    catch(error) {
        console.log(error);
    }
}


export const addMenuClient = async (id_utilisateur, id_menu, quantite, etat_commande) => {
    try {
        let connection = await connectionPromise;
        await connection.run(
            `INSERT INTO commandes (id_utilisateur, id_menu, quantite, etat_commande) 
            VALUES (?, ?, ?, ?);`,
            [id_utilisateur, id_menu, quantite, etat_commande]
        );
        return true;
    }
    catch(error) {
        if(error.code === 'SQLITE_CONSTRAINT') {
            return false;
        }
        else {
            console.log(error);
        }
    }
}
export const addIngredient = async (id_menu, nom, description) => {
    try {
        let connection = await connectionPromise;
        await connection.run(
            `INSERT INTO ingredients (id_menu, nom, description) 
                VALUES (?, ?, ?);`,
            [id_menu, nom, description]
        );
        return true;
    }
    catch(error) {
        if(error.code === 'SQLITE_CONSTRAINT') {
            return false;
        }
        else {
            console.log(error);
        }
    }
}
export const addPaiementParClient = async (id_utilisateur, montant, etat_paiement, type_carte_credit, numero_carte_credit, nom_titulaire_carte, date_expiration_carte, code_securite) => {
    try {
        let connection = await connectionPromise;
        await connection.run(
            `INSERT INTO paiements (id_utilisateur, montant, etat_paiement, type_carte_credit, numero_carte_credit, nom_titulaire_carte, date_expiration_carte, code_securite)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?);`,
            [id_utilisateur, montant, etat_paiement, type_carte_credit, numero_carte_credit, nom_titulaire_carte, date_expiration_carte, code_securite]
        );
        return true;
    }
    catch(error) {
        if(error.code === 'SQLITE_CONSTRAINT') {
            return false;
        }
        else {
            console.log(error);
        }
    }
}
export const addLivraisonClient = async (id_utilisateur, nom_utilisateur, adresse_livraison, instructions_speciales, etat_livraison) => {
    try {
        let connection = await connectionPromise;
        await connection.run(
            `INSERT INTO livraisons (id_utilisateur, nom_utilisateur, adresse_livraison, instructions_speciales, etat_livraison)
            VALUES(?, ?, ?, ?, ?);`,
            [id_utilisateur, nom_utilisateur, adresse_livraison, instructions_speciales, etat_livraison]
        );
        return true;
    }
    catch(error) {
        if(error.code === 'SQLITE_CONSTRAINT') {
            return false;
        }
        else {
            console.log(error);
        }
    }
}
export const addMenu = async (nom, description, prix, image_url, id_categorie_menu) => {
    try {
        let connection = await connectionPromise;
        await connection.run(
            `INSERT INTO menus (nom, description, prix, image_url, id_categorie_menu) 
                VALUES (?, ?, ?, ?, ?);`,
            [nom, description, prix, image_url, id_categorie_menu]
        );
        return true;
    }
    catch(error) {
        if(error.code === 'SQLITE_CONSTRAINT') {
            return false;
        }
        else {
            console.log(error);
        }
    }
}
export const addCommentaire = async (id_menu, id_utilisateur, nom_utilisateur, email, commentaire) => {
    try {
        let connection = await connectionPromise;
        await connection.run(
            `INSERT INTO commentaires (id_menu, id_utilisateur, nom_utilisateur, email, commentaire) 
                VALUES (?, ?, ?, ?, ?);`,
            [id_menu, id_utilisateur, nom_utilisateur, email, commentaire]
        );
        return true;
    }
    catch(error) {
        if(error.code === 'SQLITE_CONSTRAINT') {
            return false;
        }
        else {
            console.log(error);
        }
    }
}
export const addEtoil= async (id_menu,id_utilisateur, nb_etoiles) => {
    try {
        let connection = await connectionPromise;
        await connection.run(
            `INSERT INTO etoiles (id_menu, id_utilisateur, nb_etoiles) 
                VALUES (?, ?, ?);`,
            [id_menu, id_utilisateur ,nb_etoiles]
        );
        return true;
    }
    catch(error) {
        if(error.code === 'SQLITE_CONSTRAINT') {
            return false;
        }
        else {
            console.log(error);
        }
    }
}


export const removePlatParClient = async (id_utilisateur, id_menu) => {
    try {
        let connection = await connectionPromise;

        await connection.run(
            `DELETE FROM commandes
                WHERE id_utilisateur = ? AND id_menu = ?;`,
            [id_utilisateur, id_menu]
        );
    }
    catch(error) {
        console.log(error);
    }
}
export const removePanierClient = async (id_utilisateur) => {
    try {
        let connection = await connectionPromise;

        await connection.run(
            ` DELETE FROM commandes
                WHERE id_utilisateur = ?;`,
            [id_utilisateur]
        );
    }
    catch(error) {
        console.log(error);
    }
}
export const removePlat = async (id_menu) => {
    try {
        let connection = await connectionPromise;

        await connection.run(
            `DELETE FROM menus
                WHERE id_menu = ?;`,
            [id_menu]
        );
    }
    catch(error) {
        console.log(error);
    }
}
export const updateMenu = async (nom, description, prix, image_url, id_menu, id_categorie_menu) => {
    try {
        let connection = await connectionPromise;

        await connection.run(
            `UPDATE menus
             SET nom = ?, description = ?, prix = ?, image_url = ?, id_categorie_menu = ?
             WHERE id_menu = ?;`,
            [nom, description, prix, image_url, id_menu, id_categorie_menu]
        );
    } catch (error) {
        console.log(error);
    }
}

export const quantitePlus = async (id_utilisateur, id_menu) => {
    try {
        let connection = await connectionPromise;

        await connection.run(
            `UPDATE commandes
                SET quantite = quantite + 1
                WHERE id_utilisateur = ? AND id_menu = ?;`,
            [id_utilisateur, id_menu]
        );
    }
    catch(error) {
        console.log(error);
    }
}
export const quantiteMoin = async (id_utilisateur, id_menu) => {
    try {
        let connection = await connectionPromise;

        await connection.run(
            `UPDATE commandes
                SET quantite = quantite - 1
                WHERE id_utilisateur = ? AND id_menu = ?;`,
            [id_utilisateur, id_menu]
        );
    }
    catch(error) {
        console.log(error);
    }
}

export const getClientByEmail= async(email)=>{
    try {
        let connection= await connectionPromise;
        let resultat= await connection.get(
            `SELECT *  FROM utilisateurs u
                JOIN type_utilisateurs t on t.id_type_utilisateur= u.id_type_utilisateur
                WHERE u.email = ?`, 
            [email]
        );
        return resultat;
    } catch (error) {
        console.log(error);
    }
}
export const getPaiement= async()=>{
    try {
        let connection= await connectionPromise;
        let resultat= await connection.all(
            `SELECT 
                p.id_paiement,
                u.nom,
                u.prenom,
                p.montant,
                p.etat_paiement,     
                p.numero_carte_credit,
                p.nom_titulaire_carte,
                p.date_paiement
            from paiements p
            JOIN utilisateurs u on u.id_utilisateur= p.id_utilisateur;`, 
        );
        return resultat;
    } catch (error) {
        console.log(error);
    }
}
export const getCommandes= async()=>{
    try {
        let connection= await connectionPromise;
        let resultat= await connection.all(
            `SELECT 
                u.nom nom_client, 
                m.nom nom_menu, 
                m.prix, 
                c.quantite, 
                c.date_commande,
                c.etat_commande, 
                m.image_url 
            FROM commandes c
            LEFT JOIN utilisateurs u on u.id_utilisateur=c.id_utilisateur
            JOIN menus m on m.id_menu = c.id_menu;`, 
        );
        return resultat;
    } catch (error) {
        console.log(error);
    }
}
export const getFounisseurFourniture= async()=>{
    try {
        let connection= await connectionPromise;
        let resultat= await connection.all(
            `SELECT f2.nom Nom_fournisseur,
                f2.adresse,
                f2.email,
                f2.telephone,
                f2.description description_fournisseur,
                s.quantite,
                f1.nom Nom_fourniture,
                f1.description
            FROM stocks s
            RIGHT JOIN fournitures f1 on f1.id_fourniture=s.id_fourniture
            RIGHT JOIN fournisseurs f2 on f2.id_fournisseur=f1.id_fournisseur
            GROUP BY f1.id_fourniture;`, 
        );
        return resultat;
    } catch (error) {
        console.log(error);
    }
}

// `SELECT 
// m.nom, 
// m.description, 
// m.prix,
// m.image_url,
// m.created_at,
// m.id_menu IN (
//     SELECT id_menu
//     FROM orders
//     WHERE id_client = ?
// ) AS estAjoute 
// FROM menus m 
// JOIN orders o ON o.id_menu = m.id_menu
// LIMIT(?);`
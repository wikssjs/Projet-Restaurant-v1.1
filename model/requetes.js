import connectionPromise from "./connexion.js";

export const getClients = async () => {
    try {
        let connection = await connectionPromise;

        let results = await connection.all(
            `SELECT * FROM clients;`, 
        );

        return results;
    }
    catch(error) {
        console.log(error);
    }
}
export const rechercherMenus = async (id_client, nom) => {
    try {
        let connection = await connectionPromise;

        let results = await connection.all(
            `SELECT DISTINCT
                m.nom, 
                m.description, 
                m.prix,
                m.image_url,
                m.created_at,
                m.id_menu,
                m.id_menu IN (
                    SELECT id_menu
                    FROM orders
                    WHERE id_client = ?
                ) AS estAjoute 
            FROM menus m 
            LEFT JOIN orders o ON o.id_menu = m.id_menu
            WHERE nom LIKE '%' || ? || '%';`, 
            [id_client, nom]
        );

        return results;
    }
    catch(error) {
        console.log(error);
    }
}
export const getMenus = async (id_client, limite) => {
    try {
        let connection = await connectionPromise;

        let results = await connection.all(
            `SELECT DISTINCT
                m.nom, 
                m.description, 
                m.prix,
                m.image_url,
                m.created_at,
                m.id_menu,
                m.id_menu IN (
                   SELECT id_menu
                   FROM orders
                   WHERE id_client = ?
                ) AS estAjoute 
            FROM menus m 
            LEFT JOIN orders o ON o.id_menu = m.id_menu
            LIMIT(?);`, 
            [id_client, limite]
        );

        return results;
    }
    catch(error) {
        console.log(error);
    }
}

export const voirPlat = async (id_client, id_plat) => {
    try {
        let connection = await connectionPromise;

        let results = await connection.all(
            `SELECT 
                m.nom, m.prix, 
                o.quantite, 
                m.description, 
                m.image_url, 
                c.id_client,
                m.id_menu,
                m.id_menu IN (
                    SELECT id_menu
                    FROM orders
                    WHERE id_client = ?
                 ) AS estAjoute
            FROM menus m 
            LEFT JOIN orders o ON m.id_menu = o.id_menu 
            LEFT JOIN clients c ON c.id_client = o.id_client
            WHERE m.id_menu = ? ;`, 
            [id_client, id_plat]
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
                co.created_at,
                co.nom_commentataire, 
                m.nom ,
                e.nb_etoil,
                c.id_client
            FROM commentaires co
            JOIN clients c ON c.id_client= co.id_client
            JOIN menus m ON m.id_menu= co.id_menu
            JOIN etoils e ON e.id_menu= co.id_menu
            WHERE m.id_menu = ? 
            GROUP BY co.id_commentaires;`, 
            [id_menu]
        );

        return results;
    }
    catch(error) {
        console.log(error);
    }
}


export const getPlatsParClientPanier = async (id_client) => {
    try {
        let connection = await connectionPromise;

        let results = await connection.all(
            `SELECT 
                m.nom, 
                m.prix, 
                o.quantite, 
                m.description, 
                m.image_url, 
                m.id_menu
            FROM menus m 
            LEFT JOIN orders o ON m.id_menu = o.id_menu 
            JOIN clients c ON o.id_client = c.id_client 
            WHERE c.id_client = ?`, 
            [id_client]
        );
        return results;
    }
    catch(error) {
        console.log(error);
    }
}
export const getSommePlatsParClient = async (id_client) => {
    try {
        let connection = await connectionPromise;

        let results = await connection.all(
            `SELECT sum(m.prix * quantite) AS somme FROM orders o
                JOIN menus m ON m.id_menu= o.id_menu
                WHERE id_client = ?;`, 
            [id_client]
        );
        return results;
    }
    catch(error) {
        console.log(error);
    }
}

export const getQuantitePlatsParClient = async (id_client) => {
    try {
        let connection = await connectionPromise;

        let results = await connection.all(
            `SELECT sum( quantite) AS quantite FROM orders o
                JOIN menus m ON m.id_menu= o.id_menu
                WHERE id_client = ?;`, 
            [id_client]
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
                avg(e.nb_etoil) as moyenne_etoil
            FROM etoils e
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


export const addMenuClient = async (id_client, id_menu, quantite) => {
    try {
        let connection = await connectionPromise;
        await connection.run(
            `INSERT INTO orders (id_client, id_menu, quantite) 
            VALUES (?, ?, ?);`,
            [id_client, id_menu, quantite]
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
export const addPaiementParClient = async (id_client, montant, adresse_livraison, numero_carte, nom_titulaire_cart, date_expiration, code_securite) => {
    try {
        let connection = await connectionPromise;
        await connection.run(
            `INSERT INTO payements (id_client, montant, adresse_livraison, numero_carte, nom_titulaire_cart, date_expiration, code_securite)
            VALUES(?, ?, ?, ?, ?, ?, ?);`,
            [id_client, montant, adresse_livraison, numero_carte, nom_titulaire_cart, date_expiration, code_securite]
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
export const addMenu = async (nom, description, prix, image_url	) => {
    try {
        let connection = await connectionPromise;
        await connection.run(
            `INSERT INTO menus (nom, description, prix, image_url) 
                VALUES (?, ?, ?, ?);`,
            [nom, description, prix, image_url]
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
export const addCommentaire = async (id_menu,id_client, nom_commentataire, email, commentaire) => {
    try {
        let connection = await connectionPromise;
        await connection.run(
            `INSERT INTO commentaires (id_menu, id_client, nom_commentataire, email, commentaire) 
                VALUES (?, ?, ?, ?, ?);`,
            [id_menu, id_client ,nom_commentataire, email, commentaire]
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
export const addEtoil= async (id_menu,id_client, nb_etoil) => {
    try {
        let connection = await connectionPromise;
        await connection.run(
            `INSERT INTO etoils (id_menu, id_client, nb_etoil) 
                VALUES (?, ?, ?);`,
            [id_menu, id_client ,nb_etoil]
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


export const removePlatParClient = async (id_client, id_menu) => {
    try {
        let connection = await connectionPromise;

        await connection.run(
            `DELETE FROM orders
                WHERE id_client = ? AND id_menu = ?;`,
            [id_client, id_menu]
        );
    }
    catch(error) {
        console.log(error);
    }
}
export const removePanierClient = async (id_client) => {
    try {
        let connection = await connectionPromise;

        await connection.run(
            ` DELETE FROM orders
                WHERE id_client = ?;`,
            [id_client]
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
export const quantitePlus = async (id_client, id_menu) => {
    try {
        let connection = await connectionPromise;

        await connection.run(
            `UPDATE orders
                SET quantite = quantite + 1
                WHERE id_client = ? AND id_menu = ?;`,
            [id_client, id_menu]
        );
    }
    catch(error) {
        console.log(error);
    }
}
export const quantiteMoin = async (id_client, id_menu) => {
    try {
        let connection = await connectionPromise;

        await connection.run(
            `UPDATE orders
                SET quantite = quantite - 1
                WHERE id_client = ? AND id_menu = ?;`,
            [id_client, id_menu]
        );
    }
    catch(error) {
        console.log(error);
    }
}


export const getPlat= async(id_menu)=>{
    let connection= await connectionPromise;
    let resultat= await connection.all(
        `SELECT 
            c.id_cours, 
            c.nom, 
            c.description, 
            c.date_debut, 
            c.nb_cours,
            c.capacite,
            COUNT(cu.id_cours) AS inscriptions
        FROM cours c 
        LEFT JOIN cours_utilisateur cu ON c.id_cours = cu.id_cours 
        GROUP BY c.id_cours
        HAVING c.id_cours = ?`, 
        [id_cours]
    );
    return resultat;
}
export const getClientByEmail= async(email)=>{
    try {
        let connection= await connectionPromise;
        let resultat= await connection.get(
            `SELECT * from clients
                WHERE email = ?`, 
            [email]
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
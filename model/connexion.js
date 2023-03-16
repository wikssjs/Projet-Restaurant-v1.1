import { existsSync } from 'fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

/**
 * Constante indiquant si la base de données existe au démarrage du serveur 
 * ou non.
 */
const IS_NEW = !existsSync(process.env.DB_FILE)

/**
 * Crée une base de données par défaut pour le serveur. Des données fictives
 * pour tester le serveur y ont été ajouté.
 */
const createDatabase = async (connectionPromise) => {
    let connection = await connectionPromise;
    await connection.exec(
        `
        CREATE TABLE menus (
            id_menu INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            description TEXT NOT NULL,
            prix REAL NOT NULL,
            image_url TEXT NOT NULL,
            created_at DATETIME DEFAULT (datetime('now'))
        );
        
        
        CREATE TABLE categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_menu INTEGER NOT NULL,
            nom_categorie TEXT NOT NULL,
            created_at DATETIME DEFAULT (datetime('now')),
            CONSTRAINT fk_categories_menu
                FOREIGN KEY (id_menu) 
                REFERENCES menus (id_menu)
                ON DELETE SET NULL 
                ON UPDATE CASCADE
        );
        
        CREATE TABLE commentaires (
            id_commentaires INTEGER PRIMARY KEY AUTOINCREMENT,
            id_menu INTEGER NOT NULL,
            id_client INTEGER NOT NULL,
            nom_commentataire TEXT NOT NULL,
            email TEXT NOT NULL,
            commentaire TEXT NOT NULL,
            created_at DATETIME DEFAULT (datetime('now')),
            CONSTRAINT fk_commentaire_menu
                FOREIGN KEY (id_menu) 
                REFERENCES menus (id_menu)
                ON DELETE SET NULL 
                ON UPDATE CASCADE,
            CONSTRAINT fk_commentaire_client
                FOREIGN KEY (id_client) 
                REFERENCES clients (id_client)
                ON DELETE SET NULL 
                ON UPDATE CASCADE
        );
        
        CREATE TABLE clients (
            id_client INTEGER PRIMARY KEY AUTOINCREMENT,
            nom_client TEXT NOT NULL,
            prenom TEXT,
            password TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            created_at DATETIME DEFAULT (datetime('now'))
        );
        
        
        CREATE TABLE orders (
            id_order INTEGER PRIMARY KEY AUTOINCREMENT,
            id_client INTEGER NOT NULL,
            id_menu INTEGER NOT NULL,
            quantite INTEGER NOT NULL CHECK (quantite >= 1),
            created_at DATETIME DEFAULT (datetime('now')),
            CONSTRAINT fk_order_client
                FOREIGN KEY (id_client) 
                REFERENCES clients (id_client),
            CONSTRAINT fk_order_menu
                FOREIGN KEY (id_menu) 
                REFERENCES menus (id_menu)
                ON DELETE SET NULL 
                ON UPDATE CASCADE
        );
        
        CREATE TABLE etoils (
            id_etoil INTEGER PRIMARY KEY AUTOINCREMENT,
            id_client INTEGER NOT NULL,
            id_menu INTEGER NOT NULL,
            nb_etoil INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT (datetime('now')),
            CONSTRAINT fk_etoil_client
                FOREIGN KEY (id_client) 
                REFERENCES clients (id_client),
            CONSTRAINT fk_etoil_menu
                FOREIGN KEY (id_menu) 
                REFERENCES menus (id_menu)
        );
        CREATE TABLE payements (
            id_payement INTEGER PRIMARY KEY AUTOINCREMENT,
            id_client INTEGER NOT NULL,
            montant REAL NOT NULL,
            adresse_livraison TEXT NOT NULL,
            numero_carte INTEGER NOT NULL,
            nom_titulaire_cart TEXT NOT NULL,
            date_expiration DATETIME NOT NULL,
            code_securite TEXT NOT NULL,
            created_at DATETIME DEFAULT (datetime('now')),
            CONSTRAINT fk_payement_client
                FOREIGN KEY (id_client) 
                REFERENCES clients (id_client)
                ON DELETE SET NULL 
                ON UPDATE CASCADE
        );

        INSERT INTO menus (nom, description, prix, image_url) VALUES 
        ('Burger Classique', 'Un hamburger classique avec du bœuf, de la laitue et de la tomate', 8.99, '/images/img_plats/c5.jpg'),
        ('Pizza Margherita', 'Pizza au fromage avec des tomates et du basilic', 12.99, '/images/img_plats/c4.jpg'),
        ('Salade César', 'Laitue romaine, croûtons, parmesan, poulet grillé et sauce césar', 9.99, '/images/img_plats/c9.jpg'),
        ('Pâtes Bolognaises', 'Pâtes avec de la sauce bolognaise maison et du parmesan', 10.99, '/images/img_plats/c7.jpg'),
        ('Tacos au Poulet', 'Tacos au poulet grillé avec de la laitue, des tomates et de la sauce piquante', 7.99, '/images/img_plats/c0.jpg'),
        ('Tacos aux crevettes', 'Tacos aux crevettes grillées avec de la laitue, de la tomate et de la sauce épicée', 9.99, '/images/img_plats/c8.jpg'),
        ('Hot dog', 'Un hot dog classique avec de la moutarde, du ketchup et des oignons', 6.99, '/images/img_plats/hag-dog.jpg'),
        ('Spaghetti Carbonara', 'Pâtes avec une sauce à base de crème, de lardons et de fromage', 13.99, '/images/img_plats/spaghetti-Carbonara.jpg'),
        ('Sandwich Club', 'Pain grillé avec du poulet grillé, du bacon, de la laitue, de la tomate et de la mayonnaise', 8.99, '/images/img_plats/Sandwich-Club.png'),
        ('Nachos au fromage', 'Nachos avec du fromage fondu, des jalapeños et de la salsa', 7.99, '/images/img_plats/Nachos-au-fromage.jpeg'),
        ('Burrito aux légumes', 'Burrito avec des légumes grillés, du riz, des haricots noirs et de la salsa', 8.99, '/images/img_plats/Burrito-aux-légumes.jpeg');

        INSERT INTO categories (nom_categorie, id_menu) VALUES 
        ('Burgers', 1),
        ('Pizzas', 4),
        ('Salades', 2),
        ('Pâtes', 6),
        ('Tacos', 4),
        ('Sandwiches', 1),
        ('Soupes', 5),
        ('Desserts', 3),
        ('Boissons', 9),
        ('Plats végétariens', 2);

        INSERT INTO commentaires (id_menu, id_client, nom_commentataire, email, commentaire) VALUES 
        (1, 1, 'Marie', 'marie@example.com', 'Le burger était incroyable, je vais en commander un autre !'),
        (2, 2, 'Jean', 'jean@example.com', 'La pizza Margherita était très savoureuse, je la recommande.'),
        (3, 1, 'Sophie', 'sophie@example.com', 'La salade César était fraîche et délicieuse.'),
        (4, 3, 'Danielle', 'danielle@example.com', 'Les pâtes étaient un peu sèches, mais la sauce était bonne.'),
        (5, 2, 'Ethan', 'ethan@example.com', 'Les tacos étaient délicieux, jai adoré !');

        INSERT INTO clients (nom_client, prenom, password, email) VALUES 
            ('Dupont', 'Jean', '123456', 'jean.dupont@example.com'),
            ('Martin', 'Sophie', 'password', 'sophie.martin@example.com'),
            ('Durand', 'Pierre', 'qwerty', 'pierre.durand@example.com'),
            ('Lefebvre', 'Julie', 'letmein', 'julie.lefebvre@example.com'),
            ('Leroy', 'Luc', 'football', 'luc.leroy@example.com'),
            ('Moreau', 'Marie', 'baseball', 'marie.moreau@example.com'),
            ('Girard', 'Francois', 'password123', 'francois.girard@example.com'),
            ('Roux', 'Laura', '12345678', 'laura.roux@example.com'),
            ('Lopez', 'Carlos', 'iloveyou', 'carlos.lopez@example.com'),
            ('Gonzalez', 'Maria', 'sunshine', 'maria.gonzalez@example.com');



        

        INSERT INTO etoils (id_client, id_menu, nb_etoil) VALUES 
        (1, 1, 5),
        (1, 3, 4),
        (5, 1, 5),
        (7, 3, 4);

        INSERT INTO payements (id_client, montant, adresse_livraison, numero_carte,nom_titulaire_cart, date_expiration, code_securite) VALUES 
        (1, 20.00, '85 Rue lavoine, 635, J8Z 3K5, Montréal, Canada', 43356546667, 'Dupont', '2023-02-18', 'RS6' );


        `                       
    );

    return connection;
}
// CREATE TABLE categories (
//     id INTEGER PRIMARY KEY,
//     nom_categorie TEXT NOT NULL,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
// );
// Base de données dans un fichier
let connectionPromise = open({
    filename: process.env.DB_FILE,
    driver: sqlite3.Database
});

// Si le fichier de base de données n'existe pas, on crée la base de données
// et on y insère des données fictive de test.
if (IS_NEW) {
    connectionPromise = createDatabase(connectionPromise);
}

export default connectionPromise;

// INSERT INTO orders (id_client, id_menu, quantite) VALUES 
//         (1, 1, 2),
//         (2, 3, 2),
//         (1, 3, 1);


// INSERT INTO orders (id_client, id_menu, quantite) VALUES 
// (1, 1, 2),
// (1, 3, 1),
// (1, 2, 2),
// (4, 4, 1),
// (5, 5, 3),
// (1, 8, 1),
// (2, 2, 3),
// (3, 4, 2),
// (4, 1, 1),
// (5, 5, 2);
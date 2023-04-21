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
        CREATE TABLE type_utilisateurs (
            id_type_utilisateur INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL
          );
          
          CREATE TABLE utilisateurs (
            id_utilisateur INTEGER PRIMARY KEY AUTOINCREMENT,
            id_type_utilisateur INTEGER,
            nom TEXT NOT NULL,
            prenom TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            mot_de_passe TEXT NOT NULL,
            created_at DATETIME DEFAULT (datetime('now')),
            FOREIGN KEY (id_type_utilisateur) 
            REFERENCES type_utilisateurs(id_type_utilisateur)
                ON DELETE SET NULL 
                ON UPDATE CASCADE
          );
          
          CREATE TABLE type_employes (
            id_type_employe INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL
          );
          
          CREATE TABLE employes (
            id_employe INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            prenom TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            mot_de_passe TEXT NOT NULL,
            role TEXT NOT NULL,
            horaires_travail TEXT NOT NULL,
            etat_emploi TEXT NOT NULL,
            id_type_employe INTEGER,
            FOREIGN KEY (id_type_employe) 
            REFERENCES type_employes(id_type_employe)
                ON DELETE SET NULL 
                ON UPDATE CASCADE
          );
          
          CREATE TABLE categories_menu (
            id_categorie_menu INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL
          );
          
          CREATE TABLE menus (
            id_menu INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            description TEXT NOT NULL,
            prix REAL NOT NULL,
            image_url TEXT NOT NULL,
            id_categorie_menu INTEGER,
            FOREIGN KEY (id_categorie_menu) 
            REFERENCES categories_menu(id_categorie_menu)
                ON DELETE SET NULL 
                ON UPDATE CASCADE
          );
          
          CREATE TABLE ingredients (
            id_ingredient INTEGER PRIMARY KEY AUTOINCREMENT,
            id_menu INTEGER NOT NULL,
            nom TEXT NOT NULL,
            description TEXT,
            quantite INTEGER,
            FOREIGN KEY (id_menu) 
            REFERENCES menus(id_menu)
                ON DELETE SET NULL 
                ON UPDATE CASCADE
          );
          
          CREATE TABLE commentaires (
            id_commentaire INTEGER PRIMARY KEY AUTOINCREMENT,
            id_menu INTEGER NOT NULL,
            id_utilisateur INTEGER NOT NULL,
            nom_utilisateur TEXT NOT NULL,
            email TEXT NOT NULL,
            commentaire TEXT NOT NULL,
            date_commentaire DATETIME DEFAULT (datetime('now')),
            FOREIGN KEY (id_menu) 
            REFERENCES menus(id_menu)
                ON DELETE SET NULL 
                ON UPDATE CASCADE,
            FOREIGN KEY (id_utilisateur) 
            REFERENCES utilisateurs(id_utilisateur)
                ON DELETE SET NULL 
                ON UPDATE CASCADE
          );
          
          CREATE TABLE commandes (
            id_commande INTEGER PRIMARY KEY AUTOINCREMENT,
            id_utilisateur INTEGER NOT NULL,
            id_menu INTEGER NOT NULL,
            quantite INTEGER NOT NULL CHECK (quantite >= 1),
            etat_commande TEXT NOT NULL,
            date_commande DATETIME DEFAULT (datetime('now')),
            date_livraison_estimee DATETIME,
            FOREIGN KEY (id_utilisateur) 
            REFERENCES utilisateurs(id_utilisateur)
                ON DELETE SET NULL 
                ON UPDATE CASCADE,
            FOREIGN KEY (id_menu) 
            REFERENCES menus(id_menu)
                ON DELETE SET NULL 
                ON UPDATE CASCADE
          );
          
          CREATE TABLE paiements (
            id_paiement INTEGER PRIMARY KEY AUTOINCREMENT,
            id_utilisateur INTEGER NOT NULL,
            montant REAL NOT NULL,
            etat_paiement TEXT NOT NULL,
            type_carte_credit TEXT NOT NULL,
            numero_carte_credit TEXT NOT NULL,
            nom_titulaire_carte TEXT NOT NULL,
            date_expiration_carte DATETIME NOT NULL,
            code_securite TEXT NOT NULL,
            date_paiement DATETIME DEFAULT (datetime('now')),
            FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id_utilisateur)
                ON DELETE SET NULL 
                ON UPDATE CASCADE
          );
          
          CREATE TABLE livraisons (
            id_livraison INTEGER PRIMARY KEY AUTOINCREMENT,
            id_utilisateur INTEGER NOT NULL,
            nom_utilisateur TEXT NOT NULL,
            adresse_livraison TEXT NOT NULL,
            instructions_speciales TEXT,
            etat_livraison TEXT NOT NULL,
            date_livraison DATETIME,
            FOREIGN KEY (id_utilisateur) 
            REFERENCES utilisateurs(id_utilisateur)
                ON DELETE SET NULL 
                ON UPDATE CASCADE
          );
          
          CREATE TABLE reservations (
            id_reservation INTEGER PRIMARY KEY AUTOINCREMENT,
            id_utilisateur INTEGER NOT NULL,
            date_reservation DATETIME NOT NULL,
            nombre_personnes INTEGER NOT NULL,
            etat_reservation TEXT NOT NULL,
            instructions_speciales TEXT,
            FOREIGN KEY (id_utilisateur) 
            REFERENCES utilisateurs(id_utilisateur)
                ON DELETE SET NULL 
                ON UPDATE CASCADE
          );
          
          CREATE TABLE etoiles (
            id_etoil INTEGER PRIMARY KEY AUTOINCREMENT,
            id_utilisateur INTEGER,
            id_menu INTEGER NOT NULL,
            nb_etoiles INTEGER NOT NULL,
            date_notation DATETIME DEFAULT (datetime('now')),
            FOREIGN KEY (id_utilisateur) 
            REFERENCES utilisateurs(id_utilisateur)
                ON DELETE SET NULL 
                ON UPDATE CASCADE,
            FOREIGN KEY (id_menu) 
            REFERENCES menus(id_menu)
                ON DELETE SET NULL 
                ON UPDATE CASCADE
          );
          
          CREATE TABLE promotions (
            id_promotion INTEGER PRIMARY KEY AUTOINCREMENT,
            id_menu INTEGER NOT NULL,
            reduction REAL NOT NULL,
            date_debut DATETIME NOT NULL,
            date_fin DATETIME NOT NULL,
            FOREIGN KEY (id_menu) 
            REFERENCES menus(id_menu)
                ON DELETE SET NULL 
                ON UPDATE CASCADE
          );
          
          CREATE TABLE fournisseurs (
            id_fournisseur INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            adresse TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            telephone TEXT NOT NULL,
            description TEXT
          );
          
          CREATE TABLE fournitures (
            id_fourniture INTEGER PRIMARY KEY AUTOINCREMENT,
            id_fournisseur INTEGER NOT NULL,
            nom TEXT NOT NULL,
            description TEXT,
            quantite INTEGER NOT NULL,
            date_achat DATETIME DEFAULT (datetime('now')),
            FOREIGN KEY (id_fournisseur) 
            REFERENCES fournisseurs(id_fournisseur)
                ON DELETE SET NULL 
                ON UPDATE CASCADE
          );
          
          CREATE TABLE stocks (
            id_stock INTEGER PRIMARY KEY AUTOINCREMENT,
            id_fourniture INTEGER NOT NULL,
            quantite INTEGER NOT NULL,
            date_mise_a_jour DATETIME DEFAULT (datetime('now')),
            FOREIGN KEY (id_fourniture) 
            REFERENCES fournitures(id_fourniture)
                ON DELETE SET NULL 
                ON UPDATE CASCADE
          );
          
          INSERT INTO type_utilisateurs (type)
          VALUES ('Client'),
                 ('Admin');
          
          INSERT INTO utilisateurs (id_type_utilisateur, nom, prenom, email, mot_de_passe)
          VALUES (1, 'Dupont', 'Jean', 'jean.dupont@email.com', 'motdepasse'),
                 (1, 'Martin', 'Alice', 'alice.martin@email.com', 'motdepasse'),
                 (2, 'Leroy', 'Bruno', 'bruno.leroy@email.com', 'motdepasse');
          
          INSERT INTO type_employes (type)
          VALUES ('Cuisinier'),
                 ('Serveur'),
                 ('Manager'),
                 ('Plongeur');
                 
          INSERT INTO employes (nom, prenom, email, mot_de_passe, role, horaires_travail, etat_emploi, id_type_employe)
          VALUES ('Dupont', 'Jean', 'jean.dupont@example.com', 'mdpjean', 'Cuisinier', 'Lundi-Vendredi 09:00-17:00', 'actif', 1),
                 ('Martin', 'Alice', 'alice.martin@example.com', 'mdpalice', 'Serveur', 'Lundi-Vendredi 08:00-16:00', 'actif', 2),
                 ('Leblanc', 'Pierre', 'pierre.leblanc@example.com', 'mdppierre', 'Manager', 'Lundi-Vendredi 07:00-15:00', 'actif', 3),
                 ('Petit', 'Sophie', 'sophie.petit@example.com', 'mdpsophie', 'Plongeur', 'Lundi-Vendredi 10:00-18:00', 'actif', 4);
          
          INSERT INTO categories_menu (nom)
          VALUES ('Burgers'),
                ('Pizzas'),
                ('Salades'),
                ('Pâtes'),
                ('Tacos'),
                ('Sandwiches'),
                ('Soupes'),
                ('Desserts'),
                ('Boissons'),
                ('Plats végétariens');
          
          INSERT INTO menus (nom, description, prix, image_url, id_categorie_menu) 
          VALUES ('Burger Classique', 'Un hamburger classique avec du bœuf, de la laitue et de la tomate', 8.99, '/images/img_plats/c5.jpg', 1),
                 ('Pizza Margherita', 'Pizza au fromage avec des tomates et du basilic', 12.99, '/images/img_plats/c4.jpg', 1),
                 ('Salade César', 'Laitue romaine, croûtons, parmesan, poulet grillé et sauce césar', 9.99, '/images/img_plats/c9.jpg', 1),
                 ('Pâtes Bolognaises', 'Pâtes avec de la sauce bolognaise maison et du parmesan', 10.99, '/images/img_plats/c7.jpg', 2),
                 ('Tacos au Poulet', 'Tacos au poulet grillé avec de la laitue, des tomates et de la sauce piquante', 7.99, '/images/img_plats/c0.jpg', 2),
                 ('Tacos aux crevettes', 'Tacos aux crevettes grillées avec de la laitue, de la tomate et de la sauce épicée', 9.99, '/images/img_plats/c8.jpg', 1),
                 ('Hot dog', 'Un hot dog classique avec de la moutarde, du ketchup et des oignons', 6.99, '/images/img_plats/hag-dog.jpg', 2),
                 ('Spaghetti Carbonara', 'Pâtes avec une sauce à base de crème, de lardons et de fromage', 13.99, '/images/img_plats/spaghetti-Carbonara.jpg', 2),
                 ('Sandwich Club', 'Pain grillé avec du poulet grillé, du bacon, de la laitue, de la tomate et de la mayonnaise', 8.99, '/images/img_plats/Sandwich-Club.png', 1),
                 ('Nachos au fromage', 'Nachos avec du fromage fondu, des jalapeños et de la salsa', 7.99, '/images/img_plats/Nachos-au-fromage.jpeg', 1),
                 ('Burrito aux légumes', 'Burrito avec des légumes grillés, du riz, des haricots noirs et de la salsa', 8.99, '/images/img_plats/Burrito-aux-légumes.jpeg', 2);
                 
            INSERT INTO ingredients (id_menu, nom, description)
            VALUES (1, 'Pain burger', 'Pain rond pour hamburger'),
                 (1, 'Bœuf haché', 'Viande de bœuf hachée pour burger'),
                 (1, 'Laitue', 'Feuilles de laitue pour burger'),
                 (1, 'Tomate', 'Tranches de tomate pour burger'),
                 (1, 'Fromage', 'Tranches de fromage pour burger'),
                 (1, 'Sauce', 'Sauce ketchup et moutarde pour burger'),
                 (2, 'Pâte à pizza', 'Base de la pizza'),
                 (2, 'Sauce tomate', 'Sauce pour la pizza'),
                 (2, 'Mozzarella', 'Fromage à pizza'),
                 (2, 'Basilic', 'Herbe aromatique pour pizza'),
                 (3, 'Laitue romaine', 'Feuilles de laitue pour salade'),
                 (3, 'Croûtons', 'Pain grillé coupé en cubes'),
                 (3, 'Parmesan', 'Fromage râpé pour salade'),
                 (3, 'Poulet grillé', 'Blanc de poulet grillé pour salade'),
                 (3, 'Sauce césar', "Sauce à base de mayonnaise, de moutarde, d'ail et de jus de citron"),
                 (4, 'Pâtes', 'Pâtes fraîches'),
                 (4, 'Sauce bolognaise', "Sauce à base de viande hachée, de tomates, d'oignons et d'épices"),
                 (4, 'Parmesan', 'Fromage râpé pour les pâtes'),
                 (5, 'Tortilla', 'Pain plat pour tacos'),
                 (5, 'Poulet grillé', 'Blanc de poulet grillé pour tacos'),
                 (5, 'Laitue', 'Feuilles de laitue pour tacos'),
                 (5, 'Tomate', 'Tranches de tomate pour tacos'),
                 (5, 'Fromage râpé', 'Fromage râpé pour tacos'),
                 (5, 'Sauce piquante', 'Sauce épicée pour tacos'),
                 (6, 'Tortilla', 'Pain plat pour tacos'),
                 (6, 'Crevettes grillées', 'Crevettes grillées pour tacos'),
                 (6, 'Laitue', 'Feuilles de laitue pour tacos'),
                 (6, 'Tomate', 'Tranches de tomate pour tacos'),
                 (6, 'Fromage râpé', 'Fromage râpé pour tacos'),       
                 (7, 'Saucisse', 'Saucisse de porc cuite'),
                 (7, 'Moutarde', 'Condiment de moutarde jaune'),
                 (7, 'Ketchup', 'Sauce tomate sucrée'),
                 (7, 'Oignons', 'Oignons blancs frais coupés en dés'),
                 (8, 'Pâtes', 'Pâtes longues et fines'),
                 (8, 'Crème', 'Crème fraîche épaisse'),
                 (8, 'Lardons', 'Petits dés de poitrine de porc fumée'),
                 (8, 'Fromage', 'Fromage parmesan râpé'),
                 (9, 'Pain', 'Pain de mie grillé'),
                 (9, 'Poulet grillé', 'Blancs de poulet grillés'),
                 (9, 'Bacon', 'Tranches de bacon croustillant'),
                 (9, 'Laitue', 'Feuilles de laitue verte croustillantes'),
                 (9, 'Tomate', 'Tranches de tomate juteuses'),
                 (9, 'Mayonnaise', "Sauce émulsionnée à base de jaune d’œuf"),
                 (10, 'Nachos', 'Chips de maïs croustillantes'),
                 (10, 'Fromage fondu', 'Fromage fondu épais'),
                 (10, 'Jalapeños', 'Piments jalapeños en conserve'),
                 (10, 'Salsa', 'Sauce tomate épicée'),
                 (11, 'Burrito', 'Tortilla de blé moelleuse'),
                 (11, 'Légumes grillés', 'Poivrons et oignons grillés'),
                 (11, 'Riz', 'Riz blanc cuit'),
                 (11, 'Haricots noirs', 'Haricots noirs cuits'),
                 (11, 'Salsa', 'Sauce tomate épicée');
              
          INSERT INTO commentaires (id_menu, id_utilisateur, nom_utilisateur, email, commentaire)
          VALUES (1, 1, 'Jean Dupont', 'jean.dupont@email.com', 'La salade de chèvre chaud était délicieuse!'),
                 (2, 1, 'Jean Dupont', 'jean.dupont@email.com', 'J''ai beaucoup aimé la soupe à l''oignon.'),
                 (3, 2, 'Alice Martin', 'alice.martin@email.com', 'Le steak frites était cuit à la perfection.'),
                 (4, 2, 'Alice Martin', 'alice.martin@email.com', 'Le poulet rôti était un peu sec, mais les légumes étaient bons.'),
                 (5, 3, 'Bruno Leroy', 'bruno.leroy@email.com', 'Le filet de saumon était excellent.'),
                 (6, 3, 'Bruno Leroy', 'bruno.leroy@email.com', 'Le tiramisu est le meilleur que j''ai jamais mangé!'),
                 (7, 1, 'Jean Dupont', 'jean.dupont@email.com', 'La crème brûlée était vraiment délicieuse.'),
                 (8, 2, 'Alice Martin', 'alice.martin@email.com', 'La tarte aux pommes était très savoureuse.'),
                 (9, 3, 'Bruno Leroy', 'bruno.leroy@email.com', 'La panna cotta avait une texture parfaite.'),
                 (10, 1, 'Jean Dupont', 'jean.dupont@email.com', 'La mousse au chocolat était un peu trop sucrée à mon goût.');
          
          INSERT INTO commandes (id_utilisateur, id_menu, quantite, etat_commande)
          VALUES (1, 1, 2, 'en cours'),
                 (2, 4, 1, 'en cours');
                 
          INSERT INTO paiements (id_utilisateur, montant, etat_paiement, type_carte_credit, numero_carte_credit, nom_titulaire_carte, date_expiration_carte, code_securite)
          VALUES (1, 15.0, 'effectué', 'Visa', '1234567890123456', 'Jean Dupont', datetime('now', '+2 years'), '123'),
                 (2, 14.0, 'effectué', 'Mastercard', '2345678901234567', 'Alice Martin', datetime('now', '+3 years'), '234');
          
          INSERT INTO livraisons (id_utilisateur, nom_utilisateur, adresse_livraison, instructions_speciales, etat_livraison)
          VALUES (1, 'Jean Dupont', '123 Rue des Fleurs, 75000 Paris', 'Appartement 4B, code d''entrée 1234', 'En cours'),
                 (2, 'Marie Martin', '55 Avenue des Champs, 75000 Paris', 'Maison blanche avec portail rouge', 'Livré'),
                 (3, 'Lucas Durand', '9 Impasse des Lilas, 75000 Paris', 'Sonner à l''interphone', 'En cours'),
                 (2, 'Sophie Leroux', '27 Boulevard des Tilleuls, 75000 Paris', '3ème étage, gauche', 'Livré'),
                 (1, 'Emma Petit', '88 Rue des Érables, 75000 Paris', 'Bâtiment B, Appartement 12', 'Livré'),
                 (3, 'Hugo Moreau', '16 Allée des Peupliers, 75000 Paris', 'Maison verte, laisser le colis dans la véranda', 'En cours'),
                 (1, 'Léa Simon', '33 Rue des Églantines, 75000 Paris', 'Porte d''entrée bleue', 'Livré'),
                 (3, 'Gabriel Bernard', '2 Avenue des Roses, 75000 Paris', 'Code d''entrée 5678, 2ème étage', 'En cours'),
                 (1, 'Zoé Lefèvre', '19 Rue des Tournesols, 75000 Paris', 'La dernière maison sur la droite', 'Livré'),
                 (1, 'Arthur Fournier', '5 Place des Mimosas, 75000 Paris', 'Appartement 7, monter au 1er étage', 'En cours');
          
          
          INSERT INTO reservations (id_utilisateur, date_reservation, nombre_personnes, etat_reservation, instructions_speciales)
          VALUES (1, datetime('now', '+1 day'), 4, 'confirmée', 'Table près de la fenêtre'),
                 (2, datetime('now', '+3 days'), 2, 'confirmée', NULL),
                 (3, datetime('now', '+5 days'), 6, 'confirmée', 'Table ronde');
                 
          INSERT INTO etoiles (id_utilisateur, id_menu, nb_etoiles)
          VALUES (1, 1, 5),
                 (1, 2, 4),
                 (2, 1, 5),
                 (2, 3, 3),
                 (3, 2, 4),
                 (3, 4, 5),
                 (1, 3, 3),
                 (2, 5, 4),
                 (1, 5, 5),
                 (3, 4, 4);
          
          INSERT INTO promotions (id_menu, reduction, date_debut, date_fin)
          VALUES (1, 0.5, datetime('now', '-7 days'), datetime('now', '+7 days')),
                 (2, 0.3, datetime('now', '-7 days'), datetime('now', '+7 days'));
                 
          INSERT INTO fournisseurs (nom, adresse, email, telephone, description)
          VALUES ('Fournisseur Légumes', '1 Rue des Légumes, Paris', 'contact@fournisseur-legumes.com', '0111111111', 'Fournisseur de légumes frais'),
                 ('Fournisseur Viandes', '2 Rue de la Boucherie, Paris', 'contact@fournisseur-fruit.com','46544575477', 'Fournisseur de fruit');
                 
          INSERT INTO fournitures (id_fournisseur, nom, description, quantite, date_achat)
          VALUES (1, 'Tomates', 'Tomates fraîches', 100, datetime('now', '-1 day')),
                 (1, 'Salade', 'Salade verte', 50, datetime('now', '-1 day')),
                 (2, 'Steaks de boeuf', 'Steaks de boeuf de qualité', 20, datetime('now', '-2 days')),
                 (2, 'Filets de saumon', 'Filets de saumon frais', 10, datetime('now', '-2 days')),
                 (1, 'Carottes', 'Carottes bio', 30, datetime('now', '-3 days'));
          
          INSERT INTO stocks (id_fourniture, quantite, date_mise_a_jour)
          VALUES (1, 80, datetime('now')),
                 (2, 40, datetime('now')),
                 (3, 18, datetime('now')),
                 (4, 8, datetime('now')),
                 (5, 25, datetime('now'));
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
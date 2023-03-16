-- SQLite
SELECT o.quantite, c.nom_client FROM orders o
RIGHT JOIN clients c on c.id_client=o.id_client

SELECT 
                m.nom, 
                m.prix, 
                o.quantite, 
                m.description, 
                m.image_url, 
                m.id_menu
            FROM menus m 
            LEFT JOIN orders o ON m.id_menu = o.id_menu 
            -- JOIN clients c ON o.id_client = c.id_client 
            WHERE m.id_menu = 2

            SELECT 
                m.nom, m.prix, 
                o.quantite, 
                m.description, 
                m.image_url, 
                m.id_menu,
                c.id_client,
                avg(e.nb_etoil) 
                as moyenne_etoil,
                m.id_menu IN (
                    SELECT  id_menu
                    FROM orders
                    WHERE id_client = 2 
                 ) AS estAjoute
            FROM menus m 
            INNER JOIN orders o ON m.id_menu = o.id_menu 
            LEFT JOIN clients c ON c.id_client = o.id_client
            LEFT JOIN etoils e ON e.id_menu= m.id_menu
            WHERE m.id_menu = 3
            


            SELECT 
                avg(e.nb_etoil) as moyenne_etoil
            FROM etoils e
            JOIN menus m ON m.id_menu= e.id_menu
            WHERE e.id_menu = 1
            -- commentaire
        SELECT 
            co.commentaire, 
            co.created_at,
            c.nom_client, 
            m.nom ,
            e.nb_etoil
        FROM commentaires co
        JOIN clients c ON c.id_client= co.id_client
        JOIN menus m ON m.id_menu= co.id_menu
        JOIN etoils e ON e.id_client= co.id_client
        WHERE m.id_menu=1

    -- note 

    SELECT 
        avg(e.nb_etoil) as moyenne_etoil ,
        m.nom
    FROM etoils e
    JOIN menus m ON m.id_menu= e.id_menu
    WHERE e.id_menu=2
        

SELECT m.nom, o.quantite, m.description, m.image_url, m.id_menu, c.id_client
FROM menus m
JOIN orders o ON m.id_menu = o.id_menu
JOIN clients c ON c.id_client = o.id_client
WHERE m.id_menu = 3;

SELECT 
                m.nom, m.prix, 
                o.quantite, 
                m.description, 
                m.image_url, 
                m.id_menu
            FROM menus m 
            JOIN orders o ON m.id_menu = o.id_menu 
            JOIN clients c ON o.id_client = c.id_client 
            WHERE c.id_client = ? AND o.quantite >= 0  ;

SELECT 
                m.nom, 
                m.prix, 
                o.quantite, 
                m.description, 
                m.image_url, 
                m.id_menu
            FROM menus m 
            LEFT JOIN orders o ON m.id_menu = o.id_menu 
            JOIN clients c ON o.id_client = c.id_client 
            WHERE c.id_client = 1



SELECT DISTINCT
                m.nom, 
                m.description, 
                m.prix,
                m.image_url,
                m.created_at,
                m.id_menu,
                m.id_menu IN (
                   SELECT id_menu
                   FROM orders
                   WHERE id_client = 2
                ) AS estAjoute 
            FROM menus m 
            LEFT JOIN orders o ON o.id_menu = m.id_menu

    
    INSERT INTO payements (id_client, montant, adresse_livraison, numero_carte, nom_titulaire_cart, date_expiration, code_securite)
    VALUES(11, 25.85, '65 rue de la arpe', 12345678, 'Omar', '2024-03-02', '12s')


         SELECT 
                m.nom, m.prix, 
                o.quantite, 
                m.description, 
                m.image_url, 
                -- c.id_client,
                m.id_menu,
                o.id_order,
                m.id_menu IN (
                    SELECT id_menu
                    FROM orders
                    WHERE id_client = 10
                 ) AS estAjoute
            FROM menus m 
            LEFT JOIN orders o ON m.id_menu = o.id_menu 
            -- LEFT JOIN clients c ON c.id_client = o.id_client
            WHERE m.id_menu = 1

        SELECT sum( quantite) AS quantite FROM orders o
                JOIN menus m ON m.id_menu= o.id_menu
                WHERE id_client = 1

            DELETE FROM orders
                WHERE id_client = 11

        SELECT 
                co.commentaire, 
                co.created_at,
                c.nom_client, 
                m.nom ,
                e.nb_etoil
            FROM commentaires co
            JOIN clients c ON c.id_client= co.id_client
            JOIN menus m ON m.id_menu= co.id_menu
            JOIN etoils e ON e.id_client= co.id_client
            WHERE m.id_menu =12
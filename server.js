import 'dotenv/config';
import express, { json } from 'express';
import { create } from 'express-handlebars';
import { engine } from 'express-handlebars';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import session from 'express-session';
import memorystore from 'memorystore';
import passport from 'passport';
import {getPlatsParUtilisateurPanier , addMenuClient, removePlatParClient,removePlat, getCommentaire, getUtilisateurs, getMenus, voirPlat, getSommePlatsParUtilisateur, getQuantitePlatsParUtilisateur, quantitePlus, quantiteMoin, addMenu, addCommentaire, addEtoil, getMoyenneEtoil, getCommentaireParPlat, addPaiementParClient, addLivraisonClient, removePanierClient, rechercherMenus, getPaiement, updateMenu, getIngredientsParMenu, addIngredient, getCommandes, getFounisseurFourniture, getCategorieMenu} from './model/requetes.js';
import { addUtilisateur, removeUtilisateur } from './model/utilisateur.model.js';
import { isEmailValide, isPasswordValide, contactValide } from './validation.js';
import './authentification.js';

// Création du serveur
let app = express();

// Initialisation de handlebars
app.engine('handlebars', engine({
    helpers: {
        afficheArgent: (nombre) => nombre && nombre.toFixed(2),
        afficheEtoil: (nombre) => nombre && nombre.toFixed(1),
        // afficheEtoil: (tab) => tab && tab.length.toFixed(1)
    }
}));

// app.engine('handlebars', handlebars.engine);

// Mettre l'engin handlebars comme engin de rendu
app.set('view engine', 'handlebars');
// Configuration de handlebars
app.set('views', './views');

// Création du constructeur de la base de données de session
const MemoryStore = memorystore(session);

// Ajout de middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(json());
app.use(
	session({
		cookie: { maxAge: 1800000 },
		name: process.env.npm_package_name,
		store: new MemoryStore({ checkPeriod: 1800000 }),
		resave: false,
		saveUninitialized: false,
		secret: process.env.SESSION_SECRET,
	}),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));


// Programmation de routes

let limite=5;
let fraisLivaison=5;
app.post('/menusPlus', async (request, response) =>{
    console.log(request.body);
    limite=request.body.limit;
    response.status(200).end();
});

app.get('/', (request, response) => {
    response.render('connexion', {
        titre: 'connexion',
        styles: ['/css/connexion.css'],
        scripts: ['/js/login.js', '/js/client.js']
    });
})

app.post('/', async (request, response, next) =>{
    if (isEmailValide(request.body.emailClient) && 
        isPasswordValide(request.body.motDePasseClient) ) {
		passport.authenticate('local', (error, utilisateur, info) => {
			if (error) {
				next(error);
			}
             else if (!utilisateur) {
				response.status(401).json(info);
			} else {
				request.logIn(utilisateur, (error) => {
					if (error) {
						next(error);
					} else {
						response.status(200).end();
					}
				});
			}
		})(request, response, next);
	} else {
		response.status(400).end();
	}
});

app.post('/inscription', async (request, response) => {
	if (await contactValide(request.body)) {
		try {
			await addUtilisateur(1 ,request.body.nom, request.body.prenom, request.body.mot_passe, request.body.courriel);
			response.status(200).end();
		} catch (error) {
			if (error.code === 'SQLITE_CONSTRAINT') {
				response.status(409).end();
			} else {
				next(error);
			}
		}
	}else{
        response.status(400).end();
    }
});
app.get('/home', async (request, response) => {
    if (request.user) {
        let id_utilisateur=request.user.id_utilisateur
        response.render('accueil', {
            titre: 'Accueil',
            plats: await getMenus(id_utilisateur, limite),
            nom_client: request.user.nom,
            styles: ['/css/header.css','/css/footer.css','/css/main.css'],
            nbplat: (await getPlatsParUtilisateurPanier(id_utilisateur)).length,
            commentaires: await getCommentaire(),
            type: request.user.type === 'Admin',
            connecter: request.user,
            scripts: ['/js/index.js','/js/panier.js','/js/voirPlus.js'],
            james:request.originalUrl == '/home'
    
        });
    }
    else{
        response.render('accueil', {
            titre: 'Accueil',
            plats: await getMenus(0, limite),
            styles: ['/css/header.css','/css/footer.css','/css/main.css'],
            nbplat: (await getPlatsParUtilisateurPanier(0)).length,
            commentaires: await getCommentaire(),
            scripts: ['/js/index.js','/js/panier.js','/js/voirPlus.js'],
            james:request.originalUrl == '/home'
    
        });
        
    }
})

let nom_menu;
app.post('/recherche', async (request, response) =>{
    if (request.user) {
        nom_menu=request.body.nom_menu;
    }else{
        response.status(401).end();
    }
});

app.get('/trouver-menu', async(request, response) => {
    if (request.user) {
        response.render('rechercher', {
            titre: 'rechercher',
            plats: await rechercherMenus(request.user.id_utilisateur, nom_menu),
            nbplat: (await getPlatsParUtilisateurPanier(request.user.id_utilisateur)).length,
            styles: ['/css/rechercher.css','/css/header.css', '/css/footer.css'],
            scripts: ['/js/index.js','/js/panier.js'],
            connecter: request.user,
            type: request.user.type === 'Admin',
            james:request.originalUrl == '/trouver-menu'
        });
        
    } 
    else{
        response.status(401).redirect('/');
    }

})
app.get('/admin/commandes', async(request, response) => {
    if (request.user) {
        response.render('commandes', {
            titre: 'Admin',
            type: request.user.type== 'Admin',
            commandes: await getCommandes(),
            styles: ['/css/admin.css','/css/style.css'],
            scripts: ['/js/admin.js']
        });
        
    }
    else{
        response.status(401).redirect('/');
    }

})
app.get('/admin/fournisseur', async(request, response) => {
    if (request.user) {
        response.render('fournisseur', {
            titre: 'Admin',
            type: request.user.type== 'Admin',
            fournisseur: await getFounisseurFourniture(),
            styles: ['/css/admin.css','/css/style.css'],
            // scripts: ['/js/admin.js']
        });
        
    }
    else{
        response.status(401).redirect('/');
    }

})

app.get('/admin/utilisateurs', async (request, response) => {
    if (request.user) {
        response.render('utilisateurs', {
            titre: 'Admin',
            type: request.user.type== 'Admin',
            clients: await getUtilisateurs(),
            styles: ['/css/admin.css'],
            scripts: ['/js/admin.js']
        });
        
    }
    else{
        response.status(401).redirect('/');
    }
})


app.get('/admin/menus', async (request, response) => {
    if (request.user) {
        let id_utilisateur=request.user.id_utilisateur
        response.render('menus', {
            titre: 'Admin',
            menus: await getMenus(id_utilisateur, 100),
            categories: await getCategorieMenu(),
            type: request.user.type== 'Admin',
            styles: ['/css/admin.css','/css/style.css'],
            scripts: ['/js/admin.js'],
        });
        
    }
    else{
        response.status(401).redirect('/');
    }
})

app.get('/admin', async(request, response) => {
    if (request.user) {
        console.log(request.user);
        response.render('paiement_admin', {
            titre: 'Historique des paiement',
            paiements: await getPaiement(),
            type: request.user.type== 'Admin',
            styles: ['/css/admin.css','/css/style.css']
        });
        
    }
    else{
        response.status(401).redirect('/');
    }
})

app.patch('/quantitePlus', async (request, response) => {
    if (request.user) {
        let id_utilisateur=request.user.id_utilisateur
        await quantitePlus(id_utilisateur, request.body.id_menu)
        console.log(request.body);
        response.status(200).end();
        
    } else{
        response.status(401).redirect('/');
    }
});
app.patch('/quantiteMoin', async (request, response) => {
    if (request.user) {
        let id_utilisateur=request.user.id_utilisateur
        await quantiteMoin(id_utilisateur, request.body.id_menu)
        console.log(request.body);
        response.status(200).end();       
    } 
    else{
        response.status(401).redirect('/');
    }
});

app.get('/panier', async (request, response) => {
    if (request.user) {
        let id_utilisateur=request.user.id_utilisateur
        response.render('panier', {
            titre: 'Panier',
            plats: await getPlatsParUtilisateurPanier(id_utilisateur),
            nbplat: (await getPlatsParUtilisateurPanier(id_utilisateur)).length,
            sommeArticleClient: (await getSommePlatsParUtilisateur(id_utilisateur))[0].somme,
            quantiteArticleClient: (await getQuantitePlatsParUtilisateur(id_utilisateur))[0].quantite,
            sommeArticleClientPlusLivraison: ((await getSommePlatsParUtilisateur(id_utilisateur))[0].somme + fraisLivaison).toFixed(2),
            nom_client: request.user.nom,
            connecter: request.user,
            type: request.user.type === 'Admin',
            styles: ['/css/panier.css','/css/header.css','/css/footer.css'],
            scripts: ['/js/index.js','/js/panier.js'],
            james:request.originalUrl =='/panier'
        });
        
    }else{
        response.status(401).redirect('/');
    }
})

app.patch('/updatePlat', async (request, response) =>{
    if (request.user) {
        console.log(request.body);
        
        await updateMenu(          
            request.body.nom,
            request.body.description,
            request.body.prix,
            `/images/img_plats/${request.body.img_name}`,
            request.body.id_menu,
            request.body.id_categorie_menu
        );
            response.status(200).end();
        
    }else{
        response.status(401).end();
    }
});

app.post('/ajout', async (request, response) =>{
    if (request.user) {
        
        let id_utilisateur =request.user.id_utilisateur
        let succes= await addMenuClient(id_utilisateur, request.body.id_menu, 1, "en cours");
        
            console.log(request.body);
        if (succes) {
            response.status(200).end();
        }
        
    }else{
        response.status(401).end();
    }
});
app.post('/ajouterUnPlat', async (request, response) =>{
    if (request.user) {
        console.log(request.body);
        await addMenu(
            request.body.nom,
            request.body.description,
            request.body.prix,
            `/images/img_plats/${request.body.image_url}`,
            request.body.id_categorie_menu

        )
        response.status(200).end();
    }
    else{
        response.status(401).redirect('/');
    }
    }
);
app.post('/ajouerIngredient', async (request, response) =>{
    if (request.user) {
        console.log(request.body);
        await addIngredient(
            request.body.id_menu,
            request.body.nom,
            request.body.description           
        )
        response.status(200).end();
    }
    else{
        response.status(401).redirect('/');
    }
    }
);
app.delete('/supprimerUnPlat', async (request, response) =>{
    if (request.user) {
        await removePlat(request.body.id_menu)
        response.status(200).end();
        
    }else{
        response.status(401).redirect('/');
    }
});
app.delete('/supprimerUtilisateur', async (request, response) =>{
    if (request.user) {
        await removeUtilisateur(request.body.id_utilisateur);
        response.status(200).end();
        
    }else{
        response.status(401).redirect('/');
    }
});
app.delete('/supp', async (request, response) =>{
    console.log(request.body);
    if (request.user) {
        let id_utilisateur=request.user.id_utilisateur
        await removePlatParClient(id_utilisateur, request.body.id_menu)
        response.status(200).end();
    }else{
        response.status(401).redirect('/');
    }
});

app.get('/adresse', (request, response) => {
    // console.log(request.originalUrl)
    if (request.user) {
        response.render('adresse', {
            titre: 'adresse',
            type: request.user.type === 'Admin',
            styles: ['/css/adresse.css'],
            james:request.originalUrl.toLowerCase === '/panier'
        });
        
    }else{
        response.status(401).redirect('/');
    }
})


app.get('/informations', async (request, response) => {
    // console.log(request.originalUrl)
    if (request.user) {
        let id_utilisateur=request.user.id_utilisateur
        response.render('informations', {
            titre: 'informations',
            fraisLivaison: fraisLivaison,
            plats: await getPlatsParUtilisateurPanier(id_utilisateur),
            sommeArticleClient: (await getSommePlatsParUtilisateur(id_utilisateur))[0].somme,
            quantiteArticleClient: (await getQuantitePlatsParUtilisateur(id_utilisateur))[0].quantite,
            sommeArticleClientPlusLivraison: ((await getSommePlatsParUtilisateur(id_utilisateur))[0].somme + fraisLivaison).toFixed(2),
            type: request.user.type === 'Admin',
            scripts: ['/js/information.js'],
            styles: ['/css/informations.css'],
            james:request.originalUrl.toLowerCase === '/informations'
        });
        
    }else{
        response.status(401).redirect('/');
    }
})
let infos;
app.post('/information', async (request, response) => {
    if (request.user) {
        
        response.status(200).end();
        console.log(request.body);
        infos=request.body;
    }else{
        response.status(401).redirect('/');
    }

});


app.post('/paiement', async (request, response) => {   
    if (request.user) {
        let succes= await addPaiementParClient(
            request.user.id_utilisateur,
            request.body.montant,
            "effectué",
            request.body.type_carte_credit,
            request.body.numero_carte_credit,
            request.body.nom_titulaire_carte,
            request.body.date_expiration_carte,
            request.body.code_securite
        )
        let succes2 = await addLivraisonClient(
            request.user.id_utilisateur,
            request.user.prenom+' '+request.user.nom,
            request.body.adresse_livraison,
            request.body.instructions_speciales,
            "En cours"
        )
        
        if (succes && succes2) {
            
            await removePanierClient(request.user.id_utilisateur)
            response.status(200).end();  
        }

    }else{
        response.status(401).end();
    }
});
app.get('/informations/livraison', async (request, response) => {
    // console.log(request.originalUrl)
    if (request.user) {
        let id_utilisateur=request.user.id_utilisateur
        response.render('livraison', {
            titre: 'Livraison',
            fraisLivaison: fraisLivaison,
            plats: await getPlatsParUtilisateurPanier(id_utilisateur),
            sommeArticleClient: (await getSommePlatsParUtilisateur(id_utilisateur))[0].somme,
            quantiteArticleClient: (await getQuantitePlatsParUtilisateur(id_utilisateur))[0].quantite,
            sommeArticleClientPlusLivraison: ((await getSommePlatsParUtilisateur(id_utilisateur))[0].somme + fraisLivaison).toFixed(2),
            emailClient: request.user.email,
            info: infos.adresse+', '+infos.appatement+', '+infos.code_postal+', '+infos.ville+', '+infos.pays,
            instructions_speciales: infos.instructions_speciales,
            type: request.user.type === 'Admin',
            scripts: ['/js/livraison.js'],
            styles: ['/css/livraison.css'],
            james:request.originalUrl.toLowerCase === '/livraison'
        });
        
    }else{
        response.status(401).redirect('/');
    }
})
let info_livraison;
app.post('/livraison', async (request, response) => {
    if (request.user) {
        
        response.status(201).end();
        // console.log(request.body);
        info_livraison=request.body;
    }else{
        response.status(401).redirect('/');
    }
});
app.get('/informations/livraison/paiement', async (request, response) => {
    // console.log(request.originalUrl)
    if (request.user) {
        let id_utilisateur=request.user.id_utilisateur
        response.render('paiement', {
            titre: 'paiement',
            fraisLivaison: fraisLivaison,
            plats: await getPlatsParUtilisateurPanier(id_utilisateur),
            sommeArticleClient: (await getSommePlatsParUtilisateur(id_utilisateur))[0].somme,
            quantiteArticleClient: (await getQuantitePlatsParUtilisateur(id_utilisateur))[0].quantite,
            sommeArticleClientPlusLivraison: ((await getSommePlatsParUtilisateur(id_utilisateur))[0].somme + fraisLivaison).toFixed(2),
            emailClient: request.user.email,
            info: infos.adresse+', '+infos.appatement+', '+infos.code_postal+', '+infos.ville+', '+infos.pays,
            instructions_speciales: infos.instructions_speciales,
            type: request.user.type === 'Admin',
            styles: ['/css/paiement.css'],
            scripts: ['/js/paiement.js']
            // james:request.originalUrl === '/informations/livraison/paiement'
        });
        
    }else{
        response.status(401).redirect('/');
    }
})
app.get('/paiement/valider', async (request, response) => {
    // console.log(request.originalUrl)
    if (request.user) {
        let id_client=request.user.id_client
        response.render('paiement_valider', {
            titre: 'paiement_valider',
            styles: ['/css/paiement_valider.css'],
            // james:request.originalUrl.toLowerCase === '/paiement/valider'
        });
        
    }else{
        response.status(401).redirect('/');
    }
})

app.get('/inscription', (request, response) => {
    response.render('inscription', {
        titre: 'inscription',
        styles: ['/css/inscription.css'],
        scripts: ['/js/client.js']
    });
})


app.get('/plat/:index', async(request, response)=>{
    if (request.user) {
        let id_utilisateur=request.user.id_utilisateur
        let menu =await voirPlat(id_utilisateur, request.params.index)
        if (menu.length>1) {
            for (let i = 0; i < menu.length; i++) {
                if (menu[i].id_utilisateur == id_utilisateur) {
                    menu=menu.splice(i, 1)
                }
            }
        }
        
        // moyenneEtoil: Array((await getMoyenneEtoil(request.params.index)).moyenne_etoil).fill(true),
        response.render('plat', {
            titre: 'plat',
            nbplat: (await getPlatsParUtilisateurPanier(request.user.id_utilisateur)).length,
            menu: menu,
            fraisLivaison: fraisLivaison,
            moyenneEtoilNum: (await getMoyenneEtoil(request.params.index)).moyenne_etoil,
            moyenneEtoil: Array(Math.round((await getMoyenneEtoil(request.params.index)).moyenne_etoil)).fill(true),
            getCommentaireParPlat: await getCommentaireParPlat(request.params.index),
            ingredients: await getIngredientsParMenu(request.params.index),
            nom_client: request.user.nom,
            type: request.user.type === 'Admin',
            connecter: request.user,
            styles: ['/css/plat.css','/css/header.css','/css/footer.css'],
            scripts: ['/js/index.js', '/js/plat.js', '/js/panier.js'],
            james:request.originalUrl == `/plat/${request.params.index}`,
        })
    }else{
        response.status(401).redirect('/');
    }
})

app.post('/commentaire', async (request, response) =>{
    console.log(request.body);
        if (request.user) {
            
            let succes= await addCommentaire(
                Number(request.body.id_menu),
                request.user.id_utilisateur,
                request.body.nom_utilisateur,
                request.body.email,
                request.body.commentaire
            );
            if (succes) {
                response.status(200).end();             
            }
        }else{
            response.status(401).redirect('/');
        }
    }
);
app.post('/ajoute-note', async (request, response) =>{
    console.log(request.body);
        if (request.user) {
            
            let succes= await addEtoil(
                request.body.id_menu,
                request.user.id_utilisateur,
                request.body.nb_etoiles
            );
            if (succes) {
                response.status(200).end();               
            }
        }else{
            response.status(401).redirect('/');
        }
    }
);

app.post('/deconnexion', (request, response, next) => {
	request.logOut((error) => {
		if (error) {
			next(error);
		} else {
			response.redirect('/');
		}
	});
});

// Démarrage du serveur
app.listen(process.env.PORT);
console.log('Serveur démarré: http://localhost:' + process.env.PORT);

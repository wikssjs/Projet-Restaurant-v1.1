import passport from 'passport';
import { Strategy } from 'passport-local';
import { compare } from 'bcrypt';
import { getClientByEmail } from './model/requetes.js';

let config = {
    usernameField: 'emailClient',
    passwordField: 'motDePasseClient'
}

passport.use(new Strategy(config, async (emailClient, motDePasseClient, done) => {
    try {
        let utilisateur = await getClientByEmail(emailClient);
        
        if(!utilisateur) {
            return done(null, false, {erreur: 'erreur_courriel_utilisateur'});
        }
        let valide = await compare(motDePasseClient, utilisateur.mot_de_passe);
        if(!valide) {
            return done(null, false, {erreur: 'erreur_mot_de_passe'})
        }
        
        return done(null, utilisateur);
    }
    catch(error) {
        return done(error);
    }
}));

passport.serializeUser((utilisateur, done) => {
    done(null, utilisateur.email);
});

passport.deserializeUser(async (email, done) => {

    try {
        let utilisateur = await getClientByEmail(email);
        done(null, utilisateur);
    }
    catch(error) {
        done(error);
    }
});


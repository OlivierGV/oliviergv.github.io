import { useEffect, useState } from "react"
import { TextField, FormControl, Button } from "@mui/material"
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import DonneesPersistantes from "../util/DonneesPersistantes";
import { FormattedMessage } from "react-intl";

// connexion d'un utilisateur
export const Authentification = () => {
    const [email, setEmail] = useState("")
    const [motDePasse, setMotDePasse] = useState("")
    const [messageErreur, setMessageErreur] = useState(false)

    // changement de route
    const naviguer = useNavigate()

    // faire la vérification au départ de l'app si les champs sont pré-remplis
    useEffect(() => {
        champsValides()
    }, [])

    // vérifier les identifiants
    async function seConnecter() {
        try {
            const response = await axios.post(
                "https://api-v3-grul.onrender.com/generatetoken",
                {
                    userlogin: {
                      email: email,
                      password: motDePasse
                    }
                }
            );

            if (response.status === 200 && response.data.token) {
                // garder le jwt token en cache
                DonneesPersistantes.setToken(response.data.token);
                naviguer("/");
            } else {
                // rétroaction
                setMessageErreur(true)
                console.log("Email : " + email + ", Password : " + motDePasse);
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
        }
    }

    // vérifier l'adresse courriel
    function gestionEmail() {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (email.length <= 0) {
            return <FormattedMessage id="app.formulaire.champ.vide"/>
        } else if (email.length > 255 || !regex.test(email)) {
            return <FormattedMessage id="app.formulaire.email.invalide"/>
        }
        return "";
    }

    // vérifier le mot de passe
    function gestionMotDePasse() {
        if (motDePasse.length <= 0 ) {
            return <FormattedMessage id="app.formulaire.champ.vide"/>
        } else if (motDePasse.length > 255) {
            return <FormattedMessage id="app.formulaire.mdp.invalide"/>
        }
        return ""
    }

    // vérifier que les champs sont remplis
    function champsValides() : boolean {
        if(gestionEmail() == "" && gestionMotDePasse() == ""){
            return true
        }
        return false
    }

    // ce qu'on affiche
    return (
        <form>
        <FormControl fullWidth>
        <FormattedMessage id="app.connexion.titre"/>
        <br />
        { messageErreur && <FormattedMessage id="app.formulaire.invalide"/>}
        <br />
        <TextField
            label={<><FormattedMessage id="app.courriel"/>*</>}
            variant="outlined"
            helperText={gestionEmail()}
            value={email} 
            onChange={(e) => {
                setEmail(e.target.value)
            }}
        />
        <br />
        <TextField
            label={<><FormattedMessage id="app.motdepasse"/>*</>}
            variant="outlined"
            helperText={gestionMotDePasse()}
            value={motDePasse} 
            onChange={(e) => {
                setMotDePasse(e.target.value)
            }}
            type="password"
        />
        <br />
        <Button 
          variant="contained" 
          color="primary" 
          type="button"
          disabled={!champsValides() ? true : false}
          onClick={seConnecter}
        >
        <FormattedMessage id="app.connexion.soumettre"/>
        </Button>
      </FormControl>
        </form>
    )
}

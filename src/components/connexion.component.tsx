import { useState } from "react"
import { TextField, FormControl, Button, Typography } from "@mui/material"
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import DonneesPersistantes from "../util/DonneesPersistantes";

export const Authentification = () => {
    const [email, setEmail] = useState("")
    const [motDePasse, setMotDePasse] = useState("")
    const [messageErreur, setMessageErreur] = useState("")

    const naviguer = useNavigate()

    /**
     * Fonction pour se connecter avec l'email et le mot de passe.
     * @returns 
     */
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
                DonneesPersistantes.setToken(response.data.token);
                naviguer("/");
            } else {
                setMessageErreur("Identifiant ou mot de passe invalide.")
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
        }
    }

    /**
     * Vérifier le token.
     * @returns 
     */
    function gestionEmail() {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (email.length <= 0) {
            return "Champ obligatoire.";
        } else if (email.length > 255) {
            return "Email invalide : trop long.";
        } else if (!regex.test(email)) {
            return "Email invalide : format incorrect.";
        }
        return "";
    }

    function gestionMotDePasse() : string {
        if (motDePasse.length <= 0 ) {
            return "Champ obligatoire."
        } else if (motDePasse.length > 255) {
            return "mot de passe invalide."
        }
        return ""
    }

    function champsValides() : boolean {
        if(gestionEmail() == "" && gestionMotDePasse() == ""){
            return true
        }
        return false
    }

    return (
        <form>
        <FormControl fullWidth>
        <h3>Connexion</h3>
        <br />
        { messageErreur.length > 0 && <Typography>{messageErreur}</Typography>}
        <br />
        <TextField
            label="Adresse courriel*"
            variant="outlined"
            helperText={gestionEmail()}
            value={email} 
            onChange={(e) => {
                setEmail(e.target.value)
                setMessageErreur("")
            }}
        />
        <br />
        <TextField
            label="Mot de passe*"
            variant="outlined"
            helperText={gestionMotDePasse()}
            value={motDePasse} 
            onChange={(e) => {
                setMotDePasse(e.target.value)
                setMessageErreur("")
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
        Se connecter
        </Button>
      </FormControl>
        </form>
    )
}

import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DonneesPersistantes from '../util/DonneesPersistantes';
import {
    FormattedMessage,
  } from 'react-intl'

// supprimer un personnage
const supprimerPersonnage = ( id : string, callback: () => void ) => {
    // cette façon de faire pour passer un paramètre dans l'URL est proposé par axios : https://apidog.com/blog/params-axios-get-request/
    axios.delete(`https://api-v3-grul.onrender.com/personnages/${id}`, {
        headers: {
            'Authorization': `Bearer ${DonneesPersistantes.getToken()}`, 
            'Accept': 'application/json'
        }
    })
    .then(() => {
        // met à jour la liste des personnages en enlevant celui qui a été supprimé
        callback()
    })
    .catch(err => {
        console.log(err);
    })
}

// Afficher un formulaire
const afficherFormulaire = (modification: boolean, naviguer: ReturnType<typeof useNavigate>, id?: string) => {
    if (modification) {
        // Rediriger vers la page d'édition du personnage
        naviguer(`/formulaire-edition/${id}`);
    } else {
        // Rediriger vers la page d'ajout d'un personnage
        naviguer('/formulaire-ajout');
    }
}

// paramètres d'un bouton
interface BoutonProp {
    id? : string;
}

// paramètre d'un bouton de suppression
interface BoutonSuppressionProps extends BoutonProp {
    rafraichirPersonnages: () => void; 
}

// afficher un bouton de suppression
export const BoutonSuppression = (prop : BoutonSuppressionProps) => {
    return (
        <Button onClick={() => supprimerPersonnage(prop.id!, prop.rafraichirPersonnages)}>
            <DeleteIcon/>
        </Button>
    )
}

// afficher un bouton de modification
export const BoutonModification = (prop : BoutonProp) => {
    const naviguer = useNavigate();
    return (
        <Button onClick={() => afficherFormulaire(true, naviguer, prop.id!)}>
            <EditIcon/>
        </Button>
    )
}

// afficher un bouton de déconnexion
export const BoutonDeconnexion = () => {
    return (
        <Box display="flex" alignItems="center" gap={2}>
            <Button onClick={() => DonneesPersistantes.viderToken()} startIcon={<LogoutIcon />}>
                <FormattedMessage id="app.deconnexion"/>
            </Button>
        </Box>
    );
};
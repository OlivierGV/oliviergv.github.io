/// Afficher les personnages

import { useParams } from "react-router-dom"
import { Formulaire } from "./formulaire.component"
import { Box, Grid, Typography } from "@mui/material"
import Personnage, { IPersonnage } from "./personnage.component"
import { PopUpTriDate, PopUpTriNiveau } from "./popup.component"
import { Authentification } from "./connexion.component"
import { FormattedMessage } from "react-intl"

/** J'ai demandé à ChatGPT de modifier ma fonction pour m'aider à appeler setPersonnages dans mon Pop Up */
export interface PagePrincipaleProps {
    personnages: IPersonnage[]
    setTriActif: React.Dispatch<React.SetStateAction<string>>
    setTriDateCroissant: React.Dispatch<React.SetStateAction<boolean>>
    setTriNiveauCroissant: React.Dispatch<React.SetStateAction<boolean>>
    chercherPersonnages: () => void
  }
  
// la page pour s'identifier
export function PageConnexion() {
    return (
        <Authentification/>
    );
  }
  
// la page pour afficher les données
export function PagePrincipale({ personnages, setTriActif, setTriDateCroissant, chercherPersonnages, setTriNiveauCroissant} : PagePrincipaleProps) {
    return (
      <>
        <Box sx={{ m: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <PopUpTriDate setTriActif={setTriActif} setTriDateCroissant={setTriDateCroissant} />
          <PopUpTriNiveau setTriActif={setTriActif} setTriNiveauCroissant={setTriNiveauCroissant} />
        </Box>
        <br />
        <Grid
          container
          spacing={5}
          direction="column"
          alignItems="center"
          style={{ minHeight: '100vh' }}  
        >
          {personnages != undefined && personnages != null ? (
            personnages.map((personnage) => (
              <Grid item xs={8} key={personnage._id}>
                <Personnage personnage={personnage} rafraichirPersonnages={chercherPersonnages} />
              </Grid>
            ))
          ) : (
            <Typography><FormattedMessage id="app.affichage"/></Typography>
          )}
        </Grid>
      </>
    );
  }
  
// la page pour ajouter un personnage
export const PageFormulaireAjout = () => {
    return (
    <Formulaire mode={'ajout'} />
    );
  };
  
// la page pour modifier un personnage
export const PageFormulaireEdition = () => {
    const { id } = useParams<{ id: string }>();
  
    return (
        <Formulaire id={id} mode={'edition'} />
    );
  };
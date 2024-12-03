import axios from 'axios';
import './App.css';
import React, { useEffect, useState, useContext } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Formulaire } from './components/formulaire.component';
import { PopUpTriDate, PopUpTriNiveau } from './components/popup.component';
import _ from 'lodash';

//traduction
import {
  FormattedMessage,
} from 'react-intl'
import {IntlProvider} from 'react-intl'
import { LangueContext } from './contexts/langue.context';

// Router
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useParams
} from 'react-router-dom';

// Composants
import Personnage, { IPersonnage } from './components/personnage.component';
import { Grid } from '@mui/material';
import { Authentification } from './components/connexion.component';
import DonneesPersistantes from './util/DonneesPersistantes';
import { BoutonDeconnexion } from './components/bouton.component';
import { LangueSelect } from './components/selection.component';

// Emprunté depuis : https://mui.com/material-ui/customization/dark-mode/
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function Modele() {
  const token = DonneesPersistantes.getToken();

  return (
    <div>
      {token && (
        <div>
        <Box display="flex" justifyContent="space-between" alignItems="center" padding={1}>
          <LangueSelect />
          <BoutonDeconnexion />
        </Box>
        <Stack direction="row" spacing={5} justifyContent="center">
          <a href="/"><FormattedMessage id="app.chemin.personnages" /></a>
          <a href="/formulaire-ajout"><FormattedMessage id="app.chemin.ajouter" /></a>
          <a href="https://api-v3-grul.onrender.com/api-docs/"><FormattedMessage id="app.chemin.documentation" /></a>
        </Stack>
        </div>
      )}
      <br />
      <Outlet />
    </div>
  );
}


/// Afficher les personnages
/** J'ai demandé à ChatGPT de modifier ma fonction pour m'aider à appeler setPersonnages dans mon Pop Up */
interface PagePrincipaleProps {
  personnages: IPersonnage[]
  setTriActif: React.Dispatch<React.SetStateAction<string>>
  setTriDateCroissant: React.Dispatch<React.SetStateAction<boolean>>
  setTriNiveauCroissant: React.Dispatch<React.SetStateAction<boolean>>
  chercherPersonnages: () => void
}

function PageConnexion() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Authentification/>
    </ThemeProvider>
  );
}

function PagePrincipale({ personnages, setTriActif, setTriDateCroissant, chercherPersonnages, setTriNiveauCroissant} : PagePrincipaleProps) {
  return (
    <ThemeProvider theme={darkTheme}>
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
          <Typography>Rien à afficher.</Typography>
        )}
      </Grid>
    </ThemeProvider>
  );
}

function PageFormulaireAjout() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Formulaire mode={'ajout'} />
    </ThemeProvider>
  );
}

const PageFormulaireEdition = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <ThemeProvider theme={darkTheme}>
      <Formulaire id={id} mode={'edition'} />
    </ThemeProvider>
  );
}

function App() {
  const { langue, message } = useContext(LangueContext);

  const [personnages, setPersonnages] = useState<IPersonnage[]>([]);
  const [triActif, setTriActif] = useState("")
  const [triDate, setTriDateCroissant] = useState(true)
  const [triNiveau, setTriNiveauCroissant] = useState(false)

  /**
   * Chercher les personnages
   */
  const chercherPersonnages = () => {
    setTriActif("")
    axios
      .get('https://api-v3-grul.onrender.com/personnages', {
        headers: {
          'Authorization': `Bearer ${DonneesPersistantes.getToken()}`, 
          'Accept': 'application/json'
        }
      })
      .then((res) => {
        const nouveauxPersonnages = res.data.personnages;
        const sontIdentiques = _.isEqual(nouveauxPersonnages, personnages);
        console.warn(sontIdentiques)
        if(!sontIdentiques){
          setPersonnages(nouveauxPersonnages)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  /**
   * Chercher les personnages et les trier par date
   */
  const chercherParDate = () => {
    axios
      .get('https://api-v3-grul.onrender.com/personnages/date/' + (triDate ? 'desc' : 'asc'))
      .then((res) => {
        const nouveauxPersonnages = res.data;
        const sontIdentiques = _.isEqual(nouveauxPersonnages, personnages);
        console.warn(sontIdentiques)
        if(!sontIdentiques){
          setPersonnages(nouveauxPersonnages)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * Chercher les personnages et les trier par niveau
   */
  const chercherParNiveau = () => {
    axios
      .get('https://api-v3-grul.onrender.com/personnages/niveau/' + (triNiveau ? 'desc' : 'asc'))
      .then((res) => {
        const nouveauxPersonnages = res.data;
        const sontIdentiques = _.isEqual(nouveauxPersonnages, personnages);
        console.warn(sontIdentiques)
        if(!sontIdentiques){
          setPersonnages(nouveauxPersonnages)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Afficher les personnages au démarrage et mettre l'affichage à jour lorsque le tri change.
  useEffect(() => {
    console.log(DonneesPersistantes.getToken());
    if(!triActif){
      chercherPersonnages()
    } else if (triActif){
      if(triActif == "niveau"){
        chercherParNiveau()
      } else if (triActif == "date"){
        chercherParDate()
      } else {
        chercherPersonnages()
      }
    }
  }, [triActif, triDate, triNiveau]);

  return (
      <IntlProvider locale={langue} messages={message}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Modele />}>
              <Route
                index
                element={
                  DonneesPersistantes.getToken() != null ? (
                    <PagePrincipale
                      personnages={personnages}
                      setTriActif={setTriActif}
                      setTriDateCroissant={setTriDateCroissant}
                      chercherPersonnages={chercherPersonnages}
                      setTriNiveauCroissant={setTriNiveauCroissant}
                    />
                  ) : (
                    <PageConnexion />
                  )
                }
              />
            </Route>
  
            <Route path="/formulaire-ajout" element={<Modele />}>
              <Route index element={<PageFormulaireAjout />} />
            </Route>
  
            <Route path="/formulaire-edition/:id" element={<Modele />}>
              <Route index element={<PageFormulaireEdition />} />
            </Route>
  
            <Route path="/triage-niveau/:niveau" element={<Modele />}>
              <Route index element={<PageFormulaireEdition />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </IntlProvider>
  );
}

export default App;
import axios from 'axios';
import './App.css';
import { useEffect, useState, useContext } from 'react';
import { Stack, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import _ from 'lodash';

//traduction
import {
  FormattedMessage,
} from 'react-intl'
import {IntlProvider} from 'react-intl'
import { LangueContext } from './contexts/langue.context';

// Router
import {
  HashRouter,
  Routes,
  Route,
  Outlet,
  Link
} from 'react-router-dom';

// Composants
import { IPersonnage } from './components/personnage.component';
import DonneesPersistantes from './util/DonneesPersistantes';
import { BoutonDeconnexion } from './components/bouton.component';
import { LangueSelect } from './components/selection.component';
import { PageConnexion, PageFormulaireAjout, PageFormulaireEdition, PagePrincipale } from './components/page.component';

// Emprunté depuis : https://mui.com/material-ui/customization/dark-mode/
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// Code emprunté et modifié depuis le site du cours : https://web3.profinfo.ca/react3/#exemple-de-spa-avec-router
function Modele() {
  const token = DonneesPersistantes.getToken();

  return (
    <div>
      { //si pas token, afficher que la boîte de langues
      !token && (
        <Box display="flex" justifyContent="center" alignItems="center" padding={1}>
          <LangueSelect />
        </Box>
      )}
      
      { //si token, afficher les routes}
      token && (
        <div>
        <Box display="flex" justifyContent="space-between" alignItems="center" padding={1}>
          <LangueSelect />
          <BoutonDeconnexion />
        </Box>
        <Stack direction="row" spacing={5} justifyContent="center">
          <Link to="/"><FormattedMessage id="app.chemin.personnages" /></Link>
          <Link to="/formulaire-ajout"><FormattedMessage id="app.chemin.ajouter" /></Link>
          <Link to="https://api-v3-grul.onrender.com/api-docs/"><FormattedMessage id="app.chemin.documentation" /></Link>
        </Stack>
        </div>
      )}
      <br />
      <Outlet />
    </div>
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
  setTriActif("");
  console.log("Token utilisé : " + DonneesPersistantes.getToken());

  // code emprunté de LogRocket pour indiquer des headers particuliers : https://blog.logrocket.com/using-axios-set-request-headers/
  axios
    .get('https://api-v3-grul.onrender.com/personnages', {
      headers: {
        'Authorization': `Bearer ${DonneesPersistantes.getToken()}`,
        'Accept': 'application/json',
      },
      // fin du code emprunté
    })
    .then((res) => {
      const nouveauxPersonnages = res.data.personnages;
      // J'ai demandé à chatgpt de m'aider à comparer deux tableaux
      const sontIdentiques = _.isEqual(nouveauxPersonnages, personnages);
      // Fin du code emprunté
      console.warn(sontIdentiques);
      if (!sontIdentiques) {
        setPersonnages(nouveauxPersonnages);
      }
    })
    .catch((err) => {
      console.log("Erreur lors de la requête : ", err);
    });
};


  /**
   * Chercher les personnages et les trier par date
   */
  const chercherParDate = () => {
    // code emprunté de LogRocket pour indiquer des headers particuliers : https://blog.logrocket.com/using-axios-set-request-headers/
    axios
      .get('https://api-v3-grul.onrender.com/personnages/date/' + (triDate ? 'desc' : 'asc'), {
        headers: {
          'Authorization': `Bearer ${DonneesPersistantes.getToken()}`, 
          'Accept': 'application/json'
        }
      })
      // fin du code emprunté
      .then((res) => {
        const nouveauxPersonnages = res.data;
        // J'ai demandé à chatgpt de m'aider à comparer deux tableaux
        const sontIdentiques = _.isEqual(nouveauxPersonnages, personnages);
        // fin du code emprunté
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
    // code emprunté de LogRocket pour indiquer des headers particuliers : https://blog.logrocket.com/using-axios-set-request-headers/
    axios
      .get('https://api-v3-grul.onrender.com/personnages/niveau/' + (triNiveau ? 'desc' : 'asc'), {
        headers: {
          'Authorization': `Bearer ${DonneesPersistantes.getToken()}`, 
          'Accept': 'application/json'
        }
      })
      // fin du code emprunté
      .then((res) => {
        const nouveauxPersonnages = res.data;
        // J'ai demandé à chatgpt de m'aider à comparer deux tableaux
        const sontIdentiques = _.isEqual(nouveauxPersonnages, personnages);
        // fin du code emprunté
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

  // Code emprunté et modifié depuis le site du cours : https://web3.profinfo.ca/react3/#routes-imbriquees
  return (
    <ThemeProvider theme={darkTheme}>
      <IntlProvider locale={langue} messages={message}>
        { /* Problème avec BrowserRoute, j'ai donc suivi les recommandations suivantes : https://stackoverflow.com/questions/71984401/react-router-not-working-with-github-pages */ }
        <HashRouter>
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

          </Routes>
        </HashRouter>
      </IntlProvider>
    </ThemeProvider>
  );
}
// Fin du code emprunté et modifié

export default App;

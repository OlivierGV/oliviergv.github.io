import { useEffect, useState } from "react";
import { TextField, FormControl, MenuItem, Button, DialogTitle, Dialog, DialogActions } from "@mui/material";
import axios from "axios";
import { IPersonnage } from "./personnage.component";
import { useNavigate } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import DonneesPersistantes from "../util/DonneesPersistantes";

/** Paramètres d'un formulaire */
interface FormulaireProp {
  mode: 'ajout' | 'edition';
  // Pour l'édition
  id?: string;
}

/** Le formulaire */
export const Formulaire = (props: FormulaireProp) => {
  // pop up
  const [confirmation, setConfirmation] = useState(false);
  // données
  const [personnage, setPersonnage] = useState<IPersonnage | null>(null);
  // affichage d'un chargement
  const [chargementEnCours, setChargementEnCours] = useState(true);

  // vérifier si le form est valide avant de soumettre
  const [formulaireValide, setFormulaireValide] = useState(true); 

  // retour à l'accueil après une édition
  const naviguer = useNavigate();

  // boîte de sélection
  const classes = [
    { value: "Nain", label: <FormattedMessage id="app.formulaire.classe.nain" /> },
    { value: "Elf", label: <FormattedMessage id="app.formulaire.classe.elf" /> },
    { value: "Humain", label: <FormattedMessage id="app.formulaire.classe.humain" /> },
    { value: "Orc", label: <FormattedMessage id="app.formulaire.classe.orc" /> },
  ];

  // traduction
  const { formatMessage } = useIntl();

  // champs du formulaire
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [classe, setClasse] = useState("Nain");
  const [niveau, setNiveau] = useState(1);
  const [pointsDeVie, setPointsDeVie] = useState(10);
  const [estVivant, setEstVivant] = useState(true);
  const [force, setForce] = useState(1);
  const [dexterite, setDexterite] = useState(1);
  const [intelligence, setIntelligence] = useState(1);
  const [sagesse, setSagesse] = useState(1);
  const [charisme, setCharisme] = useState(1);
  const [competences, setCompetences] = useState<string[]>([]);
  const [capacites, setCapacites] = useState<string[]>([]);
  const [equipement, setEquipement] = useState<string[]>([]);
  // ISOString correspond au format que j'ai choisi pour une date. 
  const [dateDeCreation, setDateDeCreation] = useState(new Date().toISOString());

  // pré-remplir les champs si en mode édition
  const chercherPersonnage = async () => {
    try {
      setChargementEnCours(true);
      if (props.mode === "edition") {
        setChargementEnCours(true);
        const res = await axios.get(
          `https://api-v3-grul.onrender.com/personnages/${props.id}`, {
            headers: {
              'Authorization': `Bearer ${DonneesPersistantes.getToken()}`,
              'Accept': 'application/json',
            }
          }
        );
        setPersonnage(res.data.personnage);
        setChargementEnCours(false);
      } else if (props.mode === "ajout") {
        setChargementEnCours(false);
      }
    } catch (err) {
      console.error(err);
      setChargementEnCours(false);
    }
  };

  // apporter des modifications à la base de données après la soumission
  const modifierPersonnage = async () => {
    let personnageData = {
      personnage: {
        nomComplet: {
          prenom: prenom,
          nom: nom,
        },
        classe: classe,
        niveau: niveau,
        pointsDeVie: pointsDeVie,
        vivant: estVivant,
        caracteristiques: {
          force: force,
          dexterite: dexterite,
          intelligence: intelligence,
          sagesse: sagesse,
          charisme: charisme,
        },
        competences: competences,
        capacites: capacites,
        equipement: equipement,
        dateDeCreation: dateDeCreation,
      },
    };
    try {
      if (props.mode === "edition") {
        // code généré par ChatGPT pour récupérer un objet et lui ajouter un champ au lieu de devoir ré-écrire le code à la main
        const updatedPersonnageData = {
          ...personnageData,
          Personnage: {
            ...personnageData.personnage,
            _id: props.id,
          },
        };
        // fin du code généré
        await axios.put(`https://api-v3-grul.onrender.com/personnages/`, updatedPersonnageData, {
          headers: {
            'Authorization': `Bearer ${DonneesPersistantes.getToken()}`,
            'Accept': 'application/json'
          }
        });
      } else if (props.mode === "ajout") {
        const reponse = await axios.post(`https://api-v3-grul.onrender.com/personnages/`, personnageData, {
          headers: {
            'Authorization': `Bearer ${DonneesPersistantes.getToken()}`,
            'Accept': 'application/json'
          }
        });
        if(reponse.status == 201){
          viderFormulaire()
        }
      }
      setConfirmation(true)
    } catch (err) {
      console.error(err);
    }
  };

  // vider le formulaire après la soumission
  const viderFormulaire = () => {
    setPrenom("");
    setNom("");
    setClasse("Nain");
    setNiveau(1);
    setPointsDeVie(10);
    setEstVivant(true);
    setForce(1);
    setDexterite(1);
    setIntelligence(1);
    setSagesse(1);
    setCharisme(1);
    setCompetences([]);
    setCapacites([]);
    setEquipement([]);
    setDateDeCreation(new Date().toISOString());
  };

  // Remplir un personnage avec les éléments du formulaire
  const remplirPersonnage = () => {
    if (personnage != null) {
      setPrenom(personnage.nomComplet.prenom);
      setNom(personnage.nomComplet.nom);
      setClasse(personnage.classe);
      setNiveau(personnage.niveau);
      setPointsDeVie(personnage.pointsDeVie);
      setEstVivant(personnage.vivant);
      setForce(personnage.caracteristiques.force);
      setDexterite(personnage.caracteristiques.dexterite);
      setIntelligence(personnage.caracteristiques.intelligence);
      setSagesse(personnage.caracteristiques.sagesse);
      setCharisme(personnage.caracteristiques.charisme);
      setCompetences(personnage.competences);
      setCapacites(personnage.capacites);
      setEquipement(personnage.equipement);
      setDateDeCreation(personnage.dateDeCreation);
    }
  };

  // au début du formulaire..
  useEffect(() => {
    chercherPersonnage();
  }, []);

  // remplir le formulaire 
  useEffect(() => {
    if (!chargementEnCours && personnage) {
      remplirPersonnage();
    }
  }, [chargementEnCours]);

  // valider la validité du formulaire
  useEffect(() => {
    // si une fonction retourne un message d'erreur, ça retourne faux
    const estValide =
      gestionNomPrenom("prénom") === "" &&
      gestionNomPrenom("nom") === "" &&
      gestionClasse() === "" &&
      gestionNiveau() === "" &&
      gestionVie() === "" &&
      gestionCaracteristique("force") === "" &&
      gestionCaracteristique("dextérité") === "" &&
      gestionCaracteristique("intelligence") === "" &&
      gestionCaracteristique("sagesse") === "" &&
      gestionCaracteristique("charisme") === "" &&
      verifierChamp(competences) === "" &&
      verifierChamp(capacites) === "" &&
      verifierChamp(equipement) === "";

      setFormulaireValide(estValide);
  }, [
    prenom,
    nom,
    classe,
    niveau,
    pointsDeVie,
    force,
    dexterite,
    intelligence,
    sagesse,
    charisme,
    competences,
    capacites,
    equipement,
  ]);

  // afficher un message pour l'attente
  if (chargementEnCours) {
    return <FormattedMessage id="app.chargement"/>;
  }

  // vérification pour le champ nom et prénom
  function gestionNomPrenom(texte: string) {
    if (texte === "nom") {
      if (nom.length === 0) {
        return <FormattedMessage id="app.formulaire.messageErreur.nom.vide" />;
      } else if (nom === prenom) {
        return <FormattedMessage id="app.formulaire.messageErreur.nom.identique" />;
      }
    } else if (texte === "prénom") {
      if (prenom.length === 0) {
        return <FormattedMessage id="app.formulaire.messageErreur.nom.vide" />;
      } else if (prenom === nom) {
        return <FormattedMessage id="app.formulaire.messageErreur.prenom.identique" />;
      }
    }
    return "";
  }

  // vérification pour la classe
  function gestionClasse() {
    if (classe.length === 0) {
      return <FormattedMessage id="app.formulaire.messageErreur.classe" />;
    }
    return "";
  }

  // vérification pour le niveau
  function gestionNiveau() {
    if (niveau <= 0) {
      return <FormattedMessage id="app.formulaire.messageErreur.niveau.insuffisant" />;
    } else if (niveau > 20) {
      return <FormattedMessage id="app.formulaire.messageErreur.niveau.sureleve" />;
    }
    return "";
  }

  // vérification pour les points de vie
  function gestionVie() {
    if (pointsDeVie <= 0) {
      return <FormattedMessage id="app.formulaire.messageErreur.pointsDeVie.insuffisant" />;
    } else if (pointsDeVie > 50) {
      return <FormattedMessage id="app.formulaire.messageErreur.pointsDeVie.sureleve" />;
    }
    return "";
  }

  // vérification pour les caractéristiques
  function gestionCaracteristique(caracteristique: string) {
    switch (caracteristique) {
      case "force":
        if (force <= 0) {
          return <FormattedMessage id="app.formulaire.messageErreur.caracteristique.force.insuffisant" />;
        } else if (force > 20) {
          return <FormattedMessage id="app.formulaire.messageErreur.caracteristique.force.sureleve" />;
        }
        break;
      case "dextérité":
        if (dexterite <= 0) {
          return <FormattedMessage id="app.formulaire.messageErreur.caracteristique.dexterite.insuffisant" />;
        } else if (dexterite > 20) {
          return <FormattedMessage id="app.formulaire.messageErreur.caracteristique.dexterite.sureleve" />;
        }
        break;
      case "sagesse":
        if (sagesse <= 0) {
          return <FormattedMessage id="app.formulaire.messageErreur.caracteristique.sagesse.insuffisant" />;
        } else if (sagesse > 20) {
          return <FormattedMessage id="app.formulaire.messageErreur.caracteristique.sagesse.sureleve" />;
        }
        break;
      case "intelligence":
        if (intelligence <= 0) {
          return <FormattedMessage id="app.formulaire.messageErreur.caracteristique.intelligence.insuffisant" />;
        } else if (intelligence > 20) {
          return <FormattedMessage id="app.formulaire.messageErreur.caracteristique.intelligence.sureleve" />;
        }
        break;
      case "charisme":
        if (charisme <= 0) {
          return <FormattedMessage id="app.formulaire.messageErreur.caracteristique.charisme.insuffisant" />;
        } else if (charisme > 20) {
          return <FormattedMessage id="app.formulaire.messageErreur.caracteristique.charisme.sureleve" />;
        }
        break;
    }
    return "";
  }

  // vérification pour les champs qui demandent une syntaxe comme "mon, petit, inventaire"
  function verifierChamp(tableauString: string[]) {
    if (tableauString.length === 0) {
      return <FormattedMessage id="app.formulaire.messageErreur.tableau.vide" />;
    } else if (tableauString.length > 255) {
      return <FormattedMessage id="app.formulaire.messageErreur.tableau.surremplis" />;
    } else {
      for (let i = 0; i < tableauString.length; i++) {
        if (tableauString[i].trim() === "") {
          return <FormattedMessage id="app.formulaire.messageErreur.tableau.valeurvide" />;
        }
      }
    }
    return "";
  }

  // ce qu'on affiche
  return (
    <form>
      <FormControl fullWidth>
        <h3><FormattedMessage id="app.formulaire.titre.identification"/></h3>
        <br />
        <TextField
          label={<><FormattedMessage id="app.formulaire.prenom"/>*</>}
          variant="outlined"
          helperText={gestionNomPrenom("prénom")}
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
        />
        <br />
        <TextField
          label={<><FormattedMessage id="app.formulaire.nom"/>*</>}
          variant="outlined"
          helperText={gestionNomPrenom("nom")}
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />
        <br />
        <TextField
          select
          label={<><FormattedMessage id="app.formulaire.classe"/>*</>}
          value={classe}
          variant="outlined"
          helperText={gestionClasse()}
          onChange={(e) => setClasse(e.target.value)}
        >
          {classes.map((classe) => (
            <MenuItem key={classe.value} value={classe.value}>
              {classe.label}
            </MenuItem>
          ))}
        </TextField>
        <br />
        <TextField
          label={<><FormattedMessage id="app.formulaire.niveau"/>*</>}
          type="number"
          value={niveau}
          helperText={gestionNiveau()}
          onChange={(e) => {
            const valeur = Number(e.target.value);
            if (valeur > 0 && valeur <= 20) {
              setNiveau(valeur);
            }
          }}
        />
        <br />
        <h3><FormattedMessage id="app.formulaire.titre.sante"/></h3>
        <br />
        <TextField
          label={<><FormattedMessage id="app.formulaire.pointsdevie"/>*</>}
          type="number"
          value={pointsDeVie}
          helperText={gestionVie()}
          onChange={(e) => {
            const valeur = Number(e.target.value);
            if (valeur > 0 && valeur <= 50) {
              setEstVivant(true);
              setPointsDeVie(valeur);
              if (valeur === 0) {
                setEstVivant(false);
              }
            }
          }}
        />
        <br />
        <h3><FormattedMessage id="app.formulaire.titre.caracteristiques"/></h3>
        <br />
        <TextField
          label={<><FormattedMessage id="app.formulaire.pointsdeforce"/>*</>}
          type="number"
          value={force}
          helperText={gestionCaracteristique("force")}
          onChange={(e) => {
            const valeur = Number(e.target.value);
            if (valeur > 0 && valeur <= 20) {
              setForce(valeur);
            }
          }}
        />
        <br />
        <TextField
          label={<><FormattedMessage id="app.formulaire.pointsdedexterite"/>*</>}
          type="number"
          value={dexterite}
          helperText={gestionCaracteristique("dextérité")}
          onChange={(e) => {
            const valeur = Number(e.target.value);
            if (valeur > 0 && valeur <= 20) {
              setDexterite(valeur);
            }
          }}
        />
        <br />
        <TextField
          label={<><FormattedMessage id="app.formulaire.pointsdintelligence"/>*</>}
          type="number"
          value={intelligence}
          helperText={gestionCaracteristique("intelligence")}
          onChange={(e) => {
            const valeur = Number(e.target.value);
            if (valeur > 0 && valeur <= 20) {
              setIntelligence(valeur);
            }
          }}
        />
        <br />
        <TextField
          label={<><FormattedMessage id="app.formulaire.pointsdesagesse"/>*</>}
          type="number"
          value={sagesse}
          helperText={gestionCaracteristique("sagesse")}
          onChange={(e) => {
            const valeur = Number(e.target.value);
            if (valeur > 0 && valeur <= 20) {
              setSagesse(valeur);
            }
          }}
        />
        <br />
        <TextField
          label={<><FormattedMessage id="app.formulaire.pointsdecharisme"/>*</>}
          type="number"
          value={charisme}
          helperText={gestionCaracteristique("charisme")}
          onChange={(e) => {
            const valeur = Number(e.target.value);
            if (valeur > 0 && valeur <= 20) {
              setCharisme(valeur);
            }
          }}
        />
        <br />
        <h3><FormattedMessage id="app.formulaire.competences"/></h3>
        <br />
        <TextField
          label={<><FormattedMessage id="app.formulaire.competences"/>*</>}
          multiline
          placeholder={formatMessage({ id: 'app.formulaire.ajout.tableau.defaut' })}
          rows={4}
          helperText={verifierChamp(competences)}
          value={competences.join(", ")}
          onChange={(e) => {
            const mots = e.target.value.split(", ");
            setCompetences(mots);
          }}
        />
        <br />
        <h3><FormattedMessage id="app.formulaire.capacites"/></h3>
        <br />
        <TextField
          label={<><FormattedMessage id="app.formulaire.capacites"/>*</>}
          multiline
          placeholder={formatMessage({ id: 'app.formulaire.ajout.tableau.defaut' })}
          rows={4}
          helperText={verifierChamp(capacites)}
          value={capacites.join(", ")}
          onChange={(e) => {
            const mots = e.target.value.split(", ");
            setCapacites(mots);
          }}
        />
        <br />
        <h3><FormattedMessage id="app.formulaire.equipement"/></h3>
        <br />
        <TextField
          label={<><FormattedMessage id="app.formulaire.equipement"/>*</>}
          multiline
          placeholder={formatMessage({ id: 'app.formulaire.ajout.tableau.defaut' })}
          rows={4}
          helperText={verifierChamp(equipement)}
          value={equipement.join(", ")}
          onChange={(e) => {
            const mots = e.target.value.split(", ");
            setEquipement(mots);
          }}
        />
        <br />
        <Dialog open={confirmation}>
        <DialogTitle><FormattedMessage id="app.confirmation"/></DialogTitle>
        <DialogActions>
          <Button onClick={() => {
            // L'utilisation d'un setPersonnages pour activer le useEffect ajoute des lignes de code supplémentaire,
            //  je trouvais donc ça pertinent de plutôt utiliser un window.location.reload pour sauver de l'espace et
            //  simplifier la tâche.
            if(props.mode == "edition"){
              naviguer("/")
              window.location.reload()
            } else if (props.mode == "ajout"){
              window.location.reload()
            }
            }} color="primary">
          <FormattedMessage id="app.tri.confirmation"/>
          </Button>
        </DialogActions>
      </Dialog>
        <br />
        <Button
          variant="contained"
          color="primary"
          type="button"
          onClick={modifierPersonnage}
          disabled={!formulaireValide}
        >
          {props.mode === "ajout" ? <FormattedMessage id="app.formulaire.ajout.soumission"/> : <FormattedMessage id="app.formulaire.edit.soumission"/>}
        </Button>
      </FormControl>
    </form>
  );
};

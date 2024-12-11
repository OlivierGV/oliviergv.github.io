import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { BoutonSuppression } from './bouton.component'
import { BoutonModification } from './bouton.component'

/**
 * Paramètres de la fonction
 */
export interface IPersonnage {
    _id : string,
    nomComplet : {
        prenom : string,
        nom : string
    },
    classe : string,
    niveau : number,
    pointsDeVie : number,
    vivant : boolean,
    caracteristiques : {
        force : number,
        dexterite : number,
        intelligence : number,
        sagesse : number,
        charisme : number
    },
    competences : string[],
    capacites : string[],
    equipement : string[],
    dateDeCreation : string
}

interface PersonnageProp {
  personnage: IPersonnage;
  rafraichirPersonnages: () => void;
}

/**
 * Classe (ou fonction dans le cas de React) d'un personnage.
 * @param props IPersonnageProps
 * @returns les composants d'un personnage.
 */
const Personnage = ({ personnage, rafraichirPersonnages } : PersonnageProp ) => {
    return (
      // Code emprunté et modifié de la documentation de MUI : https://mui.com/material-ui/react-card/
      <Card sx={{ width: 400 }}>
        <Grid container spacing={0} direction="column" alignItems="center">
          <CardMedia
            image="https://media.istockphoto.com/id/1016744004/vector/profile-placeholder-image-gray-silhouette-no-photo.jpg?s=612x612&w=0&k=20&c=mB6A9idhtEtsFXphs1WVwW_iPBt37S2kJp6VpPhFeoA="
            sx={{ height: 150, width: 150, borderRadius: '50%' }}
          />
        </Grid>
        <Box>
          { /* Documentation : https://mui.com/material-ui/react-typography/ */}
          <Typography variant="subtitle1" sx={{ textTransform: 'uppercase', fontWeight: 'bold'  }}>{personnage.nomComplet.prenom} {personnage.nomComplet.nom}</Typography>
          <Typography variant="subtitle1">{personnage.classe} - Niveau {personnage.niveau}</Typography>
          <BoutonSuppression
            id={personnage._id}
            rafraichirPersonnages={rafraichirPersonnages}
          />
          <BoutonModification
            id={personnage._id}
          />
        </Box>
      </Card>
    );
  };

export default Personnage;

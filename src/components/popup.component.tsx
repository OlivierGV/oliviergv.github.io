import React, { useState } from 'react';
import { Dialog, DialogActions, DialogTitle, Button } from '@mui/material';
import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme } from '../App';
import {
    FormattedMessage,
  } from 'react-intl'

/** Paramètres d'un pop-up qui trie par date */
interface PopUpTriDateProps {
    setTriActif: React.Dispatch<React.SetStateAction<string>>
    setTriDateCroissant: React.Dispatch<React.SetStateAction<boolean>>
}

/** Paramètres d'un pop-up qui trie par niveau */
interface PopUpTriNiveauProps {
    setTriActif: React.Dispatch<React.SetStateAction<string>>
    setTriNiveauCroissant: React.Dispatch<React.SetStateAction<boolean>>
}

/** Pop-up pour trier par date */
export const PopUpTriDate: React.FC<PopUpTriDateProps> = ({ setTriActif, setTriDateCroissant }) => {
    const [estOuvert, setEstOuvert] = useState(false)
    const [temp, setTemp] = useState(true)

    return (
        <ThemeProvider theme={darkTheme}>
        <Button variant="contained" color="primary" onClick={() => setEstOuvert(true)}>
            <FormattedMessage id="app.tri.date"/>
        </Button>
        
        { /* Documentation Dialog : https://mui.com/material-ui/react-dialog/ */}
        <Dialog open={estOuvert} onClose={() => setEstOuvert(false)}>
            <DialogTitle><FormattedMessage id="app.tri.titre"/></DialogTitle>
                { /* Peut-être utiliser un DialogContent si j'ai le temps */ }
                <Box sx={{ display: 'flex' }}>
                    <Button onClick={() => setTemp(true)} 
                        color="primary" 
                        variant={ temp ? "contained" : "outlined" }
                    >
                        <FormattedMessage id="app.tri.date.asc"/>
                    </Button>
                    <Button onClick={() => setTemp(false)}
                        color="primary" 
                        variant={ !temp ? "contained" : "outlined" }
                    >
                    <FormattedMessage id="app.tri.date.desc"/>
                    </Button>
                </Box>
            <DialogActions>
            <Button onClick={() => setEstOuvert(false)} color="primary">
                <FormattedMessage id="app.tri.annuler"/>
            </Button>
            <Button onClick={() => 
                    {
                        setTriDateCroissant(temp)
                        setTriActif("date")
                        setEstOuvert(false)
                    }
                }
                color="primary">
                <FormattedMessage id="app.tri.confirmer"/>
            </Button>
            </DialogActions>
        </Dialog>
        </ThemeProvider>
    );
};

/** Pop-up pour trier par niveau */
export const PopUpTriNiveau: React.FC<PopUpTriNiveauProps> = ({ setTriActif, setTriNiveauCroissant }) => {
    const [estOuvert, setEstOuvert] = useState(false)
    const [temp, setTemp] = useState(true)

    return (
        <ThemeProvider theme={darkTheme}>
        <Button variant="contained" color="primary" onClick={() => setEstOuvert(true)}>
            <FormattedMessage id="app.tri.niveau"/>
        </Button>

        { /* Mêmes commentaires que dans le PopUp précédent */ }
        <Dialog open={estOuvert} onClose={() => setEstOuvert(false)}>
            <DialogTitle><FormattedMessage id="app.tri.titre"/></DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={() => setTemp(true)} 
                        color="primary" 
                        variant={ temp ? "contained" : "outlined" }
                    >
                        <FormattedMessage id="app.tri.niveau.desc"/>
                    </Button>
                    <Button onClick={() => setTemp(false)}
                        color="primary" 
                        variant={ !temp ? "contained" : "outlined" }
                    >
                        <FormattedMessage id="app.tri.niveau.asc"/>
                </Button>
            </Box>
            <DialogActions>
            <Button onClick={() => setEstOuvert(false)} color="primary">
                <FormattedMessage id="app.tri.annuler"/>
            </Button>
            <Button onClick={() => 
                    {
                        setTriNiveauCroissant(temp)
                        setTriActif("niveau")
                        setEstOuvert(false)
                    }
                }
                color="primary">
                <FormattedMessage id="app.tri.confirmer"/>
            </Button>
            </DialogActions>
        </Dialog>
        </ThemeProvider>
    );
};
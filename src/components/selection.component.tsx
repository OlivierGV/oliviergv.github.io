import { useContext, useEffect } from 'react';
import { LangueContext } from '../contexts/langue.context';
import Francais from '../lang/fr.json';
import Anglais from '../lang/en.json';

/**
 * Boîte de sélection
 * @returns 
 */
export function LangueSelect() {
  const { langue, setLangue, setMessage } = useContext(LangueContext);

  /** Code emprunté de ChatGPT pour m'aider à surveiller le changement de valeur de la boîte de sélection */
  const changerLangue = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nouvelleLangue = event.target.value;
    /** Fin du code emprunté */
    setLangue(nouvelleLangue);
    localStorage.setItem('language', nouvelleLangue);
    
    if (nouvelleLangue === "fr") {
      setMessage(Francais)
    } else if (nouvelleLangue === "en") {
      setMessage(Anglais)
    }

  };

  // jouer avec les cookies
  useEffect(() => {
    const storedLangue = localStorage.getItem('language') || 'fr';
    setLangue(storedLangue);

    if (storedLangue === "fr") {
      setMessage(Francais);
    } else if (storedLangue === "en") {
      setMessage(Anglais);
    }
  }, [setLangue, setMessage]);

  // Code emprunté de : https://www.w3schools.com/tags/tag_select.asp
  return (
    <div>
      <select value={langue} onChange={changerLangue}>
        <option value="fr">Français</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}

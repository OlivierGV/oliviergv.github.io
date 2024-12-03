import { useContext, useEffect } from 'react';
import { LangueContext } from '../contexts/langue.context';
import Francais from '../lang/fr.json';
import Anglais from '../lang/en.json';

export function LangueSelect() {
  const { langue, setLangue, setMessage } = useContext(LangueContext);

  const changerLangue = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nouvelleLangue = event.target.value;
    setLangue(nouvelleLangue);
    localStorage.setItem('language', nouvelleLangue);
    
    if (nouvelleLangue === "fr") {
      setMessage(Francais)
    } else if (nouvelleLangue === "en") {
      setMessage(Anglais)
    }

  };

  useEffect(() => {
    console.log(langue)
  }, [langue])

  return (
    <div>
      <select value={langue} onChange={changerLangue}>
        <option value="fr">Français</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import Francais from '../lang/fr.json';
import Anglais from '../lang/en.json';

// mon modèle
export type LangueContextType = {
  langue: string;
  setLangue: (nouvelleLangue: string) => void;
  message: any;
  setMessage: (typeMessage: any) => void;
};

// par défaut
export const LangueContext = React.createContext<LangueContextType>({
  langue: 'fr',
  setLangue: () => {},
  message: Francais,
  setMessage: () => {},
});

// les vérif
export const LangueProvider = (props: any) => {
  const [langue, setLangue] = useState('fr');
  const [message, setMessage] = useState(langue === 'fr' ? Francais : Anglais);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    const storedMessage = localStorage.getItem('message');

    if (storedLanguage) {
      setLangue(storedLanguage);
    }
    if (storedMessage) {
      setMessage(storedLanguage === 'fr' ? Francais : Anglais);
    }
  }, []);

  const values = {
    langue,
    setLangue,
    message,
    setMessage,
  };

  return (
    <LangueContext.Provider value={values}>
      {props.children}
    </LangueContext.Provider>
  );
};

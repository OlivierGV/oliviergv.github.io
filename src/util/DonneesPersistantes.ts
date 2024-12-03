/**
 * Classe proposée par ChatGPT pour gérer une donnée persistante
 * Modifié par Olivier G-Vandal.
 */
class DonneesPersistantes {
    /**
     * Définir le token
     * @param {string} token 
     */
    static setToken(token : string) {
      console.log("Token changé : " + token);
      localStorage.setItem('authToken', token);
      window.location.reload();
    }
  
    /**
     * Récupérer le token
     * @returns 
     */
    static getToken() : string | null {
      return localStorage.getItem('authToken');
    }
  
    /**
     * Vider la cache
     */
    static viderToken() : void {
      localStorage.removeItem('authToken');
      window.location.reload();
    }
  }
  
  export default DonneesPersistantes;
  
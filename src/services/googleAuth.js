/**
 * Servicio de autenticación con Google OAuth 2.0
 * Maneja el login y la gestión del token de acceso
 */

import { SCOPES } from '../utils/constants';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const STORAGE_KEY = 'pet_history_user';

class GoogleAuthService {
  constructor() {
    this.tokenClient = null;
    this.accessToken = null;
    this.gapiInited = false;
    this.gisInited = false;
    this.expiresAt = null;
  }

  /**
   * Inicializa Google API Client
   */
  initGapi(apiKey = null) {
    return new Promise((resolve, reject) => {
      if (this.gapiInited) {
        resolve();
        return;
      }

      window.gapi.load('client', async () => {
        try {
          const config = {
            discoveryDocs: [
              'https://sheets.googleapis.com/$discovery/rest?version=v4',
              'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
            ]
          };
          
          // Si hay API key, la agregamos para modo observador
          if (apiKey) {
            config.apiKey = apiKey;
          }
          
          await window.gapi.client.init(config);
          this.gapiInited = true;
          console.log('✅ Google API Client inicializado');
          resolve();
        } catch (error) {
          console.error('❌ Error inicializando GAPI:', error);
          reject(error);
        }
      });
    });
  }

  /**
   * Inicializa Google Identity Services
   */
  initGIS() {
    return new Promise((resolve) => {
      if (this.gisInited) {
        resolve();
        return;
      }

      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '' // Se configura en login()
      });

      this.gisInited = true;
      console.log('✅ Google Identity Services inicializado');
      resolve();
    });
  }

  /**
   * Inicializa ambos servicios de Google
   */
  async initialize(apiKey = null) {
    try {
      await this.initGapi(apiKey);
      await this.initGIS();
      return true;
    } catch (error) {
      console.error('❌ Error en inicialización:', error);
      throw error;
    }
  }

  /**
   * Inicia el flujo de login con Google
   */
  login() {
    return new Promise((resolve, reject) => {
      if (!this.tokenClient) {
        reject(new Error('Token client no inicializado'));
        return;
      }

      // Configurar callback para esta promesa específica
      this.tokenClient.callback = async (response) => {
        if (response.error) {
          console.error('❌ Error en autenticación:', response);
          reject(response);
          return;
        }

        try {
          this.accessToken = response.access_token;
          console.log('✅ Token de acceso obtenido');
          
          // Calcular expiración (por defecto 1 hora)
          const expiresIn = response.expires_in || 3600;
          this.expiresAt = Date.now() + (expiresIn * 1000);
          
          // Configurar el token en el cliente de Google API
          window.gapi.client.setToken({ access_token: this.accessToken });

          // Obtener info del usuario usando Google API Client
          const userInfo = await this.getUserInfo();
          
          // Guardar en localStorage
          this.saveSession(userInfo);
          
          resolve({
            accessToken: this.accessToken,
            user: userInfo
          });
        } catch (error) {
          console.error('❌ Error procesando login:', error);
          reject(error);
        }
      };

      // Solicitar token (prompt solo en primera vez)
      if (this.accessToken) {
        this.tokenClient.requestAccessToken({ prompt: '' });
      } else {
        this.tokenClient.requestAccessToken({ prompt: 'consent' });
      }
    });
  }

  /**
   * Obtiene la información del usuario autenticado usando Google API
   */
  async getUserInfo() {
    try {
      if (!this.accessToken) {
        throw new Error('No hay token de acceso');
      }

      // Usar fetch directo con el token OAuth (no usar gapi.client que tiene API key)
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const userInfo = await response.json();
      return {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture
      };
    } catch (error) {
      console.error('❌ Error obteniendo info del usuario:', error);
      throw new Error('Error obteniendo información del usuario');
    }
  }

  /**
   * Cierra sesión
   */
  logout() {
    if (this.accessToken) {
      window.google.accounts.oauth2.revoke(this.accessToken, () => {
        console.log('✅ Sesión cerrada');
      });
      this.accessToken = null;
      this.expiresAt = null;
      window.gapi.client.setToken(null);
    }
    // Limpiar localStorage
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Guarda la sesión en localStorage
   */
  saveSession(userInfo) {
    const sessionData = {
      user: userInfo,
      accessToken: this.accessToken,
      expiresAt: this.expiresAt
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
    console.log('✅ Sesión guardada en localStorage');
  }

  /**
   * Restaura la sesión desde localStorage
   */
  async restoreSession() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return null;
      }

      const sessionData = JSON.parse(stored);
      
      // Verificar si el token expiró
      if (sessionData.expiresAt && Date.now() >= sessionData.expiresAt) {
        console.log('⚠️ Token expirado, limpiando sesión');
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      // Restaurar token
      this.accessToken = sessionData.accessToken;
      this.expiresAt = sessionData.expiresAt;
      window.gapi.client.setToken({ access_token: this.accessToken });

      console.log('✅ Sesión restaurada desde localStorage');
      return {
        accessToken: this.accessToken,
        user: sessionData.user
      };
    } catch (error) {
      console.error('❌ Error restaurando sesión:', error);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated() {
    return !!this.accessToken;
  }

  /**
   * Obtiene el token de acceso actual
   */
  getAccessToken() {
    return this.accessToken;
  }
}

// Exportar instancia única (singleton)
const googleAuthService = new GoogleAuthService();
export default googleAuthService;

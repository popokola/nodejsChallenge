const Provider = require('./provider');

class Spotify extends Provider {
    constructor(client_id, client_secret, redirect_uri) {
      super(client_id, client_secret);
      this.redirect_uri = redirect_uri;
    }
  
    static getBaseAuthorizationUrl() {
      return 'https://accounts.spotify.com/authorize?';
    }
  
    static getBaseAccessTokenUrl() {
      return 'https://accounts.spotify.com/api/token?';
    }
  
    static getBaseMeUrl() {
      return 'https://api.spotify.com/v1/me?';
    }
  
    static getName() {
      return 'Spotify';
    }
  
    static getState() {
      return 'Spotify';
    }
  
    static getScope() {
      return 'user-read-email user-read-private';
    }
}
  
module.exports = Spotify;
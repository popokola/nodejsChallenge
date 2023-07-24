const Provider = require('./provider');

class Discord extends Provider {
  constructor(client_id, client_secret, redirect_uri) {
    super(client_id, client_secret);
    this.redirect_uri = redirect_uri;
  }

  static getBaseAuthorizationUrl() {
    return 'https://discord.com/api/oauth2/authorize?';
  }

  static getBaseAccessTokenUrl() {
    return 'https://discord.com/api/oauth2/token?';
  }

  static getBaseMeUrl() {
    return 'https://discord.com/api/users/@me?';
  }

  static getName() {
    return 'Discord';
  }

  static getState() {
    return 'Discord';
  }

  static getScope() {
    return 'email identify';
  }

  /*
  async validateToken(token) {
    const access_token = token.access_token;
    const headers = {
      Authorization: `Bearer ${access_token}`
    };

    const response = await fetch(this.getBaseMeUrl(), { headers });
    const user = await response.json();

    return user;
  }
  */
}

module.exports = Discord;

const Provider = require('./Provider');

class Facebook extends Provider{
  constructor(client_id, client_secret, redirect_uri) {
    super(client_id, client_secret);
    this.redirect_uri = redirect_uri;
  }

  static getBaseAuthorizationUrl() {
    return 'https://www.facebook.com/v2.10/dialog/oauth?';
  }

  static getBaseAccessTokenUrl() {
    return 'https://graph.facebook.com/v2.10/oauth/access_token?';
  }

  static getBaseMeUrl() {
    return 'https://graph.facebook.com/v2.10/me?';
  }

  static getName() {
    return 'Facebook';
  }

  static getState() {
    return 'Facebook';
  }

  static getScope() {
    return 'public_profile email';
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

module.exports = Facebook;

const Provider = require('./provider');

class Google extends Provider {
  constructor(client_id, client_secret, redirect_uri) {
    super(client_id, client_secret);
    this.redirect_uri = redirect_uri;
  }

  static getBaseAuthorizationUrl() {
    return 'https://accounts.google.com/o/oauth2/v2/auth?';
  }

  // TODO: Implement getBaseAccessTokenUrl()
  static getBaseAccessTokenUrl() {
    return 'https://www.googleapis.com/oauth2/v4/token?';
  }

  static getBaseMeUrl() {
    return 'https://www.googleapis.com/oauth2/v2/userinfo?';
  }

  static getName() {
    return 'Google';
  }

  static getState() {
    return 'Google';
  }

  static getScope() {
    return 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
  }
}

module.exports = Google;
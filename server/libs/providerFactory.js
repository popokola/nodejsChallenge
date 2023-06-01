class ProviderFactory {
  constructor() {
    this.providers = [];
  }

  create(provider, client_id, client_secret, redirect_uri) {
    const ProviderClass = require(`./providers/${provider}`);
    const ProviderInstance = new ProviderClass(client_id, client_secret, redirect_uri);
    /*
    if (!(ProviderInstance instanceof ProviderInterface)) {
      throw new Error(`Class '${provider}' does not implement ProviderInterface`);
    }*/

    this.providers.push(ProviderInstance);
    return ProviderInstance;
  }

  getProviders() {
    return this.providers;
  }

  getProvider(name) {
    const provider = this.providers.find((p) => p.constructor.getName() === name);
    if (provider) {
      return provider;
    }
    throw new Error(`Provider '${name}' not found`);
  }
}

module.exports = ProviderFactory;

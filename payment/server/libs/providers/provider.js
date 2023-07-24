class Provider {
    constructor(client_id, client_secret) {
      this.client_id = client_id;
      this.client_secret = client_secret;
    }
  
    static getState() {
      throw new Error('getState() method must be implemented.');
    }
  
   static getName() {
      throw new Error('getName() method must be implemented.');
    }
  
    static getScope() {
      throw new Error('getScope() method must be implemented.');
    }
  
    static getBaseAuthorizationUrl() {
      throw new Error('getBaseAuthorizationUrl() method must be implemented.');
    }
  
    static getBaseMeUrl() {
      throw new Error('getBaseMeUrl() method must be implemented.');
    }
  
    getClientId() {
      return this.client_id;
    }
  
    getClientSecret() {
      return this.client_secret;
    }
  
    getAuthorizationUrl() {
      const queryParams = new URLSearchParams({
        client_id: this.getClientId(),
        redirect_uri: 'http://localhost:3000/callback',
        response_type: 'code',
        scope: this.constructor.getScope(),
        state: this.constructor.getState(),
      }).toString();
  
      const link = this.constructor.getBaseAuthorizationUrl() + queryParams;
      return link;
    }
  
    async getAccessToken(req) {
      try {
        const { code, state } = req.query;
        const url = this.constructor.getBaseAccessTokenUrl();
        const redirect_uri = "http://localhost:3000/callback";
        const curl = `client_id=${this.getClientId()}&redirect_uri=${redirect_uri}&client_secret=${this.getClientSecret()}&code=${code}&grant_type=authorization_code`;
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: curl,
        };

        const response = await fetch(url, options);
        const data = await response.json();
      
        if (!data.access_token || response.status !== 200) {
          throw new Error("Error: cannot get access token");
        }
      
        return data;
      } catch (err) {
        console.log(err);
      }
    }
  
    async validateToken(token) {
      try {
        const access_token = token.access_token;
        const headers = {
          "Authorization": `Bearer ${access_token}`,
        };
        const options = {
          method: "GET",
          headers,
        };
        const response = await fetch(this.constructor.getBaseMeUrl(), options);
      
        if (!response.ok) {
          throw new Error("Error: cannot validate token");
        }
      
        const user = await response.json();
        return user;
      } catch (err) { 
        console.log(err);
      }
      
    }
    
}  

module.exports = Provider;
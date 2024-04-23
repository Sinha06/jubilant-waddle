const routes = require('./routes');
const { join } = require('path');
const configSchema = require('./configSchema');
const { fetchConfig } = require('./framework/config/utils');
const Hapi = require('@hapi/hapi');

class FoodHubService {
    async onBoot () {
        console.log('Starting application');
      }
    
      async getConfig () {
        if (this._config) return this._config;
    
        const localConfigPath = join(__dirname, '..', 'config.json');
        const rawConfig = await fetchConfig({ localConfigPath });
        const { error, value } = configSchema.options({ stripUnknown: true }).validate(rawConfig);
        if (error) {
          throw new Error(
            `Incorrect configuration: ${error.details[0].message}`
          );
        }
        this._config = value;
        return this._config;
      }
    
      async getMongoDb () {
        if (this._db) return this._db;
    
        const config = await this.getConfig();
        const {
          MONGO_DB_URL,
          MONGO_DB_NAME,
          SSL_CA,
          SSL_KEY,
          CA_PATH,
          KEY_PATH
        } = config;
    
        const sslParams = getSSLCaAndKey(SSL_CA, SSL_KEY, CA_PATH, KEY_PATH);
    
        this._dbClient = await getDbClient(MONGO_DB_URL, sslParams);
        this._db = this._dbClient.db(MONGO_DB_NAME);
        return this._db;
      }
    
      // Initialize http server.
      async getHttpServer () {
        if (this._server) return this._server;

        const config = await this.getConfig();
        this._server = Hapi.server({
          port: config.HOSTED_PORT,
          host: config.HOSTED_HOST
        });
        this._server.app.service = this;
        this._server.route(routes);
        return this._server;
      }
}

module.exports = {
  FoodHubService
};
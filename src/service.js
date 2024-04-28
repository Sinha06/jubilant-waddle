import routes from './routes/index.js';
import path, {join} from 'path';
import { fileURLToPath } from 'url';
import configSchema from './configSchema.js';
import { fetchConfig } from './framework/config/utils.js';
import { server } from '@hapi/hapi';
import * as hapiAuthjwt2 from 'hapi-auth-jwt2';
import { MongoClient, ServerApiVersion } from 'mongodb';

import SecurityHandler from './services/security/SecurityHandlers.js';
import JwtTokenProvider from './lib/JwtTokenProvider/JwtTokenProvider.js';
import { validateToken, validateError } from './lib/JwtTokenProvider/validateTokenUtils.js';
import UserProvider from './services/user/UserProvider.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
class FoodHubService {
  async onBoot() {
    console.log("Starting application");
  }

  async getConfig() {
    if (this._config) return this._config;

    const localConfigPath = join(__dirname, "..", "config.json");
    const rawConfig = await fetchConfig({ localConfigPath });
    const { error, value } = configSchema
      .options({ stripUnknown: true })
      .validate(rawConfig);
    if (error) {
      throw new Error(`Incorrect configuration: ${error.details[0].message}`);
    }
    this._config = value;
    return this._config;
  }

  async getHttpServer() {
    if (this._server) return this._server;

    const config = await this.getConfig();
    this._server = server({
      port: config.HOSTED_PORT,
      host: config.HOSTED_HOST,
    });
    await this._server.register(hapiAuthjwt2);
    this._server.auth.strategy('jwt_strategy', 'jwt', {
      key: config.TOKEN_VALIDATIONKEY,
      verify: {
        aud: false,
        iss: false,
        sub: false,
        nbf: true,
        exp: false
    },
      validate: validateToken,
      errorFunc: validateError,
    });
    this._server.app.service = this;
    this._server.route(routes);
    return this._server;
  }
  async getMongoDb () {
    if (this._db) return this._db;

    const config = await this.getConfig();

    const { MONGO_DB_URL } = config;
    this._dbClient = new MongoClient(MONGO_DB_URL, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    await this._dbClient.connect();
    this._db = await this._dbClient.db("ecommerce")
    return this._db;
  }

  async getSecurityHandler() {
    if (this._securityHandler) return this._securityHandler;

    const jwtTokenProvider = await this.getJwtTokenProvider();
    const userProvider = await this.getUserProvider();
    this._securityHandler = new SecurityHandler(jwtTokenProvider, userProvider);
    return this._securityHandler;
  }
  async getJwtTokenProvider() {
    if (this._jwtTokenProvider) return this._jwtTokenProvider;

    const config = await this.getConfig();
    this._jwtTokenProvider = new JwtTokenProvider(config);
    return this._jwtTokenProvider;
  }

  async getUserProvider() {
    if (this._userProvider) return this._userProvider;

    this._userProvider = new UserProvider(this);
    return this._userProvider;
  }
}

export default FoodHubService;
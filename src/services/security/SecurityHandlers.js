import { badImplementation } from '@hapi/boom';
import auth from 'basic-auth';
import { v4 as uuidv4 } from 'uuid';
import Boom from '@hapi/boom';

class SecurityHandler {
    constructor(jwtTokenProvider, userProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userProvider = userProvider;
    }
  generateCustomerId() {
    const customerId = uuidv4();
    return customerId;
  }

  getAnonymousCustomerTokenData(subjectId) {
    const tokenData = {
      customerId: this.generateCustomerId(subjectId),
      name: '',
      isRegistered: false,
      roles: ['Everyone'],
      sub: subjectId
    };
    return tokenData;
  }

  async getExistingCustomerTokenData(email, password, subjectId) {
    const { isUserValid, user, message } = await this.userProvider.validateCredentials(email, password);
    if (!isUserValid) {
        throw new Error(message);
      }
      return {
        customerId: user.customerId,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        roles: ['Everyone'],
        isRegistered: true,
        sub: subjectId,
      };
  }

  getTokenData(email, password, subjectId) {
    const isAnonymous = (!email || !password);
    if (isAnonymous) {
      return this.getAnonymousCustomerTokenData(subjectId);
    }
    return this.getExistingCustomerTokenData(email, password, subjectId);
  }

  async getToken(email, password, subjectId) {
    const tokenData = await this.getTokenData(email, password, subjectId);
    
    const token = {
        'token': this.jwtTokenProvider.getToken(tokenData, { expiresIn: 30 * 1000 })
      };
   return token;
  }

  generateToken(request) {
    const user = auth(request);
    const email = user?.name || null;
    const password = user?.pass || null;
    const subjectId = request.payload.sub;
    return this.getToken(email, password, subjectId);
  }

  async login(email, password, subjectId) {
    try {
      if (!email || !password) {
        console.error('Invalid email address or password', 'Invalid Login Details');
        return Boom.unauthorized('Invalid email address or password', 'Invalid Login Details');
      }

      const { isUserValid, user, message } = await this.userProvider.validateCredentials(email, password);
      if (!isUserValid) {
        return Boom.unauthorized(`Invalid email address or password ${message}`);
      }
      const { token } = await this.getToken(user.email, password, subjectId);
      const name = `${user.firstName} ${user.lastName}`;
      return {
        token,
        customerId: user.customerId,
        email: user.email,
        name,
        isRegistered: true,
        roles: user.roles ? ['Everyone'].concat(user.roles) : ['Everyone']
      };

    } catch (err) {
      throw badImplementation(err);
    }
  }
}

export default SecurityHandler;

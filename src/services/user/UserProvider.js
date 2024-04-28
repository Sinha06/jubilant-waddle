import UserRepository from './UserRepository.js';
import { generateSalt, encode} from './utills/passwordUtils.js';
import Boom from '@hapi/boom';
class UserProvider {
    constructor(service) {
        this.service = service;
        this.userRepository = new UserRepository(service);
    }

    async validateCredentials(email, password) {
        const user = await this.userRepository.getUserByEmail(email);
        if (!user) {
          return {
            isUserValid: false,
            message: 'Invalid email address or password',
            user: null
          };
        }
        const encodededPassword = await encode(password, user.salt);
        const isUserValid = user.password === encodededPassword;
        return {
          isUserValid,
          message: "valid user",
          user: {
            customerId: user.customerId,
            password: user.password,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        };

    }

    async createNewUser (userPayload, headerCredentials) {
      try {
        const { customerId } = headerCredentials;
        const existingUser = await this.userRepository.getUserByEmail(userPayload.email.toLowerCase());
        if (existingUser) {
          console.error(`Email already exists ${headerCredentials.customerId}`);
          throw Boom.badData("email already exist");
        }

        const userExist = await this.userRepository.getUserByCustomerId(customerId);
        if (userExist) {
          console.error(`User already exists ${userExist.customerId}`, {customerId});
          throw Boom.badData("user already exist");
        }

        const salt = await generateSalt();
        const userData = {
          title: userPayload.title,
          firstName: userPayload.firstName,
          lastName: userPayload.lastName,
          email: userPayload.email.toLowerCase(),
          customerId: headerCredentials.customerId,
          password: await encode(userPayload.password, salt),
          salt,
          phoneNumbers: {
            mobile: userPayload.phoneNumber,
          },
        };

        await this.userRepository.createNewUser(userData);
        const securityHandler  = await this.service.getSecurityHandler();
        return await securityHandler.login(userData.email, userPayload.password);
      } catch (err) {
        if (err.message === 'email already exist') {
          console.error('Email already exist. Please login');
          throw Boom.conflict('Email already exist. Please login');
        } else if (err.message === 'user already exist') {
          console.error('You are already logged in!');
          throw Boom.conflict('You are already logged in!');
        }
        console.error('Server error: ', err);
        throw Boom.badImplementation('Server error: ' + err);
      }
      
    }
}
export default UserProvider;
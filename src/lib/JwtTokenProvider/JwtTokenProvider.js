import JWT from 'jsonwebtoken';

class JwtTokenProvider {
  constructor (config) {
    this._config = config;
  }

  getToken (tokenData, tokenOptions) {
    const privateKey = this._config.TOKEN_VALIDATIONKEY;
    const token = this._encryptToken(tokenData, privateKey, tokenOptions);
    return token;
  }


  decryptToken (token) {
    const privateKey = this._config.TOKEN_VALIDATIONKEY;
    return JWT.verify(token, privateKey, { maxAge: '365d', ignoreExpiration: true });
  }


  _encryptToken (tokenData, privateKey, tokenOptions)
  {
    const token = JWT.sign(tokenData, privateKey, tokenOptions);
    return token;
  }
}

export default JwtTokenProvider;

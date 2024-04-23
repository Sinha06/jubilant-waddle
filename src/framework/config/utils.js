const {readFileSync} = require('fs');

const CONFIG_SOURCES = {
    ENV: 'ENV',
    FILE: 'FILE'
  };

const loadJson = (path) => {
    console.info(`Loading ${path}`);
    const configFileContent = readFileSync(path).toString();
    return JSON.parse(configFileContent);
  };

  const fetchConfig = (options) => {
    try {
        const configSource = process.env.CONFIG_SRC;
        if (!configSource || configSource === CONFIG_SOURCES.ENV) {
            console.info('Loading configuration from environments variables');
        }
        if (configSource === CONFIG_SOURCES.FILE) { // deprecated
            if (!options.localConfigPath) {
              throw new Error('You must pass localConfigPath.');
            }
      
            return loadJson(options.localConfigPath);
          }
          throw new Error(`Unrecognized ZORO_CONFIG_SRC: ${configSource}`);

        
    } catch (error) {
        console.error('error.fetching.config', error, options);
        throw error;
    }

  };

  module.exports = {
    loadJson,
    fetchConfig
  }
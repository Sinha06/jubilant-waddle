import { readFileSync } from 'fs';

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
        // eslint-disable-next-line no-undef
        const configSource = process.env.CONFIG_SRC;
        if (!configSource || configSource === CONFIG_SOURCES.ENV) {
            console.info('Loading configuration from environments variables');
        }
        if (configSource === CONFIG_SOURCES.FILE) {
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

  export {
    loadJson,
    fetchConfig
  }
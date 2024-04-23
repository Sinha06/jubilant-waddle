const { FoodHubService } = require('../../service');
const init = async () => {
    const service = new FoodHubService();
    await service.onBoot();
    try {
      if (service.onInvoke) {
        await service.onInvoke();
      }
      if (service.getHttpServer) {
        const server = await service.getHttpServer();
        if (server) {
          server.start();
        }
        console.info(`Http server running on ${server.info.uri}`);
      }
    } catch (err) {
        console.error('Error starting service:', err);
    }
    if (service.onExit) {
      service.onExit();
    }
  };

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
  });
  
  init();
import 'dotenv/config';
import db from './config/database.js';
import Logger from './config/logger.js';
import App from './app.js';

const MAX_RETRY = 20;
const LOG = new Logger('server.js');
const { PORT = 3000 } = process.env;

const startApplication = async (retryCount) => {
  try {
    await db.sequelize.authenticate();
    App.listen(PORT, () => {
      LOG.info(`Application started at http://localhost:${PORT}`);
    });

  } catch (e) {
    LOG.error(e);

    const nextRetryCount = retryCount - 1;
    if (nextRetryCount > 0) {
      setTimeout(async () => await startApplication(nextRetryCount), 3000);
      return;
    }

    LOG.error('Unable to start application');
  }
};

startApplication(MAX_RETRY);

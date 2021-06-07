import Express from 'express';
import HealthcheckController from './controllers/HealthcheckController.js';
import RegisterController from './controllers/RegisterController.js';
import ReportController from './controllers/ReportController.js';

const router = Express.Router();

router.use('/', HealthcheckController);
router.use('/register',RegisterController);
router.use('/reports',ReportController);

export default router;

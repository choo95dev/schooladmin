import Express from 'express';
import { StatusCodes } from 'http-status-codes';

const HealthcheckController = Express.Router();

const healthcheckHandler = async (req, res) => {
  return res.sendStatus(StatusCodes.OK);
}

const redirectHandler = async (req,res) =>{
  return res.redirect('api/healthcheck');
}

HealthcheckController.get('/',redirectHandler);
HealthcheckController.get('/healthcheck', healthcheckHandler);
export default HealthcheckController;

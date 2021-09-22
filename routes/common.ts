import Router from 'koa-router';
import Auth from '../utils/auth';
import { commonController } from '../controller/common';

const commonRouter = new Router({  prefix: "/common" });
const authMiddleWare = Auth.verifyUserToken();

commonRouter.post('/uploadOss', authMiddleWare, commonController.uploadFile);
commonRouter.post('/uploadStream', authMiddleWare, commonController.uploadFileStream);
commonRouter.get('/getDownloadUrl', authMiddleWare, commonController.downloadUrl);
commonRouter.delete('/deleteFile', authMiddleWare, commonController.deleteFile);
commonRouter.post('/deleteGroup', authMiddleWare, commonController.deleteGroupFile);
commonRouter.post('/sendEmail', commonController.sendEmail);

export default commonRouter;
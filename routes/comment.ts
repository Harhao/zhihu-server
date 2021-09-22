import Router from 'koa-router';
import Auth from '../utils/auth';
import { commentController } from '../controller/comment';

const commentRouter = new Router({  prefix: "/comment" });
const authMiddleWare = Auth.verifyUserToken();

commentRouter.post('/create', authMiddleWare, commentController.create);
commentRouter.delete('/delete/:id', authMiddleWare, commentController.delete);
commentRouter.get('/list', authMiddleWare, commentController.getCommentList);

export default commentRouter;
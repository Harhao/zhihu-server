import Router from 'koa-router';
import Auth from '../utils/auth';
import { userController } from '../controller/user';

const userRouter = new Router({  prefix: "/users" });
const authMiddleWare = Auth.verifyUserToken();

userRouter.get('/getUser/:id', authMiddleWare, userController.getUserById);
userRouter.get('/allUser', authMiddleWare, userController.getUser);
userRouter.get('/listFollower', authMiddleWare, userController.listFollower);
userRouter.get('/getFansList', authMiddleWare, userController.getFansList);
userRouter.get('/collection', authMiddleWare, userController.getCollect);
userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.post('/follow/:id', authMiddleWare, userController.followUser);
userRouter.delete('/unfollow/:id', authMiddleWare, userController.unfollowUser);
userRouter.put('/update', authMiddleWare, userController.updateUser);
userRouter.post('/collect/:id', authMiddleWare, userController.collectArticle);


export default userRouter;
import Router from 'koa-router';
import Auth from '../utils/auth';
import { articleController } from '../controller/article';

const articleRouter = new Router({ prefix: "/articles" });
const authMiddleWare = Auth.verifyUserToken();

articleRouter.post('/create', authMiddleWare, articleController.createArticle);
articleRouter.get('/list', authMiddleWare, articleController.getArticleList);
articleRouter.delete('/delete/:articleId', authMiddleWare, articleController.deleteArticle);
articleRouter.put('/update', authMiddleWare, articleController.updateArticle);
articleRouter.get('/follower/list', authMiddleWare, articleController.getFollowArticle);
articleRouter.get('/getHotArticle', authMiddleWare, articleController.getHotArticle);

export default articleRouter;
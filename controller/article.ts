import { Context } from 'koa';
import Joi from 'joi';
import { articleModel }  from '../model/article';
import { userModel } from '../model/user';

class ArticleController {
    async createArticle(ctx: Context) {
      const shcema = Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required(),
        type: Joi.number().required(),
        catalog: Joi.number().required(),
        isHot: Joi.boolean()
      });
      try {
        const value = await shcema.validateAsync(ctx.request.body);
        const requestParams = {
            ...value, 
            content: value.content, 
            title: value.title,
            userId: ctx.state.user._id
        }
        const article = (await new articleModel(requestParams).save()) as any;
        const { articleId } = article;
        ctx.body = {
            code: 200,
            data: {
                articleId 
            },
            msg: '创建成功'
        };
      } catch(e) {
        ctx.body = e;
      }
    }

    async deleteArticle(ctx: Context) {
        const schema = Joi.object({
            articleId: Joi.string().required()
        });
        try {
            const data = await schema.validateAsync(ctx.params)
            const result = (await articleModel.findOneAndDelete({ articleId: data.articleId })) as any;
            if(result?.articleId) {
                ctx.body = {
                    code: 200,
                    data: {
                        articleId: result.articleId
                    },
                    msg: '删除成功'
                };
                return;
            }
        } catch(e) {
            ctx.body = e;
        }
    }

    async getArticleList(ctx: Context) {
        const userId = ctx.state.user._id;
        const result = await articleModel.find({ userId });
        ctx.body= result;
    }

    async updateArticle(ctx: Context) {
        const schema = Joi.object({
            type: Joi.number().required(),
            title: Joi.string().required(),
            catalog: Joi.number().required(),
            content: Joi.string().required(),
            articleId: Joi.string().required()
        });
        try {
            const data = await schema.validateAsync(ctx.request.body);
            const articleId = data.articleId;
            const result = await articleModel.findOne({ articleId}).update(data);
            if(!!result) {
                ctx.body = result;
            }
        } catch(e) {
            ctx.throw(e);
        }
    } 

    async getFollowArticle(ctx: Context) {
        const schema = Joi.object({
            page: Joi.number().required(),
            size: Joi.number().required()
        });
        try {
            const data = await schema.validateAsync(ctx.request.body);
            const followerlist = (await userModel.findById({ _id: ctx.state.user._id }).select('+followUser').populate('followUser')) as any;
            const followerIdList = followerlist.followUser.map((follower: { _id: string; }) => follower._id);
            const result = await 
            articleModel.find().where('userId').in(followerIdList).skip((data.page - 1)* data.size).limit(data.size).sort({ time: 1 }).exec();
            ctx.body = {
                code: 200,
                data: result,
                msg: '获取关注列表成功'
            };
        } catch(e) {
            ctx.body = e;
        }

    }

    async  getHotArticle(ctx: Context) {
        const schema = Joi.object({
            page: Joi.number().required(),
            size: Joi.number().required(),
            catalog: Joi.number()
        });
        try {
            const data = await schema.validateAsync(ctx.request.body);
            const params = data.catalog? { catalog: data.catalog }: {};
            const result = await articleModel.find(params).skip((data.page -1)* data.size).limit(data.size);
            ctx.body = {
                code: 200,
                data: result,
                msg: '获取成功'
            };
        } catch(e) {
            ctx.body = e;
        }
    }
}

const articleController = new ArticleController();
export { articleController }; 
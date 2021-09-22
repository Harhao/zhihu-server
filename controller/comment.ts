import { Context } from 'koa';
import Joi from 'joi';
import { commentModel }  from '../model/comment';

class CommentController {
    async create(ctx: Context) {
        const schema = Joi.object({
            content: Joi.string().required(),
            articleId: Joi.string().required(),
        });
        try {
            const data = await schema.validateAsync(ctx.request.body);
            const params = {
                content: data.content,
                userId: ctx.state.user._id,
                articleId: data.articleId
            };

            const result = await new commentModel(params).save();
            ctx.body = {
                code: 200,
                data: {
                    commentId: result._id
                },
                msg: '评论成功'
            };
        } catch(e) {
            ctx.body = e
        }
    }

    async delete(ctx: Context) {
        const schema = Joi.object({
            id: Joi.string().required()
        });
        try {
            const data = await schema.validateAsync(ctx.params);
            const result = await commentModel.findByIdAndDelete({ _id: data.id, userId: ctx.state.user._id });
            if(result._id) {
                ctx.body = {
                    code: 200,
                    data: {
                        commentId: result._id
                    },
                    msg: '删除成功'
                };
                return;
            }
            ctx.body = {
                code: 400,
                msg: '你没有权限删除他人评论',
                data: null
            }

        } catch(e) {
            ctx.body = e
        }
    }

    async getCommentList(ctx: Context) {
        const schema = Joi.object({
            articleId: Joi.string().required(),
            page: Joi.number().required(),
            size: Joi.number().required()
        });
        try {
            const data = await schema.validateAsync(ctx.request.body);
            const result = await commentModel.find({ articleId: data.articleId }).skip((data.page - 1)* data.size).limit(data.size);
            if(result.length) {
                ctx.body = {
                    code: 200,
                    data: result,
                    msg: null
                };
            }

        } catch(e) {
            ctx.body = e
        }
    }
}

const commentController = new CommentController();
export { commentController }; 
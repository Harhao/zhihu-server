import Koa, { Context } from 'koa';
import Joi, { cache } from 'joi';
import Auth from '../utils/auth';
import { userModel }  from '../model/user';
class UserController {
    async register(ctx: Context) {
        const schema = Joi.object({ 
            name: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
            phone: Joi.string().regex(/^1[3-9]\d{9}$/).required(),
        });

        try {
            const value = await schema.validateAsync(ctx.request.body);
            const { name, password, phone } = value;
            const isExistUser = await userModel.findOne({ phone });
            if(!isExistUser) {
                const user = await new userModel({ name, password: Auth.createHash(password), phone }).save();
                if(!!user) {
                    ctx.body = {
                        code: 200,
                        msg: '注册成功',
                        data: null
                    };
                }
                return;
            }
            ctx.body = {
                code: 200,
                msg: '该手机号码用户已存在',
                data: null
            };
        } catch(e) {
            ctx.body = e;
        }

    }

    // 查询具体用户
    async getUserById(ctx: Context) {
        const schema = Joi.object({ id: Joi.string().required()});
        try {
            const value = schema.validateAsync(ctx.params);
            const user = await userModel.findOne({ _id: ctx.params.id });
            if(!user) ctx.throw({ code: 404, msg: '查无此用户' });
            ctx.body = { code: 200, data: user, msg: null };
        } catch(e) {
            ctx.body = e;
        }
    }

    async getUser(ctx: Context ) {
        const userList = await userModel.find();
        ctx.body = userList;
    }

    async login(ctx: Context) {
        const schema = Joi.object({ 
            name: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        });
        try {
            const value = await schema.validateAsync(ctx.request.body);
            const { name, password } = value;
            const user: any = await userModel.findOne({ name, password: Auth.createHash(password)});
            if(!user) ctx.body = { code: 401, msg: '用户名密码错误', data: null };
            const { _id } = user;
            const token = Auth.getUserToken({ _id, name}, { expiresIn: "1d" });
            ctx.body = {
                code: 200,
                data: { token },
                msg: '登陆成功',            
            }  
        } catch (e) {
            ctx.body = e;
        }     
    }

    
    async followUser(ctx: Context) {
        const schema = Joi.object({ id: Joi.string().required()});
        try {
            const value = await schema.validateAsync(ctx.params);
            const userId = ctx.state.user._id;
            const user: any = await userModel.findById({ _id: userId }).select('+followUser');
            if(!user.followUser.includes(value.id)) {
                user.followUser.push(value.id);
                user.save();
                ctx.body = {
                    code: 200,
                    msg: '关注成功',
                    data: value.id
                }
                return;
            }
            ctx.body = {
                code: 400,
                msg: '你已关注了该用户',
                data: null
            };
        } catch(e) {
            console.log(e);
        }
    }

    // 取消关注用户
    async unfollowUser(ctx: Context) {
        const schema = Joi.object({ id: Joi.string().required()});
        try {
            const value = await schema.validateAsync(ctx.params);
            const userId = ctx.state.user._id;
            const user: any = await userModel.findById({ _id: userId }).select('+followUser');
            const deleteIndex = user.followUser.indexOf(value.id)
            if(deleteIndex > -1) {
                user.followUser.splice(deleteIndex, 1);
                user.save();
                ctx.body = {
                    code: 200,
                    msg: '取消关注成功',
                    data: null
                }
                return;
            }
            ctx.body = {
                code: 400,
                msg: '并没有关注该用户',
                data: null
            };
        } catch(e) {
            console.log(e);
        }
    }

    // 列举用户关注列表
    async listFollower(ctx: Context) {
        const user = await userModel.findById({ _id: ctx.state.user._id }).select('+followUser').populate('followUser');
        if(!!user) {
            ctx.body = {
                code: 200,
                data: user,
                msg: '获取成功'
            };
            return user;
        }
    }

    // 获取用户粉丝列表
    async getFansList(ctx: Context) {
        const users = await userModel.find({ followUser: ctx.state.user._id });
        if(!!users) {
            ctx.body = {
                code: 200,
                data: users,
                msg: '获取粉丝列表成功'
            };
        }
    }

    async updateUser(ctx: Context) {
        const schema = Joi.object({
            name: Joi.string().alphanum().min(3).max(30),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
            phone: Joi.string().regex(/^1[3-9]\d{9}$/),
            gender: Joi.number(),
            avatarUrl: Joi.string(),
            education:Joi.string(),
            occupation: Joi.string(),
            introduce: Joi.string(),
            email: Joi.string(),
            isOffLine: Joi.boolean(),
        });

        try {
            const data = await schema.validateAsync(ctx.request.body);
            const _id = ctx.state.user._id;
            const result = await userModel.findByIdAndUpdate(_id, data);
            if(!!result) {
                ctx.body = {
                    code: 200,
                    msg: '更新成功',
                    data: null
                }
            }

        } catch(e) {
            ctx.body = e;
        }
    }
    async collectArticle(ctx: Context) {
        const schema = Joi.object({
            id: Joi.string().required()
        });
        try {
            const data = await schema.validateAsync(ctx.params);
            const result = (await userModel.findOne({ _id: ctx.state.user._id }).select('+collections')) as any;
            const isInCollection = result.collections.includes(data.id);
            if(!isInCollection) {
                result.collections.push(data.id);
                result.save();
                ctx.body = {
                    code: 200,
                    data: null,
                    msg: '收集成功'
                };
            }
            ctx.body = result;
        } catch(e) {
            ctx.body = e;
        }
    }

    async getCollect(ctx: Context) {
        const _id = ctx.state.user._id;
        const result = await userModel.find({ _id }).select('+collections').populate('collections');
        ctx.body = result; 
    }

}

const userController = new UserController();

export { userController }; 
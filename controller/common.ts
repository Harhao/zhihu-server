
import Joi from 'joi';
import path from 'path';
import uploadService from '../utils/oss-upload';
import { connectToRedis  } from '../config/db';
import { Context } from 'koa';
import { RedisClient } from 'redis';

class CommonController {
    private produceClient: RedisClient = null;
    constructor() {
        this.produceClient = connectToRedis();
    }

    // 上传图片文件到七牛云
    async uploadFile(ctx: Context) {
        const file = ctx.request.files.file as any;
        const key = path.basename(`${Date.now()}_${file.name}`);
        const localFile = file.path;
        try {
            const result = await uploadService.uploadFile(key, localFile);
            ctx.body = {
                code: 200,
                data: {
                    hash: result?.data?.hash,
                    key: result?.data?.key,
                    requestUrl: result?.requestUrls
                },
                msg: null
            };
        } catch (e) {
            ctx.throw(e);
        }
    }
    // 通过流的方式上传
    async uploadFileStream(ctx: Context) {
        const file = ctx.request.files.file as any;
        const key = path.basename(`${Date.now()}_${file.name}`);
        const localFile = file.path;
        try {
            const result = await uploadService.uploadStreamFile(key, localFile);
            if (!!result) {
                ctx.body = {
                    code: 200,
                    data: {
                        hash: result?.data?.hash,
                        key: result?.data?.key,
                        requestUrl: result?.requestUrls
                    },
                    msg: null
                };
                return;
            }
            ctx.body = { code: 400, msg: '上传失败', data: result }
        } catch (e) {
            ctx.body = e;
        }

    }

    async downloadUrl(ctx: Context) {
        const schema = Joi.object({
            filename: Joi.string().required(),
        });
        try {
            const value = await schema.validateAsync(ctx.query);
            const filename = value.filename;
            const fileInfo = await uploadService.getFileStat(filename);
            if (!fileInfo?.error) {
                const result = await uploadService.downloadFile(filename);
                ctx.body = {
                    code: 200,
                    msg: null,
                    data: {
                        url: result
                    }
                }
                return;
            }
            ctx.body = {
                code: 400,
                msg: '不存在该图片',
                data: null
            }
        } catch (e) {
            ctx.body = e;
        }
    }

    // 删除图片
    async deleteFile(ctx: Context) {
        const schema = Joi.object({
            filename: Joi.string().required()
        });
        try {
            const value = await schema.validateAsync(ctx.request.body);
            const filename = value.filename;
            const fileInfo = await uploadService.getFileStat(filename);
            if (!fileInfo?.error) {
                const result = await uploadService.deleteFile(filename);
                if (!!result) {
                    ctx.body = {
                        code: 200,
                        msg: '删除成功',
                        data: null
                    }
                    return;
                }
            }
            ctx.body = fileInfo.error;

        } catch (e) {
            ctx.body = e;
        }

    }
    // 批量删除文件
    async deleteGroupFile(ctx: Context) {
        const schema = Joi.object({
            fileList: Joi.array().items(Joi.string()).required()
        })
        try {
            const data = await schema.validateAsync(ctx.request.body);
            const result = await uploadService.deleteGroupFile(data.fileList);
            ctx.body = result;
        } catch (e) {
            ctx.body = e;
        }
    }

    sendEmail = async (ctx: Context) => {
        const schema = Joi.object({
            email: Joi.string().pattern(
                new RegExp('^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$')
            ).required(),
            type: Joi.string().required()
        });
        try {
            const data = await schema.validateAsync(ctx.request.body);
            const isSuccess =  await this.produceClient.publish('send-email', JSON.stringify(data));
            if(isSuccess) {
                ctx.body = {
                    code: 200,
                    data: null,
                    msg: '已发送到邮箱中'
                };
            }
            
        } catch (e) {
            ctx.body = e;
        }
    }
}

const commonController = new CommonController();

export { commonController };
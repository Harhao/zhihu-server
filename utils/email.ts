import config from '../config/config';

export const transportOptions = {
    host: 'smtp.163.com',
    auth: {
        user: config.Email,
        pass: config.EmailPass,
    },
    port: 465,
    secure: true,
    logger: true
};

export const verifyTemplate = {
    from: `"知乎注册验证码服务" <${config.Email}>`,
    subject: "方式: 邮箱注册服务",
    
};

export const findPassTemplate = {
    from: `"知乎找回密码服务" <${config.Email}>`,
    subject: "方式: 找回服务",
};

export const templateList = {
    'register': verifyTemplate,
    'findPass': findPassTemplate,
};

export const getTemplateHtml = (type: string) => {
    if (type === 'register') {
        const verifyCode = Math.floor(Math.random() * 10000);
        const html = `<div style="color: #0000ff; font-size: 20px">获取到的验证码是${verifyCode}, 3分钟内有效</div>`;
        return html;
    }
    return `<a href="##">点击此处对密码进行充值</a>`
}

export type templateKey = 'register' | 'findPass';
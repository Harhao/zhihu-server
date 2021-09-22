import { connectToRedis } from '../config/db'
import nodemailer, { TransportOptions } from 'nodemailer'
import {
  transportOptions,
  templateList,
  templateKey,
  getTemplateHtml,
} from '../utils/email'

interface EmailParams {
  type: templateKey
  email: string
}

export const runTask = async () => {
  const redisClient = connectToRedis()
  redisClient.on('message', async (channel: string, message: string) => {
    const data = JSON.parse(message)
    switch (channel) {
      case 'send-email':
        return sendEmail(data);
      default:
    }
  })
  redisClient.subscribe('send-email')
}

export const sendEmail = (data: EmailParams): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    if (Object.keys(templateList).includes(data.type)) {
      const key: templateKey = data.type
      const template = templateList[key]
      const html = getTemplateHtml(key)
      const transporter = nodemailer.createTransport({
        ...transportOptions,
      } as TransportOptions)
      const sendOptions = {
        to: data.email,
        html: html,
        ...template,
      }
      const info = (await transporter.sendMail({ ...sendOptions })) as any
      info.response ? resolve(info.response) : reject(info)
    }
  })
}

import koa_logger from 'koa-logger'
import body from 'koa-body'
import cors from 'koa2-cors'
import moment from 'moment'

export interface ErrorType {
  name: string
  status: number
  message: string
  stack: string
}

const logger = koa_logger((requestInfo: string) => {
  console.log(moment().format('YYYY-MM-DD HH:mm:ss') + requestInfo)
})

const bodyParser = body({
  multipart: true,
  strict: false,
  formidable: {
    maxFileSize: 200 * 1024 * 1024,
  },
})

const postFormat = (err: Error, data: ErrorType) => {
  const errorStack =
    process.env.NODE_ENV === 'prod'
      ? {
          ...data,
          stack: null,
        }
      : data
  return errorStack
}

const corsOptions: cors.Options = {
  origin: '*',
  maxAge: 5,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}

export { logger, bodyParser, postFormat, corsOptions }

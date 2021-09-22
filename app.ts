import Koa from 'koa'
import cors from 'koa2-cors'
import error from 'koa-json-error'
import helmet from 'koa-helmet'
import config from './config/config'
import { connectToDB } from './config/db'
import userRouter from './routes/user'
import articleRouter from './routes/article'
import commonRouter from './routes/common'
import commentRouter from './routes/comment'
import { logger, bodyParser, postFormat, corsOptions } from './utils/middleware'
import { runTask } from './utils/tools'

try {
  connectToDB(
    () => {
      const app = new Koa()

      // 应用安全，防止xss， csrf
      app.use(helmet())
      // 防止生产环境打印stack信息
      app.use(error({ postFormat }))
      app.use(cors(corsOptions))
      app.use(logger)
      app.use(bodyParser)

      app.use(userRouter.routes()).use(userRouter.allowedMethods())
      app.use(articleRouter.routes()).use(articleRouter.allowedMethods())
      app.use(commonRouter.routes()).use(commonRouter.allowedMethods())
      app.use(commentRouter.routes()).use(commentRouter.allowedMethods())

      app.listen(config.port, () => {
        console.log(`服务器启动成功，端口监听在 ${config.port}`)
      })

      runTask()
    },
    (error: Error) => {
      throw error
    }
  )
} catch (e) {
  console.error('数据库连接异常， 请检查数据库是否可访问')
}

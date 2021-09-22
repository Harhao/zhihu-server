import dotenv from 'dotenv'
const options = {
  path: process.env.NODE_ENV === 'dev' ? '.test.env' : '.env',
}
dotenv.config(options)

export interface Config {
  port: number
  jwtSecret: string
  databaseUrl: string
  AccessKey: string
  SecretKey: string
  UploadSpace: string
  Domain: string
  Email:string
  EmailPass: string
  redisport: number
  redispass: string
  redishost: string
}
const config: Config = {
  port: +(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET,
  databaseUrl: process.env.DATABASE_URL,
  SecretKey: process.env.SECRET_KEY,
  AccessKey: process.env.ACCESS_KEY,
  UploadSpace: process.env.UPLOAD_SPACE,
  Domain: process.env.DOMAIN,
  Email: process.env.EMAIL,
  EmailPass: process.env.EMAILPASS,
  redisport: +process.env.REDISPORT,
  redispass: process.env.REDISPASS,
  redishost: process.env.REDISHOST,
}

export default config;

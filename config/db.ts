import mongoose from 'mongoose';
import redis from 'redis';
import config from './config';

function connectToDB(success: Function, failed: Function) {
  let tryTime: number = 0
  const connect = () =>
    mongoose.connect(config.databaseUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })

  mongoose.connection.on('error', (...args) => {
    console.log('数据库连接失败', ...args)
    if (tryTime <= 3) {
      tryTime++;
      connect()
      return
    }
    failed(...args)
  })

  mongoose.connection.once('open', (...args) => {
    console.log('===========================')
    console.log('MongoDB Atlas 数据库连接成功')
    console.log('===========================')
    success(...args)
  })

  connect()
}
function connectToRedis() {
  const client = redis.createClient({
    password: config.redispass,
    host: config.redishost,
    port:  config.redisport
  });
  client.on('error', (...args) => {
    console.log('===========================')
    console.log('RedisLab 数据库连接失败')
    console.log('===========================')
  });
  client.on("ready", () => {
    console.log('===========================')
    console.log('RedisLab 数据库连接成功')
    console.log('===========================')
  });
  return client;
}
export  { connectToDB, connectToRedis }

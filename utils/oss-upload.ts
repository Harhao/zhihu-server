import qiniu from 'qiniu'
import fs from 'fs'
import config from '../config/config'

class OSSUploadService {
  private bucket: string
  private accessKey: string
  private secretKey: string
  private domain: string
  private mac
  private config: any
  public bucketManager

  constructor() {
    this.bucket = config.UploadSpace
    this.accessKey = config.AccessKey
    this.secretKey = config.SecretKey
    this.domain = config.Domain
    this.mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey)
    this.config = new qiniu.conf.Config()
    this.config.zone = qiniu.zone.Zone_z2
    this.bucketManager = new qiniu.rs.BucketManager(this.mac, this.config)
  }

  // 获取七牛云授权
  private getUploadToken(): string {
    const config = { scope: this.bucket }
    const putPolicy = new qiniu.rs.PutPolicy(config)
    return putPolicy.uploadToken(this.mac)
  }

  private getUploadConfig() {
    const uptoken = this.getUploadToken()
    const formUploader = new qiniu.form_up.FormUploader(this.config)
    const putExtra = new qiniu.form_up.PutExtra()
    return { uptoken, formUploader, putExtra }
  }

  /**
   * 普通上传文件到七牛云
   * @param filename string 储存的文件名
   * @param filepath string 服务暂存文件路径
   * @returns responseInfo any | error
   */
  public async uploadFile(filename: string, filepath: string): Promise<any> {
    const { uptoken, formUploader, putExtra } = this.getUploadConfig()
    return new Promise((resolve, reject) => {
      formUploader.putFile(
        uptoken,
        filename,
        filepath,
        putExtra,
        function (error, body, info) {
          if (error) {
            reject(error)
          }
          if (info.statusCode == 200) {
            resolve(info)
          }
        }
      )
    })
  }
  /**
   * 以流的方式上传文件到七牛云
   * @param filename string 储存的文件名
   * @param filepath string 服务暂存文件路径
   * @returns responseInfo any | error
   */
  public async uploadStreamFile(
    filename: string,
    filepath: string
  ): Promise<any> {
    const { uptoken, formUploader, putExtra } = this.getUploadConfig()
    const readStream = fs.createReadStream(filepath)
    return new Promise((resolve, reject) => {
      formUploader.putStream(
        uptoken,
        filename,
        readStream,
        putExtra,
        (error, body, info) => {
          if (error) {
            reject(error)
          }
          if (info.statusCode === 200) {
            resolve(info)
          }
          resolve(body)
        }
      )
    })
  }

  /**
   * 获取七牛云文件详细信息
   * @param filename 云文件名称
   * @returns responseInfo any | error
   */
  public async getFileStat(filename: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.bucketManager.stat(this.bucket, filename, (error, body, info) => {
        if (error) {
          reject(error)
        }
        if (info.statusCode === 200) {
          resolve(info)
        }
        resolve(body)
      })
    })
  }

  /**
   * 获取七牛云文件详细信息
   * @param filename 云文件名称
   * @returns responseInfo any | error
   */
  public async deleteFile(filename: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.bucketManager.delete(
        this.bucket,
        filename,
        function (err, body, info) {
          if (err) {
            reject(err)
          }
          if (info.statusCode === 200) {
            resolve(info)
          }
        }
      )
    })
  }

  // 下载文件
  public downloadFile(filename: string): string {
    const bucketManager = new qiniu.rs.BucketManager(this.mac, this.config)
    const url = bucketManager.publicDownloadUrl(this.domain, filename)
    return url
  }

  // 批量删除文件
  public deleteGroupFile(fileList: Array<string>) {
    const deleteOperations = new Array()
    fileList.forEach((filename) =>
      deleteOperations.push(qiniu.rs.deleteOp(this.bucket, filename))
    )
    return new Promise((resolve, reject) => {
      this.bucketManager.batch(
        deleteOperations,
        (err: any, body: any, info: any) => {
          if (err) {
            reject(err)
          } else {
            const statusCode: number = info.statusCode
            if (Math.floor(statusCode / 2) == 2) {
              const successFileList = new Array()
              const errorFileList = new Array()
              body.forEach((item: any) => {
                if (item.code == 200) {
                  successFileList.push(item.data)
                } else {
                  errorFileList.push(item.data)
                }
                resolve({
                  successFileList,
                  errorFileList,
                })
              })
            } else {
              reject(body)
            }
          }
        }
      )
    })
  }
}

const uploadService = new OSSUploadService()
export default uploadService

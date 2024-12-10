// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const { fileID } = event

  try {
    // 获取真实链接
    const result = await cloud.getTempFileURL({
      fileList: [fileID]
    })

    return {
      fileID,
      tempFileURL: result.fileList[0].tempFileURL,
      errMsg: result.errMsg
    }
  } catch (err) {
    return {
      err,
      errMsg: err.message
    }
  }
}

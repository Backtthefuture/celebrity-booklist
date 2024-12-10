// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const { type, data } = event

  switch (type) {
    case 'add':
      // 添加名人信息
      return await db.collection('celebrities').add({
        data: {
          name: data.name,
          introduction: data.introduction,
          avatar: data.avatar,
          books: data.books || [],
          createTime: db.serverDate()
        }
      })

    case 'update':
      // 更新名人信息
      return await db.collection('celebrities').doc(data._id).update({
        data: {
          name: data.name,
          introduction: data.introduction,
          avatar: data.avatar,
          books: data.books,
          updateTime: db.serverDate()
        }
      })

    case 'delete':
      // 删除名人信息
      return await db.collection('celebrities').doc(data._id).remove()

    case 'get':
      // 获取名人列表
      const { data: celebrities } = await db.collection('celebrities')
        .orderBy('createTime', 'desc')
        .get()
      
      // 返回格式化后的数据
      return {
        data: celebrities,
        errMsg: 'collection.get:ok'
      }

    default:
      return {
        errMsg: 'unknown type'
      }
  }
}

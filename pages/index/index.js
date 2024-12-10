// index.js
Page({
  data: {
    currentIndex: 0,
    celebrities: []
  },

  onLoad() {
    console.log('页面加载')
    this.loadCelebrityData()
  },

  onShow() {
    console.log('页面显示')
    this.loadCelebrityData()
  },

  async loadCelebrityData() {
    console.log('开始加载数据')
    try {
      // 改用云函数获取数据
      const { result } = await wx.cloud.callFunction({
        name: 'manageCelebrity',
        data: {
          type: 'get'
        }
      })
      
      console.log('云函数返回数据：', result)
      
      if (!result || !result.data || result.data.length === 0) {
        console.log('没有找到数据')
        this.setData({ celebrities: [] })
        return
      }

      // 格式化数据
      const formattedData = result.data.map(item => {
        console.log('处理数据项：', item)
        return {
          id: item._id,
          name: item.name || '',
          introduction: item.introduction || '',
          avatar: item.avatar || '',
          books: Array.isArray(item.books) ? item.books.map(book => ({
            ...book,
            cover: book.cover || ''
          })) : []
        }
      })
      
      console.log('格式化后的数据：', formattedData)
      
      this.setData({
        celebrities: formattedData
      }, () => {
        console.log('数据更新完成，当前数据：', this.data.celebrities)
      })
    } catch (error) {
      console.error('加载数据失败：', error)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  handleSwiper(e) {
    this.setData({
      currentIndex: e.detail.current
    })
  }
})

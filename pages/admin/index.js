// pages/admin/index.js
const app = getApp()

Page({
  data: {
    newCelebrity: {
      name: '',
      introduction: '',
      avatar: '',
      books: []
    },
    newBook: {
      title: '',
      author: '',
      cover: '',
      description: ''
    },
    celebrities: [], // 添加名人列表
    isEditing: false, // 是否处于编辑状态
    editingId: '', // 正在编辑的名人ID
  },

  onLoad() {
    this.loadCelebrities()
  },

  // 加载名人列表
  async loadCelebrities() {
    try {
      wx.showLoading({ title: '加载中...' })
      const { result } = await wx.cloud.callFunction({
        name: 'manageCelebrity',
        data: { type: 'get' }
      })
      console.log('获取名人列表成功：', result)
      this.setData({ celebrities: result.data || [] })
    } catch (err) {
      console.error('获取名人列表失败：', err)
      wx.showToast({ title: '加载失败', icon: 'error' })
    } finally {
      wx.hideLoading()
    }
  },

  // 编辑名人信息
  editCelebrity(e) {
    const { celebrity } = e.currentTarget.dataset
    this.setData({
      newCelebrity: { ...celebrity },
      isEditing: true,
      editingId: celebrity._id
    })
  },

  // 取消编辑
  cancelEdit() {
    this.setData({
      newCelebrity: {
        name: '',
        introduction: '',
        avatar: '',
        books: []
      },
      isEditing: false,
      editingId: ''
    })
  },

  // 删除名人信息
  async deleteCelebrity(e) {
    const { id } = e.currentTarget.dataset
    try {
      const res = await wx.showModal({
        title: '确认删除',
        content: '确定要删除这条记录吗？',
        confirmText: '删除',
        confirmColor: '#ff0000'
      })
      
      if (res.confirm) {
        wx.showLoading({ title: '删除中...' })
        await wx.cloud.callFunction({
          name: 'manageCelebrity',
          data: { 
            type: 'delete',
            data: { _id: id }
          }
        })
        wx.showToast({ title: '删除成功' })
        this.loadCelebrities()
      }
    } catch (err) {
      console.error('删除失败：', err)
      wx.showToast({ title: '删除失败', icon: 'error' })
    } finally {
      wx.hideLoading()
    }
  },

  // 上传头像
  uploadAvatar() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        wx.showLoading({ title: '上传中...' })
        
        // 上传到云存储
        wx.cloud.uploadFile({
          cloudPath: `avatars/${Date.now()}-${Math.random().toString(36).slice(-6)}.jpg`,
          filePath: tempFilePath,
          success: res => {
            console.log('头像上传成功：', res.fileID)
            this.setData({
              'newCelebrity.avatar': res.fileID
            })
          },
          fail: err => {
            console.error('头像上传失败：', err)
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      }
    })
  },

  // 上传书籍封面
  uploadBookCover() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        wx.showLoading({ title: '上传中...' })
        
        // 上传到云存储
        wx.cloud.uploadFile({
          cloudPath: `covers/${Date.now()}-${Math.random().toString(36).slice(-6)}.jpg`,
          filePath: tempFilePath,
          success: res => {
            console.log('封面上传成功：', res.fileID)
            this.setData({
              'newBook.cover': res.fileID
            })
          },
          fail: err => {
            console.error('封面上传失败：', err)
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      }
    })
  },

  // 添加书籍到名人书单
  addBook() {
    const { newBook, newCelebrity } = this.data
    if (!newBook.title || !newBook.author) {
      wx.showToast({
        title: '请填写书籍信息',
        icon: 'none'
      })
      return
    }

    const books = [...newCelebrity.books, { ...newBook }]
    this.setData({
      'newCelebrity.books': books,
      newBook: {
        title: '',
        author: '',
        cover: '',
        description: ''
      }
    })
  },

  // 保存名人信息
  async saveCelebrity() {
    const { newCelebrity, isEditing, editingId } = this.data
    
    if (!newCelebrity.name) {
      wx.showToast({
        title: '请填写名人姓名',
        icon: 'none'
      })
      return
    }

    try {
      wx.showLoading({ title: '保存中...' })
      const type = isEditing ? 'update' : 'add'
      const saveData = { ...newCelebrity }
      if (isEditing) {
        saveData._id = editingId
      }
      
      const { result } = await wx.cloud.callFunction({
        name: 'manageCelebrity',
        data: { 
          type,
          data: saveData
        }
      })
      
      console.log('保存成功：', result)
      wx.showToast({ title: '保存成功' })
      
      // 重置表单和加载最新数据
      this.setData({
        newCelebrity: {
          name: '',
          introduction: '',
          avatar: '',
          books: []
        },
        isEditing: false,
        editingId: ''
      })
      this.loadCelebrities()
    } catch (err) {
      console.error('保存失败：', err)
      wx.showToast({ title: '保存失败', icon: 'error' })
    } finally {
      wx.hideLoading()
    }
  },

  // 输入框事件处理
  onInput(e) {
    const { field } = e.currentTarget.dataset
    const { value } = e.detail
    this.setData({
      [field]: value
    })
  }
})

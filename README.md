# 名人书单小程序

一个展示名人推荐书籍的微信小程序，基于云开发实现。

## 功能特点

- 首页展示名人及其推荐的书籍列表
- 管理后台支持名人信息的增删改查
- 支持上传名人头像和书籍封面
- 云端数据存储，确保数据安全性

## 技术栈

- 微信小程序原生开发
- 微信云开发
  - 云数据库：存储名人和书籍信息
  - 云存储：保存图片资源
  - 云函数：处理数据操作

## 项目结构

```
booklist/
├── cloudfunctions/          # 云函数
│   ├── manageCelebrity/    # 名人信息管理
│   └── uploadFile/         # 文件上传
├── pages/
│   ├── index/             # 首页展示
│   └── admin/             # 管理后台
└── static/                # 静态资源
    └── images/           # 图片资源
```

## 本地开发

1. 克隆项目
```bash
git clone https://github.com/Backtthefuture/celebrity-booklist.git
```

2. 导入到微信开发者工具

3. 开通云开发并修改环境ID

4. 创建数据库集合：celebrities

## 贡献

欢迎提交 Issue 和 Pull Request

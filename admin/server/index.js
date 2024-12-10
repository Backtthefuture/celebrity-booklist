const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const port = 3000;

// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 根据文件类型决定存储位置
    const type = req.body.type || 'books';
    const dir = path.join(__dirname, '../../static/images/', type);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // 保持原文件名
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// 启用 CORS
app.use(cors());
app.use(express.json());

// 静态文件服务
app.use('/static', express.static(path.join(__dirname, '../../static')));

// 上传图片
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '没有文件上传' });
  }
  res.json({
    url: `/static/images/${req.body.type}/${req.file.filename}`
  });
});

// 获取名人列表
app.get('/api/celebrities', async (req, res) => {
  try {
    const dataPath = path.join(__dirname, '../../data/celebrities.js');
    const data = require(dataPath);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: '读取数据失败' });
  }
});

// 保存名人数据
app.post('/api/celebrities', async (req, res) => {
  try {
    const dataPath = path.join(__dirname, '../../data/celebrities.js');
    const content = `module.exports = ${JSON.stringify({ data: req.body }, null, 2)}`;
    await fs.writeFile(dataPath, content);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: '保存数据失败' });
  }
});

app.listen(port, () => {
  console.log(`管理后台服务运行在 http://localhost:${port}`);
});

# 2048游戏部署指南

本指南将帮助您将2048游戏部署到Vercel或GitHub Pages，获得公网域名。

## 方案一：部署到Vercel（推荐）

### 优势
- 部署速度快，全球CDN加速
- 自动HTTPS证书
- 支持自定义域名
- 零配置部署

### 部署步骤

1. **准备GitHub仓库**
   ```bash
   # 初始化Git仓库
   git init
   git add .
   git commit -m "Initial commit"
   
   # 创建GitHub仓库并推送代码
   git remote add origin https://github.com/你的用户名/2048-game.git
   git branch -M main
   git push -u origin main
   ```

2. **Vercel部署**
   - 访问 [vercel.com](https://vercel.com)
   - 使用GitHub账号登录
   - 点击 "New Project"
   - 选择你的2048-game仓库
   - 点击 "Deploy"
   - 等待部署完成，获得类似 `https://your-project.vercel.app` 的域名

3. **自定义域名（可选）**
   - 在Vercel项目设置中添加自定义域名
   - 配置DNS记录指向Vercel

## 方案二：部署到GitHub Pages

### 优势
- 完全免费
- 与GitHub仓库集成
- 自动部署

### 部署步骤

1. **推送代码到GitHub**
   ```bash
   # 如果还没有Git仓库
   git init
   git add .
   git commit -m "Initial commit"
   
   # 创建GitHub仓库并推送
   git remote add origin https://github.com/你的用户名/2048-game.git
   git branch -M main
   git push -u origin main
   ```

2. **启用GitHub Pages**
   - 进入GitHub仓库页面
   - 点击 "Settings" 选项卡
   - 滚动到 "Pages" 部分
   - 在 "Source" 下选择 "GitHub Actions"
   - 代码推送后会自动触发部署

3. **访问网站**
   - 部署完成后，访问 `https://你的用户名.github.io/2048-game`

## 快速命令

### 初始化Git仓库并推送到GitHub
```bash
# 在项目根目录执行
git init
git add .
git commit -m "Add 2048 game with PWA support"
git remote add origin https://github.com/你的用户名/2048-game.git
git branch -M main
git push -u origin main
```

### 更新部署
```bash
# 修改代码后推送更新
git add .
git commit -m "Update game features"
git push
```

## 注意事项

1. **文件结构**：确保所有文件都在项目根目录
2. **PWA功能**：两个平台都支持PWA功能，用户可以安装到桌面
3. **HTTPS**：两个平台都自动提供HTTPS，确保PWA正常工作
4. **缓存**：部署后可能需要等待几分钟才能看到更新

## 推荐选择

- **Vercel**：如果需要更快的部署速度和更好的性能
- **GitHub Pages**：如果希望完全免费且与GitHub深度集成

两个平台都能很好地托管这个2048游戏，选择任一即可获得稳定的公网访问。
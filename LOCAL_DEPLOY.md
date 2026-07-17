# 本地部署指南（中文）

> 你在 Arena 沙盒里看到的 `localhost:3000` 打不开是正常的，因为沙盒是隔离的虚拟机，只在服务器内部。你需要在自己电脑上按下面步骤部署。

## 方式一：直接用 Node (最简单，推荐)

要求：Node.js 18+ （推荐 20）

```bash
# 1. 克隆你的仓库的这个分支
git clone https://github.com/weisson110/weisson110.git
cd weisson110
git checkout arena/019f6ede-weisson110

# 2. 安装依赖
npm install

# 3. 开发模式（带热重载）
npm run dev
# 浏览器打开 http://localhost:3000

# 或者生产模式（更快）
npm run build
npm start
# 浏览器打开 http://localhost:3000
```

如果 3000 端口被占用：
```bash
npm run dev -- --port 3001
# 或
npm start -- --port 3001
```

## 方式二：Docker 一键部署

要求：已安装 Docker Desktop

```bash
# 同上先 clone 并 checkout 分支
git clone https://github.com/weisson110/weisson110.git
cd weisson110
git checkout arena/019f6ede-weisson110

# 启动
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 浏览器打开 http://localhost:3000
# 停止
docker-compose down
```

## 方式三：Windows 双击启动

1. 安装 Node.js https://nodejs.org/
2. 下载仓库 ZIP 并解压
3. 双击 `start-windows.bat` （我帮你创建好了）

## 常见问题

**Q: npm install 很慢？**
```bash
npm config set registry https://registry.npmmirror.com
npm install
```

**Q: 打开是白屏？**
检查浏览器控制台，确认 Node 版本 >=18
```bash
node -v
```

**Q: 想改成自己的域名？**
在 `.env.local` 加：
```
NEXT_PUBLIC_APP_URL=https://你的域名.com
```

**Q: 如何接入真实 AI？**
编辑 `src/app/api/v1/chat/completions/route.ts`，把 mock 逻辑替换成：

```ts
const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ model: body.model, messages: body.messages })
})
```

## 沙盒内的验证结果

我在沙盒内已验证服务正常：

```
ss -tlnp | grep 3000
LISTEN 0.0.0.0:3000 -> next-server pid=2100

curl http://localhost:3000/ -> 200 OK 42579 bytes
curl http://localhost:3000/api/v1/models -> {"data":[...]}
```

所以代码本身没问题，只是你需要部署到你自己的电脑上。

# ICO Dapp 项目

## 项目简介

这是一个基于区块链技术的ICO（Initial Coin Offering）去中心化应用程序，允许用户通过MetaMask钱包购买代币。项目使用Next.js框架构建前端，Ethers.js与智能合约交互，支持主题切换、网络状态监控和交易处理等功能。

## 功能特性

- 🔐 钱包连接与管理（支持MetaMask）
- 💱 代币购买功能
- 📊 实时合约信息展示
- 🌓 深色/浅色主题切换
- 🔄 网络状态监控与自动重连
- 📱 响应式设计，支持移动端
- 🎨 现代化UI设计

## 技术栈

- **前端框架**: Next.js 14
- **区块链交互**: Ethers.js
- **钱包集成**: RainbowKit
- **状态管理**: React Context API
- **样式**: Tailwind CSS
- **部署**: Vercel（推荐）

## 项目结构

```
ICO_DIFI_Dapp/
├── components/          # 组件目录
│   └── HomePage/        # 首页组件
├── context/             # 上下文管理
│   ├── Web3Provider.js  # Web3 提供者
│   └── ToastContext.js  # 消息提示
├── pages/               # 页面目录
│   ├── _app.js          # 应用入口
│   └── index.js         # 首页
├── utils/               # 工具函数
│   ├── networkHealth.js # 网络健康检查
│   └── Utility.js       # 通用工具
├── next.config.js       # Next.js 配置
├── package.json         # 依赖管理
└── .env.local           # 环境变量
```

## 快速开始

### 前提条件

- Node.js 16.0 或更高版本
- npm 或 yarn
- MetaMask 钱包
- Sepolia 测试网络账户（用于测试）

### 安装步骤

1. **克隆项目**

```bash
git clone <repository-url>
cd ICO_DIFI_Dapp
```

2. **安装依赖**

```bash
npm install
# 或
yarn install
```

3. **配置环境变量**

复制 `.env.local.example` 文件并更名为 `.env.local`，然后填写以下信息：

```env
# 智能合约地址
NEXT_PUBLIC_TOKEN_ICO_ADDRESS=0x2fae32C1397134c6B7c6a779E2E8C149e3735690
NEXT_PUBLIC_TOKEN_OWNER_ADDRESS=0x4e448a671458f8b3fFDD6B40E930c63FC6f7A5cD
NEXT_PUBLIC_TOKEN_LINKTUM_ADDRESS=0x6e2C0d953575585Cd290453550e805F0c862e109

# 网络配置
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_CURRENCY=ETH
NEXT_PUBLIC_BLOCKCHAIN=Sepolia
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_TOKEN_RPC_URL=https://sepolia.gateway.tenderly.co

# 代币信息
NEXT_PUBLIC_TOKEN_DECIMALS=18
NEXT_PUBLIC_TOKEN_SUPPLY=10000000000
```

4. **启动开发服务器**

```bash
npm run dev
# 或
yarn dev
```

5. **访问应用**

打开浏览器访问 `http://localhost:3000`

## 功能使用

### 1. 连接钱包

- 点击页面右上角的 "Connect Wallet" 按钮
- 选择 MetaMask 钱包
- 授权连接

### 2. 购买代币

- 在首页的购买表单中输入想要购买的代币数量
- 系统会自动计算所需的 ETH 金额
- 点击 "Buy Tokens" 按钮
- 确认 MetaMask 中的交易

### 3. 添加代币到 MetaMask

- 购买成功后，点击 "Add Token to MetaMask" 按钮
- 确认 MetaMask 中的添加请求

### 4. 切换主题

- 点击页面右上角的主题切换按钮
- 系统会记住您的主题偏好

## 智能合约

### 合约地址

- **ICO 合约**: `0x2fae32C1397134c6B7c6a779E2E8C149e3735690`
- **代币合约**: `0x6e2C0d953575585Cd290453550e805F0c862e109`

### 合约功能

- `buyTokens()`: 购买代币
- `getContractInfo()`: 获取合约信息
- `tokenPrice()`: 获取代币价格
- `remainingTokens()`: 获取剩余代币数量

## 网络配置

项目默认使用 Sepolia 测试网络，您可以在 `.env.local` 文件中修改网络配置。

### RPC 端点

推荐使用以下 RPC 端点：
- `https://sepolia.gateway.tenderly.co`
- `https://rpc.sepolia.org`

## 常见问题

### 1. 为什么 tbcBalance 显示为 0？

这是因为 ICO 合约中没有代币余额。需要代币所有者向 ICO 合约转入代币，才能开始销售。

### 2. 为什么会出现 "Failed to fetch" 错误？

这通常是由于 RPC 节点连接问题导致的。请尝试更换 RPC 端点，或等待网络恢复。

### 3. 为什么会出现 "429 Too Many Requests" 错误？

这是由于 RPC 节点的请求频率限制。请使用更可靠的 RPC 端点，如 Tenderly。

### 4. 为什么添加代币到 MetaMask 失败？

请确保 `.env.local` 文件中配置了正确的 `NEXT_PUBLIC_TOKEN_DECIMALS` 值（通常为 18）。

## 故障排除

1. **钱包连接问题**
   - 确保 MetaMask 已安装并登录
   - 确保网络设置为 Sepolia 测试网络
   - 刷新页面后重新连接

2. **交易失败**
   - 确保钱包中有足够的 ETH
   - 检查网络状态
   - 尝试增加 gas 费用

3. **页面加载问题**
   - 清除浏览器缓存
   - 检查网络连接
   - 确保依赖已正确安装

## 部署

### Vercel 部署

1. 登录 Vercel 账户
2. 导入项目仓库
3. 配置环境变量（与 `.env.local` 相同）
4. 点击 "Deploy"

### 其他部署选项

- **Netlify**
- **GitHub Pages**
- **AWS Amplify**

## 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

## 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 联系方式

- 项目维护者: [Your Name]
- 邮箱: [your.email@example.com]
- GitHub: [your-github-username]

---

**注意**: 本项目仅用于测试和学习目的，请勿在生产环境中使用真实资金。
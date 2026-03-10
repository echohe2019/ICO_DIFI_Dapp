// CORS 代理解决方案
// 由于大多数 RPC 节点不支持浏览器直接访问，我们需要使用支持 CORS 的节点或代理

// 支持 CORS 的公共 Sepolia RPC 节点
const CORS_FRIENDLY_RPCS = {
  sepolia: [
    "https://ethereum-sepolia.publicnode.com",  // 支持 CORS
    "https://sepolia.gateway.tenderly.co",      // 支持 CORS
    "https://rpc.sepolia.org",                  // 可能支持 CORS
    "https://rpc2.sepolia.org",                 // 可能支持 CORS
  ],
};

// 使用 Cloudflare Workers 作为 CORS 代理
// 这是一个简单的 CORS 代理 Worker 代码，您可以部署到自己的 Cloudflare 账户
const CORS_PROXY_WORKER = `
// Cloudflare Worker CORS Proxy
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // 允许跨域请求
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // 处理预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // 获取目标 URL
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');
  
  if (!targetUrl) {
    return new Response('Missing target URL', { status: 400, headers: corsHeaders });
  }

  try {
    // 转发请求到目标 RPC 节点
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: request.body,
    });

    // 获取响应内容
    const body = await response.text();

    // 返回带有 CORS 头的响应
    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
`;

// 推荐的解决方案：使用支持 CORS 的 RPC 聚合服务
export const RECOMMENDED_CORS_RPCS = {
  sepolia: [
    "https://ethereum-sepolia.publicnode.com",
    "https://sepolia.gateway.tenderly.co",
    "https://rpc.sepolia.org",
    "https://rpc2.sepolia.org",
  ],
};

// 使用 QuickNode 的公共端点（推荐）
export const QUICKNODE_CORS_RPC = "https://docs-demo.quiknode.pro/";

// 使用 Alchemy 的公共端点
export const ALCHEMY_PUBLIC_RPC = "https://eth-sepolia.g.alchemy.com/v2/demo";

// 检测是否为 CORS 错误
export function isCorsError(error) {
  if (!error) return false;
  
  const message = error.message || error.toString();
  return (
    message.includes("CORS") ||
    message.includes("Access-Control-Allow-Origin") ||
    message.includes("blocked by CORS policy") ||
    message.includes("preflight request")
  );
}

// 获取 CORS 友好的 RPC URL
export function getCorsFriendlyRpcUrl(chain = "sepolia") {
  const rpcs = RECOMMENDED_CORS_RPCS[chain] || [];
  
  // 随机选择一个 RPC 节点
  const randomIndex = Math.floor(Math.random() * rpcs.length);
  return rpcs[randomIndex] || "https://ethereum-sepolia.publicnode.com";
}

// 创建 CORS 代理 URL（如果需要使用代理）
export function createCorsProxyUrl(targetUrl, proxyBase = "https://corsproxy.io/?") {
  return `${proxyBase}${encodeURIComponent(targetUrl)}`;
}
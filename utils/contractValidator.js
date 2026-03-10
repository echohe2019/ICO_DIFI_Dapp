import { ethers } from "ethers";

// ERC20 标准 ABI（仅包含我们需要的方法）
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

/**
 * 验证地址是否为有效的 ERC20 代币合约
 * @param {string} address - 合约地址
 * @param {string|object} provider - ethers provider 或 RPC URL
 * @returns {Promise<{isValid: boolean, contractInfo: object, error: string}>}
 */
export async function validateERC20Contract(address, provider) {
  try {
    // 验证地址格式
    if (!ethers.utils.isAddress(address)) {
      return {
        isValid: false,
        contractInfo: null,
        error: "Invalid Ethereum address format"
      };
    }

    // 创建 provider
    let ethersProvider;
    if (typeof provider === "string") {
      ethersProvider = new ethers.providers.JsonRpcProvider(provider);
    } else {
      ethersProvider = provider;
    }

    // 创建合约实例
    const contract = new ethers.Contract(address, ERC20_ABI, ethersProvider);

    // 验证必需的 ERC20 方法
    const requiredMethods = ["name", "symbol", "decimals", "totalSupply"];
    const contractInfo = {};

    for (const method of requiredMethods) {
      try {
        const result = await contract[method]();
        contractInfo[method] = result;
      } catch (error) {
        return {
          isValid: false,
          contractInfo: null,
          error: `Contract does not implement ${method}() method: ${error.message}`
        };
      }
    }

    // 验证返回值的类型
    if (typeof contractInfo.name !== "string") {
      return {
        isValid: false,
        contractInfo: null,
        error: "name() should return a string"
      };
    }

    if (typeof contractInfo.symbol !== "string") {
      return {
        isValid: false,
        contractInfo: null,
        error: "symbol() should return a string"
      };
    }

    if (typeof contractInfo.decimals !== "number") {
      return {
        isValid: false,
        contractInfo: null,
        error: "decimals() should return a number"
      };
    }

    // 检查代码是否存在
    const code = await ethersProvider.getCode(address);
    if (code === "0x") {
      return {
        isValid: false,
        contractInfo: null,
        error: "No contract code at this address"
      };
    }

    return {
      isValid: true,
      contractInfo: {
        address,
        name: contractInfo.name,
        symbol: contractInfo.symbol,
        decimals: contractInfo.decimals,
        totalSupply: contractInfo.totalSupply.toString()
      },
      error: null
    };

  } catch (error) {
    return {
      isValid: false,
      contractInfo: null,
      error: `Validation failed: ${error.message}`
    };
  }
}

/**
 * 获取合约的基本信息
 * @param {string} address - 合约地址
 * @param {string|object} provider - ethers provider 或 RPC URL
 * @returns {Promise<{name: string, symbol: string, decimals: number}>}
 */
export async function getContractInfo(address, provider) {
  try {
    const validation = await validateERC20Contract(address, provider);
    if (validation.isValid) {
      return {
        name: validation.contractInfo.name,
        symbol: validation.contractInfo.symbol,
        decimals: validation.contractInfo.decimals
      };
    }
    throw new Error(validation.error);
  } catch (error) {
    console.error("Failed to get contract info:", error);
    throw error;
  }
}

/**
 * 检查地址是否为合约地址（有代码）
 * @param {string} address - 地址
 * @param {object} provider - ethers provider
 * @returns {Promise<boolean>}
 */
export async function isContract(address, provider) {
  try {
    const code = await provider.getCode(address);
    return code !== "0x";
  } catch (error) {
    console.error("Failed to check if address is contract:", error);
    return false;
  }
}
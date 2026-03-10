import { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount, useChainId, useConnect, useBalance } from "wagmi";

import { useToast } from "./ToastContext";
import TOKEN_ICO_ABI from "./ABI.json";
import { useEthersProvider, useEthersSigner } from "@/provider/hooks";
import { config } from "@/provider/wagmiConfigs";
import {
  handleTransactionError,
  erc20Abi,
  generateId,
} from "@/context/Utility";

const LINKTUM_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_LINKTUM_ADDRESS;
const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY;
const TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TOKEN_SYMBOL;
const TOKEN_DECIMALS = process.env.NEXT_PUBLIC_TOKEN_DECIMAL;
const TOKEN_LOGO = process.env.NEXT_PUBLIC_TOKEN_LOGO;
const PER_TOKEN_USD_PRICE = process.env.NEXT_PUBLIC_PER_TOKEN_USD_PRICE;

const TokenICOAbi = TOKEN_ICO_ABI.abi;

const Web3Context = createContext();

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ICO_ADDRESS;
// const RPC_URL = process.env.NEXT_PUBLIC_TOKEN_RPC_URL;

// const fallbackProvider = new ethers.providers.JsonRpcProvider(RPC_URL);

export const Web3Provider = ({ children }) => {
  const { notify } = useToast();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { balance } = useBalance({ config }); // 修复：使用 address 而不是 config
  const { connect, connector } = useConnect();
  const [reCall, setReCall] = useState(0);
  const [globalLoad, setGlobalLoad] = useState(false);

  const provider = useEthersProvider();
  const signer = useEthersSigner();
  // const fallbackProvider = new ethers.providers.JsonRpcProvider(RPC_URL);

  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [contractInfo, setContractInfo] = useState({
    tbcAddress: null,
    tbcBalance: "0",
    ethPrice: "0",
    totalSold: "0",
  });
  const [tokenBalance, setTokenBalance] = useState({
    userTbcBalance: "0",
    contractEthBalance: null,
    totalSupply: null,
    userEthBalance: null,
    ethPrice: "0",
    tbcBalance: "0",
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    const initContract = () => {
      if (provider && signer) {
        try {
          const contractInstance = new ethers.Contract(
            CONTRACT_ADDRESS,
            TokenICOAbi,
            signer,
          );
          setContract(contractInstance);
        } catch (error) {
          console.error("Error initializing contract: ", error);
          setError("Failed to initialize contract");
        }
      }
    };
    initContract();
  }, [provider, signer]);

  useEffect(() => {
    const fetchContractInfo = async () => {
      setGlobalLoad(true);
      try {
        const currentProvider = provider || fallbackProvider;
        const readonlyContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          TokenICOAbi,
          currentProvider,
        );
        const info = await readonlyContract.getContractInfo();
        console.log("info:", info);
        const tokenDecimals = parseInt(info.tokenDecimals) || 18;
        setContractInfo({
          tbcAddress: info.tokenAddress,
          tbcBalance: ethers.utils.formatUnits(
            info.tokenBalance,
            tokenDecimals,
          ),
          ethPrice: ethers.utils.formatUnits(info.ethPrice, 18),
          totalSold: ethers.utils.formatUnits(info.totalSold, tokenDecimals),
        });
        if (address && info.tokenAddress) {
          const tokenContract = new ethers.Contract(
            info.tokenAddress,
            erc20Abi,
            currentProvider,
          );
          const [
            userTokenBalance,
            userEthBalance,
            contractEthBalance,
            totalSupply,
          ] = await Promise.all([
            tokenContract.balanceOf(address),
            currentProvider.getBalance(address),
            currentProvider.getBalance(CONTRACT_ADDRESS),
            tokenContract.totalSupply(),
          ]);

          setTokenBalance((prev) => ({
            ...prev,
            userTbcBalance: ethers.utils.formatUnits(
              userTokenBalance,
              tokenDecimals,
            ),
            contractEthBalance: ethers.utils.formatUnits(contractEthBalance),
            totalSupply: ethers.utils.formatUnits(totalSupply, tokenDecimals),
            userEthBalance: ethers.utils.formatUnits(userEthBalance, 18),
            ethPrice: ethers.utils.formatUnits(info.ethPrice, 18),
            tbcBalance: ethers.utils.formatUnits(
              info.tokenBalance,
              tokenDecimals,
            ),
          }));
        }
        setGlobalLoad(false);
      } catch (error) {
        setGlobalLoad(false);
        console.error("Error fetching contract info: ", error);
        setError("Failed to fetch contract info");
      }
    };
    fetchContractInfo();
  }, [contract, address, provider, signer, reCall]);

  const buyToken = async (ethAmount) => {
    if (!contract || !address) return null;
    const toastId = notify.start(`Buying ${TOKEN_SYMBOL} with ${CURRENCY}...`);
    try {
      const ethValue = ethers.utils.parseEther(ethAmount);
      console.log("ethValue", ethValue);
      const tx = await contract.buyTokens({
        value: ethValue,
      });
      notify.update(toastId, "Processing", "Waiting for confirmation");
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        const tokenPrice = PER_TOKEN_USD_PRICE;
        const tokensReceived = parseFloat(ethAmount) / tokenPrice;

        const txDetails = {
          timestamp: new Date(),
          user: address,
          tokenIn: CURRENCY,
          tokenOut: TOKEN_SYMBOL,
          amountIn: ethAmount,
          amountOut: tokensReceived.toString(),
          transactionType: "BUY",
          hash: receipt.transactionHash,
        };
        saveTransactionToLocalStorage(txDetails);
        setReCall((prev) => prev + 1);

        notify.complete(
          toastId,
          `Successfully purchased ${TOKEN_SYMBOL} token`,
        );
      }
      return receipt;
    } catch (error) {
      const { message: errorMessage, code: errorCode } = handleTransactionError(
        error,
        "buying tokens",
      );
      if (errorCode == "ACTION_REJECTED") {
        notify.reject(toastId, "Transaction rejected by user");
        return null;
      }
      console.error(errorMessage);
      notify.fail(
        toastId,
        "Transaction failed,Please try again with sufficient gas",
      );
      return null;
    }
  };

  const saveTransactionToLocalStorage = (txData) => {
    try {
      const existingTransaction =
        JSON.parse(localStorage.getItem("tokenTransactions")) || [];
      existingTransaction.push(txData);
      localStorage.setItem(
        "tokenTransactions",
        JSON.stringify(existingTransaction),
      );
      console.log("Transaction save to localStorage:", txData);
    } catch (error) {
      console.error("Failed to save transaction to localStorage:", error);
    }
  };

  const updateTokenPrice = async (newPrice) => {
    if (!contract || !address) return null;
    const toastId = notify.start(`Updating token price...`);

    try {
      const parsedPrice = ethers.utils.parseEther(newPrice);
      const tx = await contract.updateTokenPrice(parsedPrice);
      notify.update(toastId, "Processing", "Confirming price update...");
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setReCall((prev) => prev + 1);
        notify.complete(
          toastId,
          `Token price updated to ${newPrice} ${CURRENCY}`,
        );
      }
      return receipt;
    } catch (error) {
      const { message: errorMessage, code: errorCode } = handleTransactionError(
        error,
        "updating token price",
      );
      if (errorCode == "ACTION_REJECTED") {
        notify.reject(toastId, "Transaction rejected by user");
        return null;
      }
      console.error(errorMessage);
      notify.fail(
        toastId,
        "Price updated failed,Please check your permissions",
      );
      return null;
    }
  };
  const setSaleToken = async (tokenAddress, retryCount = 0) => {
    if (!contract || !address) return null;

    const toastId = notify.start(`Setting sale token`);

    try {
      // 验证地址格式
      if (!ethers.utils.isAddress(tokenAddress)) {
        notify.fail(toastId, "Invalid token address format");
        return null;
      }

      const tx = await contract.setSaleToken(tokenAddress);
      notify.update(toastId, "Processing", "Confirming token update...");
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setReCall((prev) => prev + 1);
        notify.complete(toastId, `Sale token updated successfully`);
      }
      return receipt;
    } catch (error) {
      const { message: errorMessage, code: errorCode } = handleTransactionError(
        error,
        "Setting sale token",
      );

      if (errorCode == "ACTION_REJECTED") {
        notify.reject(toastId, "Transaction rejected by user");
        return null;
      } else if (errorCode == "CORS_ERROR") {
        notify.fail(
          toastId,
          "CORS policy error. Please check your RPC endpoint settings or try a different network.",
        );
        return null;
      } else if (errorCode == "NETWORK_ERROR" && retryCount < 2) {
        notify.update(
          toastId,
          "Retrying",
          `Network error, retrying... (${retryCount + 1}/2)`,
        );
        // 等待 2 秒后重试
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return setSaleToken(tokenAddress, retryCount + 1);
      } else if (errorCode == "NETWORK_ERROR") {
        notify.fail(
          toastId,
          "Network connection failed after 3 attempts. Please check your network and try again.",
        );
        return null;
      }

      console.error(errorMessage);
      notify.fail(toastId, "Failed to set sale token,Please check the address");
      return null;
    }
  };

  const withdrawAllTokens = async () => {
    if (!contract || !address) return null;
    const toastId = notify.start(`Withdraw tokens`);

    try {
      const tx = await contract.withdrawAllTokens();
      notify.update(toastId, "Processing", "Confirming withdraw...");
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setReCall((prev) => prev + 1);
        notify.complete(toastId, `All tokens withdraw successfully`);
      }
      return receipt;
    } catch (error) {
      const { message: errorMessage, code: errorCode } = handleTransactionError(
        error,
        "Withdrawing token",
      );
      if (errorCode == "ACTION_REJECTED") {
        notify.reject(toastId, "Transaction rejected by user");
        return null;
      }
      console.error(errorMessage);
      notify.fail(toastId, "Failed to Withdrawing token,Please try again");
      return null;
    }
  };

  const rescueTokens = async (tokenAddress) => {
    if (!contract || !address) return null;
    const toastId = notify.start(`Rescuing tokens`);

    try {
      const tx = await contract.rescueTokens(tokenAddress);
      notify.update(toastId, "Processing", "rescue operations...");
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setReCall((prev) => prev + 1);
        notify.complete(toastId, `Tokens rescued successfully`);
      }
      return receipt;
    } catch (error) {
      const { message: errorMessage, code: errorCode } = handleTransactionError(
        error,
        "rescuing token",
      );
      if (errorCode == "ACTION_REJECTED") {
        notify.reject(toastId, "Transaction rejected by user");
        return null;
      }
      console.error(errorMessage);
      notify.fail(
        toastId,
        "Failed to rescued tokens,Please try again / Check the address",
      );
      return null;
    }
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const isOwner = async () => {
    if (!contract || !address) return null;
    try {
      const ownerAddress = await contract.owner();
      return ownerAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      const errorMessage = handleTransactionError(error, "checking owner");
      console.error(errorMessage);
      return false;
    }
  };

  const formatTokenAmount = (amount, decimals = 18) => {
    if (!amount) return "0";
    return ethers.utils.formatUnits(amount, decimals);
  };

  // const addTokenToMetamask = async () => {
  //   const toastId = notify.start(`Adding ${TOKEN_SYMBOL} Token to Metamask`);
  //   try {
  //     const wasAdded = await window.ethereum.request({
  //       method: "wallet_watchAsset",
  //       params: {
  //         type: "ERC20",
  //         options: {
  //           address: LINKTUM_ADDRESS,
  //           symbol: TOKEN_SYMBOL,
  //           decimals: TOKEN_DECIMALS,
  //           image: TOKEN_LOGO,
  //         },
  //       },
  //     });
  //     if (wasAdded) {
  //       notify.complete(toastId, `Successfully added token to Metamask`);
  //     } else {
  //       notify.complete(toastId, "Failed to add the token to Metamask");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     const { message: errorMessage, code: errorCode } = handleTransactionError(
  //       error,
  //       "Token additin error",
  //     );
  //     notify.fail(
  //       toastId,
  //       `Transaction failed:${errorMessage.message === "undefined" ? "Not Supported" : errorMessage.message}`,
  //     );
  //   }
  // };

    const addTokenToMetamask = async (tokenAddress = LINKTUM_ADDRESS) => {
        const toastId = notify.start(`Adding ${TOKEN_SYMBOL} Token to MetaMask`);
        
        try {
            // 检查 MetaMask 是否可用
            if (!window.ethereum || !window.ethereum.isMetaMask) {
                throw new Error("MetaMask is not installed");
            }
            
            // 检查是否已连接钱包
            if (!address) {
                throw new Error("Please connect your wallet first");
            }
            
            // 验证参数
            if (!tokenAddress || !ethers.utils.isAddress(tokenAddress)) {
                throw new Error("Invalid token address");
            }
            
            if (!TOKEN_SYMBOL || TOKEN_SYMBOL.trim() === "") {
                throw new Error("Token symbol is not configured");
            }
            
            const decimals = parseInt(TOKEN_DECIMALS || "18");
            if (isNaN(decimals) || decimals < 0 || decimals > 36) {
                throw new Error("Invalid token decimals");
            }
            
            // 准备代币参数
            const tokenParams = {
                type: "ERC20",
                options: {
                    address: tokenAddress,
                    symbol: TOKEN_SYMBOL,
                    decimals: decimals,
                    image: TOKEN_LOGO || undefined, // 可选参数
                },
            };
            
            console.log("Adding token to MetaMask with params:", tokenParams);
            
            // 调用 MetaMask API
            const wasAdded = await window.ethereum.request({
                method: "wallet_watchAsset",
                params: tokenParams,
            });
            
            if (wasAdded) {
                notify.complete(toastId, `✅ ${TOKEN_SYMBOL} token successfully added to MetaMask!`);
                return true;
            } else {
                notify.complete(toastId, `⚠️ User canceled adding ${TOKEN_SYMBOL} token`);
                return false;
            }
            
        } catch (error) {
            console.error("Error adding token to MetaMask:", error);
            
            let errorMessage = "Failed to add token to MetaMask";
            
            // 处理特定错误类型
            if (error.code === 4001 || error.message?.includes("user rejected")) {
                errorMessage = "User rejected the token addition request";
            } else if (error.code === -32602) {
                errorMessage = "Invalid token parameters. Please check token configuration.";
            } else if (error.message?.includes("MetaMask is not installed")) {
                errorMessage = "MetaMask extension not found. Please install MetaMask.";
            } else if (error.message?.includes("connect your wallet")) {
                errorMessage = "Please connect your wallet before adding tokens.";
            } else if (error.message?.includes("Invalid token address")) {
                errorMessage = "The token address is invalid. Please check the configuration.";
            }
            
            notify.fail(toastId, `❌ ${errorMessage}`);
            return false;
        }
    }

  const value = {
    provider,
    signer,
    contract,
    account: address,
    chainId,
    isConnected: !!address && !!contract,
    isConnecting,
    contractInfo,
    tokenBalance,
    error,
    reCall,
    globalLoad,
    buyToken,
    updateTokenPrice,
    setSaleToken,
    withdrawAllTokens,
    formatAddress,
    formatTokenAmount,
    isOwner,
    setReCall,
    addTokenToMetamask,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
export default Web3Context;
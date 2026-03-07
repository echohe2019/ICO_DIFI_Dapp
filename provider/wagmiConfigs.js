import { sepolia,polygon} from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

export const config = getDefaultConfig({
  appName: 'LINKTUM AI',
  chains: [sepolia],
  projectId,
  ssr:true
})
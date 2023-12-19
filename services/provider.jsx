import React, { useState, useEffect } from 'react'
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { RainbowKitProvider, connectorsForWallets, darkTheme } from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  trustWallet,
  coinbaseWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { mainnet, hardhat } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { SessionProvider } from 'next-auth/react'

const bitfinity = {
  id: 355113,
  name: 'Bitfinity',
  network: 'bitfinity',
  iconUrl: 'https://bitfinity.network/logo.png',
  iconBackground: '#000000',
  nativeCurrency: {
    decimals: 18,
    name: 'Bitfinity',
    symbol: 'BFT',
  },
  rpcUrls: {
    public: { http: ['https://testnet.bitfinity.network'] },
    default: { http: ['https://testnet.bitfinity.network'] },
  },
  blockExplorers: {
    default: { name: 'Bitfinity Block Explorer', url: 'https://explorer.bitfinity.network/' },
    etherscan: { name: 'Bitfinity Block Explorer', url: 'https://explorer.bitfinity.network/' },
  },
  testnet: true,
}

const { chains, publicClient } = configureChains(
  [mainnet, bitfinity, hardhat],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }), publicProvider()]
)

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      coinbaseWallet({ appName: 'Coinbase', chains }),
      rainbowWallet({ projectId, chains }),
    ],
  },
])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

const demoAppInfo = {
  appName: 'DappBnb dApp',
}

const getSiweMessageOptions = () => ({
  statement: `
  Once you're signed in, you'll be able to access all of our dApp's features.
  Thank you for partnering with DappBnb!`,
})

const Providers = ({ children, pageProps }) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <WagmiConfig config={wagmiConfig}>
      <SessionProvider refetchInterval={0} session={pageProps.session}>
        <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
          <RainbowKitProvider theme={darkTheme()} chains={chains} appInfo={demoAppInfo}>
            {mounted && children}
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  )
}

export default Providers

import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import merge from 'lodash.merge';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';

// In a real app, you would define your Core Chain here
const coreChain = {
  id: 1116, // Example ID for Core Chain
  name: 'Core Chain',
  nativeCurrency: { name: 'Core', symbol: 'CORE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.coredao.org'] },
  },
  blockExplorers: {
    default: { name: 'CoreScan', url: 'https://scan.coredao.org' },
  },
};

const config = getDefaultConfig({
  appName: 'Core Node Dashboard',
  projectId: 'b8cf779b2a1a44595733359035a1a364', // Replace with your WalletConnect Project ID
  chains: [coreChain, mainnet, polygon, optimism, arbitrum, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

const myTheme = merge(darkTheme(), {
  colors: {
    modalBackground: '#f9f9f9',
    modalText: '#1a1b1f',
    modalTextSecondary: '#7a7a7a',
    accentColor: '#007bff',
    accentColorForeground: '#ffffff',
  },
  radii: {
    modal: '16px',
    actionButton: '12px',
    menuButton: '12px',
  },
  shadows: {
    dialog: '0 10px 30px rgba(0, 0, 0, 0.2)',
    profileDetailsAction: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={myTheme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;

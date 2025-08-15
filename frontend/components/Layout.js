import Head from 'next/head';
import Link from 'next/link';
import ConnectWallet from './ConnectWallet';

const Layout = ({ children }) => {
  return (
    <div className="container">
      <Head>
        <title>CoreChain Climate Network</title>
        <meta name="description" content="A DePIN for climate action on CoreChain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="header">
        <div className="logo">
          <Link href="/">CoreChain Climate</Link>
        </div>
        <nav className="nav">
          <Link href="/">Node Dashboard</Link>
          <Link href="/marketplace">Marketplace</Link>
        </nav>
        <ConnectWallet />
      </header>

      <main>{children}</main>
    </div>
  );
};

export default Layout;

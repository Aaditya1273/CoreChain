import Head from 'next/head';

const Analytics = () => {
  return (
    <div className="container-professional section-professional">
      <Head>
        <title>Analytics | CoreChain Climate</title>
      </Head>
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold gradient-text text-glow mb-4">Analytics Dashboard</h1>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">Detailed insights and network statistics are coming soon.</p>
        <div className="card-glass p-10 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Feature Under Development</h2>
          <p className="text-gray-400">We are currently building a comprehensive analytics platform to provide you with real-time data on climate impact, network performance, and more. Stay tuned for updates!</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

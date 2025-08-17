import { useEffect, useState } from 'react';
import Head from 'next/head';
import NFTCard from '../components/NFTCard';
import { getActiveNfts } from '../lib/graph';

const Marketplace = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNfts = async () => {
      try {
        const nftData = await getActiveNfts();
        setNfts(nftData.activeItems || []);
      } catch (err) {
        console.error('Failed to fetch NFTs:', err);
        setError(err);
      }
      setLoading(false);
    };

    fetchNfts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary-500 mx-auto"></div>
          <h2 className="text-2xl font-bold mt-4 gradient-text">Loading Carbon Credits...</h2>
          <p className="text-gray-400">Fetching the latest listings from the blockchain.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center card-glass p-10">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Failed to Load Marketplace</h2>
          <p className="text-gray-400">We couldn't fetch the carbon credits. Please try again later.</p>
          <p className="text-xs text-gray-500 mt-4">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-professional section-professional">
      <Head>
        <title>Marketplace | CoreChain Climate</title>
      </Head>
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-bold gradient-text text-glow mb-4">Carbon Credit Marketplace</h1>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto">Browse, buy, and trade tokenized carbon credits to support global climate initiatives.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {nfts.length > 0 ? (
          nfts.map((nft) => <NFTCard key={nft.id} nft={nft} />)
        ) : (
          <div className="col-span-full text-center">
            <div className="card-glass p-10">
              <h2 className="text-2xl font-bold text-white mb-4">No Credits Available</h2>
              <p className="text-gray-400">There are currently no carbon credits listed for sale. Please check back later.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;

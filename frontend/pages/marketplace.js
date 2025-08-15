import { useEffect, useState } from 'react';
import NFTCard from '../components/NFTCard';
import { getActiveNfts } from '../lib/graph';

const Marketplace = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNfts = async () => {
      try {
        const nftData = await getActiveNfts();
        setNfts(nftData.activeItems || []);
      } catch (error) {
        console.error('Failed to fetch NFTs:', error);
      }
      setLoading(false);
    };

    fetchNfts();
  }, []);

  if (loading) return <p>Loading carbon credits...</p>;

  return (
    <div>
      <h1 className="page-title">Carbon Credit Marketplace</h1>
      <div className="grid">
        {nfts.length > 0 ? (
          nfts.map((nft) => <NFTCard key={nft.id} nft={nft} />)
        ) : (
          <p>No carbon credits are currently listed for sale.</p>
        )}
      </div>
    </div>
  );
};

export default Marketplace;

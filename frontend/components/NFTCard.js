import { useWriteContract } from 'wagmi';
// IMPORTANT: You will need a Marketplace contract and its ABI
// import MarketplaceABI from '../lib/abi/Marketplace.json';

// const MARKETPLACE_ADDRESS = '0x...'; // Replace with your deployed Marketplace contract address

const NFTCard = ({ nft }) => {
  const { writeContract, isPending, error } = useWriteContract();

  const handleBuy = () => {
    // This function is a placeholder. A real implementation requires a marketplace contract.
    alert('Buying functionality requires a marketplace smart contract.');
    /*
    writeContract({
      address: MARKETPLACE_ADDRESS,
      abi: MarketplaceABI,
      functionName: 'buyItem',
      args: [nft.nftAddress, nft.tokenId],
      value: nft.price, // Price in CORE tokens (wei)
    });
    */
  };

  return (
    <div className="card nft-card">
      <img src={nft.imageURI || '/placeholder-nft.svg'} alt={`Carbon Credit NFT #${nft.tokenId}`} />
      <div className="nft-info">
        <h3>Carbon Credit #{nft.tokenId}</h3>
        <p>CO₂ Offset: {nft.co2Offset} kg</p>
        <p>Node ID: {nft.nodeId}</p>
        <div className="price-info">
          <span>Price:</span>
          <strong>{nft.priceInCore} CORE</strong>
        </div>
        <button onClick={handleBuy} disabled={isPending}>
          {isPending ? 'Purchasing...' : 'Buy with CORE'}
        </button>
        {error && <p className="error">Error: {error.shortMessage}</p>}
      </div>
    </div>
  );
};

export default NFTCard;

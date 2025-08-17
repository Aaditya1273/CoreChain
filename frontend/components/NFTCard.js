import { useWriteContract } from 'wagmi';
import { formatEther } from 'viem';

// IMPORTANT: You will need a Marketplace contract and its ABI
// import MarketplaceABI from '../lib/abi/Marketplace.json';
// const MARKETPLACE_ADDRESS = '0x...'; // Replace with your deployed Marketplace contract address

const NFTCard = ({ nft }) => {
  const { writeContract, isPending, error } = useWriteContract();
  const { tokenId, price, seller, imageURI } = nft;

  const handleBuy = () => {
    // This function is a placeholder. A real implementation requires a marketplace contract.
    alert('Buying functionality requires a marketplace smart contract.');
    /*
    writeContract({
      address: MARKETPLACE_ADDRESS,
      abi: MarketplaceABI,
      functionName: 'buyItem',
      args: [nft.nftAddress, tokenId],
      value: price,
    });
    */
  };

  return (
    <div className="card-glow group overflow-hidden transition-all duration-300 hover:scale-105">
      <div className="relative">
        <img 
          src={imageURI || '/placeholder-nft.svg'} 
          alt={`Carbon Credit NFT #${tokenId}`} 
          className="w-full h-56 object-cover" 
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2">Carbon Credit #{tokenId}</h3>
        <p className="text-sm text-gray-400 truncate" title={seller}>Seller: {seller}</p>
        
        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-primary-400">Price</p>
            <p className="text-lg font-bold gradient-text">{formatEther(price)} CORE</p>
          </div>
          <button onClick={handleBuy} disabled={isPending} className="btn-secondary text-sm py-2 px-4">
            {isPending ? 'Purchasing...' : 'Buy Now'}
          </button>
        </div>
        {error && <p className="text-xs text-red-500 mt-2">Error: {error.shortMessage}</p>}
      </div>
    </div>
  );
};

export default NFTCard;

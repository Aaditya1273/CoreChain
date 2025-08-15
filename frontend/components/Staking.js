import { useState } from 'react';
import { useWriteContract } from 'wagmi';
// IMPORTANT: You must place the ABI for StakingPool.sol in this path
import StakingPoolABI from '../lib/abi/StakingPool.json'; 

const STAKING_POOL_ADDRESS = '0x...'; // Replace with your deployed StakingPool contract address

const Staking = () => {
  const { writeContract, isPending, error } = useWriteContract();
  const [geoHash, setGeoHash] = useState('');

  const handleRegisterNode = () => {
    if (!geoHash) {
      alert('Please enter a geolocation hash.');
      return;
    }

    writeContract({
      address: STAKING_POOL_ADDRESS,
      abi: StakingPoolABI,
      functionName: 'registerNode',
      args: [geoHash, 0, 0], // Using default NodeType and EnergySource for simplicity
    });
  };

  return (
    <div className="card">
      <h2>Node Registration & Staking</h2>
      <p>Stake CORE tokens to register your DePIN node.</p>
      <input 
        type="text"
        placeholder="Enter Geolocation Hash"
        value={geoHash}
        onChange={(e) => setGeoHash(e.target.value)}
      />
      <button onClick={handleRegisterNode} disabled={isPending}>
        {isPending ? 'Registering...' : 'Register Node'}
      </button>
      {error && <p className="error">Error: {error.shortMessage}</p>}
    </div>
  );
};

export default Staking;

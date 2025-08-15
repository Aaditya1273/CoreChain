
import Staking from '../components/Staking';
import Dashboard from '../components/Dashboard';
import { useAccount } from 'wagmi';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="main">
      {isConnected ? (
        <>
          <h1 className="page-title">Node Operator Dashboard</h1>
          <div className="grid">
            <Staking />
            <Dashboard />
          </div>
        </>
      ) : (
        <p>Please connect your wallet to view your dashboard.</p>
      )}
    </div>
  );
}

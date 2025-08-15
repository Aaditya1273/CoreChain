import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data - in a real app, this would be fetched from your contracts or a subgraph
const data = [
  { name: 'Jan', energy: 4000, credits: 24 },
  { name: 'Feb', energy: 3000, credits: 13 },
  { name: 'Mar', energy: 2000, credits: 98 },
  { name: 'Apr', energy: 2780, credits: 39 },
  { name: 'May', energy: 1890, credits: 48 },
  { name: 'Jun', energy: 2390, credits: 38 },
  { name: 'Jul', energy: 3490, credits: 43 },
];

const Dashboard = () => {
  return (
    <div className="card">
      <h2>Performance Dashboard</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" label={{ value: 'Energy (Wh)', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Credits Minted', angle: -90, position: 'insideRight' }} />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="energy" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line yAxisId="right" type="monotone" dataKey="credits" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;

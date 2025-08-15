import { GraphQLClient, gql } from 'graphql-request';

// IMPORTANT: Replace with your actual TheGraph Subgraph URL
const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/your-subgraph-name';

const graphQLClient = new GraphQLClient(SUBGRAPH_URL);

export const getActiveNfts = async () => {
  const query = gql`
    {
      activeItems(first: 10, where: { buyer: "0x0000000000000000000000000000000000000000" }) {
        id
        buyer
        seller
        nftAddress
        tokenId
        price
        // Add other fields from your subgraph schema as needed
        // e.g., co2Offset, nodeId, imageURI
      }
    }
  `;
  
  // For demonstration, returning mock data as the subgraph is not yet deployed.
  // In a real implementation, you would use the line below:
  // return await graphQLClient.request(query);
  return {
    activeItems: [
      { id: '1', nftAddress: '0x1', tokenId: '1', price: '1000000000000000000', priceInCore: '1', co2Offset: 150, nodeId: '42', imageURI: null },
      { id: '2', nftAddress: '0x2', tokenId: '2', price: '2500000000000000000', priceInCore: '2.5', co2Offset: 250, nodeId: '13', imageURI: null },
    ]
  }
};

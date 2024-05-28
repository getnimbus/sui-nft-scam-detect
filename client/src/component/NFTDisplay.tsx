import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { toast } from 'react-toastify';
import axios from 'axios';

const rpcUrl = getFullnodeUrl("mainnet");
const suiClient = new SuiClient({
  url: process.env.SUI_RPC_NODE || rpcUrl,
});


interface NFTInfo {
  id: string;
  name: string;
  type: string;
  description: string;
  image_url: string;
  classification: string;
  ham_likelihood: number;
  spam_likelihood: number;
}

interface NFTDisplayProps {
  nftObject: string;
}

const NFTDisplay: React.FC<NFTDisplayProps> = ({ nftObject }) => {
  const [nftInfo, setNftInfo] = useState<NFTInfo | null>(null);

  useEffect(() => {
    if (nftObject) {
      console.log(nftObject);
      fetchNFTInfo(nftObject);
    }
  }, [nftObject]);

  const fetchNFTInfo = async (id: string) => {
    try {
      // Replace with your actual API endpoint and fetching logic
      const [nftData, classification] = await Promise.all([suiClient
        .getObject({
          id,
          options: {
            showDisplay: true,
            showType: true,
            showContent: true,
          },
        })
        .then((res) => res.data),
        axios.get("https://sui-nft-spam-api.getnimbus.io/v1/nfts/classify", {
          params: {
            address: id,
          },
        }).then((res) => res.data)
      ]);
        if (!nftData) {
          toast.error("Not found NFT object data")
        }

        console.log(classification);

      const data = {
        id: nftData?.objectId,
        name: nftData?.display?.data?.name,
        type: nftData?.type,
        description: nftData?.display?.data?.description,
        image_url: nftData?.display?.data?.image_url,
        classification: classification?.classification,
        ham_likelihood: classification?.ham_likelihood,
        spam_likelihood: classification?.spam_likelihood,
      } as NFTInfo;
      setNftInfo(data);
    } catch (error) {
      console.error('Error fetching NFT info:', error);
    }
  };

  if (!nftObject) {
    return <Typography>Please enter an NFT object to see the information.</Typography>;
  }

  if (!nftInfo) {
    return <CircularProgress />;
  }

  return (
    <Box mt={4}>
      <Typography variant="h6">NFT Info</Typography>
      <img src={nftInfo.image_url} alt={nftInfo.name} style={{ width: '50%' }} />
      <Typography>Object ID: {nftInfo.id}</Typography>
      <Typography>Type: {nftInfo.type}</Typography>
      <Typography>Name: {nftInfo.name}</Typography>
      <Typography>Description: {nftInfo.description}</Typography>
      <Typography>Classification: {nftInfo.classification}</Typography>
      <Typography>Ham Likelihood: {nftInfo.ham_likelihood}</Typography>
      <Typography>Spam Likelihood: {nftInfo.spam_likelihood}</Typography>
    </Box>
  );
};

export default NFTDisplay;

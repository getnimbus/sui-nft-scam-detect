import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { toast } from "react-toastify";
import axios from "axios";
import { useQueries, useQuery } from "@tanstack/react-query";

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

const fetchNFTInfo = async (id: string) => {
  try {
    // Replace with your actual API endpoint and fetching logic
    const [nftData, classification] = await Promise.all([
      suiClient
        .getObject({
          id,
          options: {
            showDisplay: true,
            showType: true,
            showContent: true,
          },
        })
        .then((res) => res.data),
      axios
        .get("https://sui-nft-spam-api.getnimbus.io/v1/nfts/classify", {
          params: {
            address: id,
          },
        })
        .then((res) => res.data),
    ]);
    if (!nftData) {
      toast.error("Not found NFT object data");
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

    return data;
  } catch (error) {
    console.error("Error fetching NFT info:", error);
  }
};

const NFTDisplay = ({ nftObject }: NFTDisplayProps) => {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["nft-spam"],
    queryFn: () => fetchNFTInfo(nftObject),
    enabled: nftObject ? true : false,
  });

  // useEffect(() => {
  //   if (nftObject) {
  //     console.log(nftObject);
  //     fetchNFTInfo(nftObject);
  //   }
  // }, [nftObject]);

  const cardData = [
    { label: "Object ID: ", item: data?.id },
    { label: "Type: ", item: data?.type },
    { label: "Name: ", item: data?.name },
    { label: "Description: ", item: data?.description },
    { label: "Classification: ", item: data?.classification },
    { label: "Ham Likelihood: ", item: data?.ham_likelihood },
    { label: "Spam Likelihood: ", item: data?.spam_likelihood },
  ];

  if (!nftObject) {
    return (
      <Typography className="text-red-400">
        Please enter an NFT object to see the information.
      </Typography>
    );
  }

  if (isLoading && isFetching) {
    return <CircularProgress />;
  }

  if (isError)
    return (
      <Typography className="text-red-400">
        Some thing wrong when fetching api ser!!!
      </Typography>
    );

  return (
    <Box mt={4}>
      <Card sx={{ maxWidth: "100%" }}>
        <CardMedia
          sx={{ height: 400 }}
          image={
            data?.image_url.replace("ipfs://", "https://ipfs.io/ipfs/") ||
            "https://www.shutterstock.com/image-vector/ui-image-placeholder-wireframes-apps-600w-1037719204.jpg"
          }
          title={data?.name || "..."}
          style={{
            width: "50%",
            objectFit: "contain",
            margin: "auto",
          }}
        />
        <CardContent>
          {cardData.map((item) => {
            return (
              <Typography fontWeight={600}>
                <span className="font-normal">{item.label}</span>{" "}
                {item.item || "..."}
              </Typography>
            );
          })}
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box mt={4}>
      <Typography variant="h6">NFT Info</Typography>
      <img
        src={
          data?.image_url.replace("ipfs://", "https://ipfs.io/ipfs/") || "..."
        }
        alt={data?.name || "..."}
        style={{ width: "50%" }}
      />
      <Typography>Object ID: {data?.id || "..."}</Typography>
      <Typography>Type: {data?.type || "..."}</Typography>
      <Typography>Name: {data?.name || "..."}</Typography>
      <Typography>Description: {data?.description || "..."}</Typography>
      <Typography>Classification: {data?.classification || "..."}</Typography>
      <Typography>Ham Likelihood: {data?.ham_likelihood || "..."}</Typography>
      <Typography>Spam Likelihood: {data?.spam_likelihood || "..."}</Typography>
    </Box>
  );
};
export default NFTDisplay;

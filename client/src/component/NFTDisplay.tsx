import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { toast } from "react-toastify";
import axios from "axios";
import {
  QueryClient,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { formatCurrency } from "../utils";

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

const handleClassificationIcon = (textInput: string) => {
  const text = textInput.toLowerCase();
  if (text === "verified") {
    return "✅";
  } else if (text === "scam" || text === "spam") {
    return "❌";
  } else {
    return "☑️";
  }
};

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
          // timeout: 2 * 60 * 1000,
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
  const queryClient = useQueryClient();
  const { data, isLoading, isFetching, isError } = useQuery<any>({
    queryKey: ["nft-spam"],
    queryFn: () => fetchNFTInfo(nftObject),

    // hardcode for testing
    // queryFn: () =>
    //   new Promise((resolve, reject) => {
    //     resolve({
    //       id: "0x2bb452d337fd9508b83df4a6e028362510102f9048daa351ffbd7ef7db6a6aa6",
    //       name: "Sui Reward Pass",
    //       type: "0xcbe21650685e7a83190e944674f4c37dcd0dd53b9cc01def0222abd3f7c2d343::sui_collection_w::SUI_COLLECTION",
    //       description:
    //         "You've been rewarded for your activity on Sui Network. Claim your reward at https://suihubs.com",
    //       image_url: "https://suicamp.b-cdn.net/suihubcom/suihub_item.jpg",
    //       classification: "spam",
    //       ham_likelihood: 0.004465306355738455,
    //       spam_likelihood: 0.005257129669189452,
    //     });
    //   }),
    enabled: nftObject ? true : false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["nft-spam"] });
  }, [queryClient, nftObject]);

  console.log(nftObject);

  const cardData = [
    { label: "Object ID:", item: data?.id },
    { label: "Type:", item: data?.type },
    { label: "Name:", item: data?.name },
    { label: "Description:", item: data?.description },
    { label: "Classification:", item: data?.classification },
    { label: "Ham Likelihood:", item: data?.ham_likelihood },
    { label: "Spam Likelihood:", item: data?.spam_likelihood },
  ];

  if (!nftObject) {
    return (
      <Typography className="text-red-400">
        Please enter an NFT object to see the information.
      </Typography>
    );
  }

  if (isLoading || isFetching) {
    return <CircularProgress />;
  }

  if (isError)
    return (
      <Typography className="text-red-400">
        Some thing wrong when fetching api ser!!!
      </Typography>
    );

  return (
    <Box mt={4} sx={{ maxWidth: "100%" }}>
      <Card sx={{ maxWidth: "100%" }}>
        <CardMedia
          sx={{ height: 500 }}
          image={
            data?.image_url.replace("ipfs://", "https://ipfs.io/ipfs/") ||
            "https://www.shutterstock.com/image-vector/ui-image-placeholder-wireframes-apps-600w-1037719204.jpg"
          }
          title={data?.name || "..."}
          style={{
            width: "50%",
            objectFit: "contain",
            margin: "auto",
            borderRadius: "4px",
          }}
        />
        <CardContent>
          {cardData.map((item, index) => {
            return (
              <Typography
                key={index}
                fontWeight={600}
                color={item.label === "Classification: " ? "green" : ""}
                className="flex"
              >
                <span className="font-normal text-black whitespace-pre flex w-[130px]">
                  {item.label}
                </span>{" "}
                {(item.label === "Classification:"
                  ? handleClassificationIcon(item.item) + ` (${item.item})`
                  : item.label === "Ham Likelihood:" ||
                    item.label === "Spam Likelihood:"
                  ? formatCurrency(item.item)
                  : item.item) || "..."}
              </Typography>
            );
          })}
        </CardContent>
      </Card>
    </Box>
  );
};
export default NFTDisplay;

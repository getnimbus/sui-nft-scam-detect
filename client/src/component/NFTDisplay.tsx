import { Box, Typography, Card, CardContent, Skeleton } from "@mui/material";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { formatCurrency } from "../utils";
import { extractAndClassify } from "../utils/classify";
import CheckCardMediaImage from "./CheckCardMediaImage";
import axios from "axios";

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
  scam_likelihood: number;
}

interface NFTDisplayProps {
  nftObject: string;
}

const responsiveSize = () => {
  return window?.innerWidth > 760 ? 500 : window.innerWidth > 420 ? 400 : 300;
};

const handleClassificationIcon = (textInput: string) => {
  const text = textInput.toLowerCase();
  if (text === "ham") {
    return "✅";
  } else if (text === "scam") {
    return "❌";
  } else if (text === "image_error") {
    return "The result may be incorrect due to issues reading the NFT image.";
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
      extractAndClassify(id),
    ]);

    if (!nftData) {
      toast.error("Not found NFT object data");
    }

    const checkIsIpfs = nftData?.display?.data?.image_url
      .split("")
      .slice(0, "ipfs://".length)
      .join("");
    let image_url;
    if (checkIsIpfs === "ipfs://") {
      // https://sui-nft-spam-api.getnimbus.io
      // http://localhost:3000
      image_url =
        "https://sui-nft-spam-api.getnimbus.io/read-image?ipfs=" +
        `${nftData?.display?.data?.image_url.replace("ipfs://", "")}`;
    } else {
      image_url =
        "https://sui-nft-spam-api.getnimbus.io/read-image?link=" +
        nftData?.display?.data?.image_url;
    }

    const data = {
      id: nftData?.objectId,
      name: nftData?.display?.data?.name,
      type: nftData?.type,
      description: nftData?.display?.data?.description,
      image_url,
      classification: classification?.classification || "image_error",
      ham_likelihood: classification?.ham_likelihood || "--",
      scam_likelihood: classification?.scam_likelihood || "--",
    } as NFTInfo;

    return data;
  } catch (error) {
    console.error("Error fetching NFT info:", error);
  }
};

const NFTDisplay = ({ nftObject }: NFTDisplayProps) => {
  const queryClient = useQueryClient();
  const { data, isLoading, isFetching, isError } = useQuery<any>({
    queryKey: ["nft-scam"],
    queryFn: () => fetchNFTInfo(nftObject),

    // hardcode for testing please don't delete it
    // queryFn: () =>
    //   new Promise((resolve, reject) => {
    //     resolve({
    //       id: "0x2bb452d337fd9508b83df4a6e028362510102f9048daa351ffbd7ef7db6a6aa6",
    //       name: "Sui Reward Pass",
    //       type: "0xcbe21650685e7a83190e944674f4c37dcd0dd53b9cc01def0222abd3f7c2d343::sui_collection_w::SUI_COLLECTION",
    //       description:
    //         "You've been rewarded for your activity on Sui Network. Claim your reward at https://suihubs.com",
    //       image_url: "https://suicamp.b-cdn.net/suihubcom/suihub_item.jpg",
    //       classification: "scam",
    //       ham_likelihood: 0.004465306355738455,
    //       scam_likelihood: 0.005257129669189452,
    //     });
    //   }),
    enabled: nftObject ? true : false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["nft-scam"] });
  }, [nftObject]);

  const cardData = [
    { label: "Object ID", desc: data?.id },
    { label: "Type", desc: data?.type },
    { label: "Name", desc: data?.name },
    { label: "Description", desc: data?.description },
    { label: "Classification", desc: data?.classification },
    { label: "Ham Likelihood", desc: data?.ham_likelihood },
    { label: "Scam Likelihood", desc: data?.scam_likelihood },
  ];

  if (!nftObject) {
    return <></>;
  }

  if (isLoading || isFetching) {
    return (
      <Box mt={4} sx={{ maxWidth: "100%" }}>
        <Card sx={{ maxWidth: "100%" }}>
          <Skeleton
            height={responsiveSize()}
            width={responsiveSize()}
            variant="rounded"
            className="mx-auto"
          />
          <CardContent className="w-full overflow-hidden">
            {cardData.map((item, index) => {
              return (
                <Typography key={index} className="flex">
                  <span className="whitespace-pre flex w-[130px] mr-2">
                    {item.label}
                  </span>{" "}
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    className="w-[1000px] overflow-hidden"
                  />
                </Typography>
              );
            })}
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box mt={4} sx={{ maxWidth: "100%" }}>
        <Card sx={{ maxWidth: "100%" }}>
          <CheckCardMediaImage
            imgName=""
            src="/image-not-found.png"
            defaultImg=""
            className="md:h-[500px] mx-auto rounded-xl"
          />
          <CardContent className="w-full overflow-hidden">
            <Typography color="red" fontWeight={500}>
              Error: NFT image IPFS loading failed. Please try again later.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box mt={4} sx={{ maxWidth: "100%" }}>
      <Card sx={{ maxWidth: "100%" }} className="xl:w-full">
        <CheckCardMediaImage
          imgName=""
          src={data?.image_url}
          defaultImg="/image-not-found.png"
          className="md:h-[500px] mx-auto rounded-xl"
        />
        <CardContent className="w-full overflow-x-auto">
          {cardData.map((item, index) => {
            return (
              <Typography
                key={index}
                fontWeight={600}
                className={`flex w-full whitespace-nowrap pr-2 ${
                  item.label === "Classification"
                    ? item.desc === "ham"
                      ? "text-green-500"
                      : item.desc === "scam"
                      ? "text-red-500"
                      : item.desc === "image_error"
                      ? "text-gray-500"
                      : ""
                    : ""
                }`}
              >
                <span className="font-normal text-black whitespace-pre flex w-[130px] mr-2">
                  {item.label}
                </span>{" "}
                {(item.label === "Classification"
                  ? handleClassificationIcon(item.desc) +
                    ` (${item.desc === "scam" ? "Scam" : "Verified"})`
                  : item.label === "Ham Likelihood" ||
                    item.label === "Scam Likelihood"
                  ? formatCurrency(item.desc)
                  : item.desc) || "..."}
              </Typography>
            );
          })}
        </CardContent>
      </Card>
    </Box>
  );
};
export default NFTDisplay;

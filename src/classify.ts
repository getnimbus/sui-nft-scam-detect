import axios from "axios";
import { createWorker } from "tesseract.js";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import defaultModel from "@resources/model.json";

const THRESHOLD_PRICE = 1; // min price is 1 SUI incase of spam NFT listing
const THRESHOLD_VOLUME = 100; // min volume is 100 SUI incase of spam NFT listing

const rpcUrl = getFullnodeUrl("mainnet");
const suiClient = new SuiClient({
  url: process.env.SUI_RPC_NODE || rpcUrl,
});

// Image OCR
// very slow, not recommended for production
// should roll your own OCR
const getImageData = async (imageUrl: string) => {
  try {
    const worker = await createWorker("eng", 1, {
      cachePath: "/tmp",
    });
    const ret = await worker.recognize(imageUrl);
    const imageWords = ret.data.text.split(/\s+/);
    const imageContainsUrl = imageWords.some(
      (word) =>
        // word.match(/^[\S]+[.][\S]/)
        word.match(
          /^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/
        ) ||
        word.startsWith("http://") ||
        word.startsWith("https://")
    );
    worker.terminate();

    return { imageWords, imageContainsUrl };
  } catch (err) {
    console.log(err);
    return { imageWords: [], imageContainsUrl: false };
  }
};

export const extractTokens = async (address: string): Promise<string[]> => {
  const nft = await suiClient
    .getObject({
      id: address,
      options: {
        showDisplay: true,
        showType: true,
        showContent: true,
      },
    })
    .then((res) => res.data);
  if (!nft || !nft?.type) {
    throw new Error("Not found NFT object data");
  }

  const collection = await axios
    .get(
      `https://suiscan.xyz/api/sui-backend/mainnet/api/collections/${nft.type}`
    )
    .then((res) => res.data);

  // TODO: may need to cache this result
  // let imageData = await getImageData(
  //   nft?.display?.data?.image_url?.replace(
  //     "ipfs://",
  //     "https://ipfs.io/ipfs/"
  //   ) ?? ""
  // );
  const imageUrl = nft?.display?.data?.image_url?.includes("ipfs://")
    ? "https://sui-nft-spam-api.getnimbus.io/read-image?ipfs=" +
      nft?.display?.data?.image_url?.replace("ipfs://", "")
    : nft?.display?.data?.image_url;
  let imageData = await getImageData(imageUrl ?? "");
  let imageWords = imageData.imageWords;
  let imageContainsUrl = imageData.imageContainsUrl;

  // Get the words from the NFT metadata
  const attributeWords = (
    nft?.content?.fields?.attributes?.fields?.map?.fields.contents ?? []
  ).flatMap((attr) => [
    ...attr?.fields?.value.split(/\s+/),
    ...attr?.fields?.key.split(/\s+/),
  ]);
  const descriptionWords = nft.display?.data?.description?.split(/\s+/) ?? "";
  const nameWords = nft.display?.data?.name?.split(/\s+/) ?? "";

  // Check attribute/description/name for an emoji
  const allWords = [...attributeWords, ...descriptionWords, ...nameWords];
  const regexEmoji = /\p{Extended_Pictographic}/u;
  const containsEmoji = allWords.some((word) => regexEmoji.test(word));

  let tokens = [...imageWords, ...attributeWords] // only image and attribute words are useful for classification purposes
    .filter((word) => {
      if (word === "[]") return false;
      if (word.length <= 3) return false; // ignore words with less than 3 characters, kinda hacky but useful

      return true;
    })
    .map((word) => word.toLowerCase());

  const keywords = [
    "containsEmoji",
    "imageContainsUrl",
    "not_containsEmoji",
    "not_imageContainsUrl",
  ];

  tokens.filter((token) => {
    return !keywords.includes(token);
  });

  tokens.push(
    nft?.display?.data?.image_url ? "imageExists" : "not_imageExists"
  );
  tokens.push(containsEmoji ? "containsEmoji" : "not_containsEmoji");
  tokens.push(imageContainsUrl ? "imageContainsUrl" : "not_imageContainsUrl");
  tokens.push(
    collection?.marketplaces.length > 0
      ? "listingMarketplace"
      : "not_listingMarketplace"
  );
  if (
    Number(collection?.latestNftPrice || 0) > THRESHOLD_PRICE &&
    Number(collection?.volume || 0) >= THRESHOLD_VOLUME
  ) {
    tokens.push("hasSalesVolume");
  }
  tokens.push(
    collection?.projectScamMessage || collection?.scamMessage
      ? "scamCollection"
      : "not_scamCollection"
  );
  tokens.push(collection ? "collectionExists" : "not_collectionExists");

  return tokens;
};

const scamNftTokens = [
  "scamCollection",
  "imageContainsUrl",
  "containsEmoji",
  "not_imageExists",
  "not_collectionExists",
];

export const classify = (tokens: string[], model: any = defaultModel) => {
  // if token is in scamNftTokens then it's a scam
  for (const scamToken of scamNftTokens) {
    if (tokens.includes(scamToken)) {
      return {
        classification: "scam",
        scam_likelihood: 1,
        ham_likelihood: 0,
      };
    }
  }
  // if token has sales and volume then it's a ham
  if (tokens.includes("hasSalesVolume")) {
    return {
      classification: "ham",
      scam_likelihood: 0,
      ham_likelihood: 1,
    };
  }

  let scam_likelihood = model.scam.size / (model.scam.size + model.ham.size);
  let ham_likelihood = 1 - scam_likelihood;
  const unique_tokens = new Set(tokens);

  unique_tokens.forEach((token) => {
    const scam_token_likelihood =
      ((model.scam.tokens[token] || 0) + 1) / (model.scam.size + 2);
    const ham_token_likelihood =
      ((model.ham.tokens[token] || 0) + 1) / (model.ham.size + 2);

    scam_likelihood *= scam_token_likelihood;
    ham_likelihood *= ham_token_likelihood;
  });

  return {
    classification: scam_likelihood > ham_likelihood ? "scam" : "ham",
    scam_likelihood,
    ham_likelihood,
  };
};

export const extractAndClassify = async (
  address: string
): Promise<{
  classification: string;
  scam_likelihood: number;
  ham_likelihood: number;
}> => {
  const tokens = await extractTokens(address);
  return classify(tokens);
};

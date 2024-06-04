import { createWorker } from "tesseract.js";
import defaultModel from "./resources/model.json";

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

export const extractTokens = async (imageUrl: string): Promise<string[]> => {
  let imageData = await getImageData(imageUrl);
  let imageWords = imageData.imageWords;
  let imageContainsUrl = imageData.imageContainsUrl;

  let tokens = imageWords
    .filter((word) => {
      if (word === "[]") return false;
      if (word.length <= 3) return false; // ignore words with less than 3 characters, kinda hacky but useful

      return true;
    })
    .map((word) => word.toLowerCase());

  const keywords = ["imageContainsUrl", "not_imageContainsUrl"];

  tokens.filter((token) => {
    return !keywords.includes(token);
  });

  tokens.push(imageContainsUrl ? "imageContainsUrl" : "not_imageContainsUrl");

  return tokens;
};

const scamNftTokens = ["imageContainsUrl"];

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
  imageUrl: string
): Promise<{ classification: string }> => {
  const tokens = await extractTokens(imageUrl);
  return classify(tokens);
};

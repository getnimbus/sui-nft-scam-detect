require("dotenv").config();
import * as fs from "fs";
import * as path from "path";
import { extractTokens } from "src/classify";
import scam_ids from "@resources/scam_ids.json";
import ham_ids from "@resources/ham_ids.json";

let model: any = {
  scam: {
    tokens: {},
    size: 0,
  },
  ham: {
    tokens: {},
    size: 0,
  },
};

const train = (category: string, tokens: string[]) => {
  model[category].size += 1;

  const unique_tokens = new Set(tokens);
  unique_tokens.forEach((token) => {
    if (!model[category].tokens[token]) {
      model[category].tokens[token] = 0;
    }
    model[category].tokens[token] += 1;
  });
};

// download and train the classifier on the scam and ham categories
const downloadAndTrain = async () => {
  for (let i = 0; i < scam_ids.length; i++) {
    const id = scam_ids[i];
    const tokens = await extractTokens(id);
    train("scam", tokens);
    console.log(`trained ${id} as scam ${i + 1}/${scam_ids.length}`);
  }

  for (let i = 0; i < ham_ids.length; i++) {
    const id = ham_ids[i];
    const tokens = await extractTokens(id);
    train("ham", tokens);
    console.log(`trained ${id} as ham ${i + 1}/${ham_ids.length}`);
  }
};

const cleanModel = () => {
  const keywords = [
    "imageExists",
    "containsEmoji",
    "imageContainsUrl",
    "listingMarketplace",
    "collectionExists",
    "scamCollection",
    "not_imageExists",
    "not_containsEmoji",
    "not_imageContainsUrl",
    "not_listingMarketplace",
    "not_collectionExists",
    "not_scamCollection",
  ];

  for (let category in model) {
    for (let token in model[category].tokens) {
      if (keywords.includes(token)) continue;

      if (model[category].tokens[token] < 2) {
        delete model[category].tokens[token];
      }
    }
  }
};

async function main() {
  await downloadAndTrain();
  cleanModel();
  fs.writeFileSync(
    path.join(__dirname, "../resources/model.json"),
    JSON.stringify(model)
  );
  console.log("model saved to model.json");
}

main();

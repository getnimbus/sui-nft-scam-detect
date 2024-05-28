require("dotenv").config();
import * as fs from "fs";
import * as path from "path";
import { extractTokens } from "src/classify";
import spam_ids from "@resources/spam_ids.json";
import ham_ids from "@resources/ham_ids.json";

let model: any = {
  spam: {
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

// download and train the classifier on the spam and ham categories
const downloadAndTrain = async () => {
  for (let i = 0; i < spam_ids.length; i++) {
    const id = spam_ids[i];
    const tokens = await extractTokens(id);
    train("spam", tokens);
    console.log(`trained ${id} as spam ${i + 1}/${spam_ids.length}`);
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

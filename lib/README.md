# SUI NFT Scam Detector

A lightweight detector scam classifier for NFTs with 95% accuracy. Can run anywhere that webassembly runs: on a server, in a lambda function, and even running entirely in your browser.

Also included is the model training code and data, so you can train and bring your own model if the default model is not performing well.

Feature extraction is done with a combination of on-chain data and OCR using the `tesseract.js` library. Classification is done with naive bayes and hand-picked labels.

We labeled NFT into 2 categories:
- Scam: NFT that our classifier detected as scammed
- Ham: NFT that our classifier detected as trusted

## Installation

- Using npm
```bash
npm install nft-scam-detector --save
```

- Using yarn
```bash
yarn add nft-scam-detector
```

## Getting started

```js
import { extractAndClassify } from "nft-scam-detector";

const imageUrl = "YOUR_NFT_IMAGE_URL";
const result = extractAndClassify(imageUrl);

result.then(console.log);
// result here 
// 
// {
//     "classification": "scam",
//     "scam_likelihood": 0.0001565123,
//     "ham_likelihood": 0.0000004214,
// }
// 
```

## Testing

Live testing at: https://sui-nft-spam-fe.getnimbus.io/

You can test the accuracy of a model using the code in the `/test` folder. Make sure that your training set and test set do not overlap. It should spit out a confusion matrix as well as all of the mistakes made with accuracy more than 95%

|                | scam (predicted) | ham (predicted) |
|----------------|------------------|-----------------|
| scam (actual)  | 20               | 0               |
| ham (actual)   | 2                | 18              |

* avg time: 1930ms
* median time: 1820ms

## License

MIT License

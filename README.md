# SUI NFT Scam Detector

A lightweight detector scam classifier for NFTs on Sui with 95% accuracy. Can run anywhere that webassembly runs: on a server, in a lambda function, and even running entirely in your browser.

Also included is the model training code and data, so you can train and bring your own model if the default model is not performing well.

Feature extraction is done with a combination of on-chain data and OCR using the `tesseract.js` library. Classification is done with naive bayes and hand-picked labels.

We labeled NFT into 2 categories:
- Scam: NFT that our classifier detected as scammed
- Ham: NFT that our classifier detected as trusted

## Installation

1. Input your list of ham and scam in `ham_ids.json` and `scam_ids.json`

2. Run training `model.json`

```bash
yarn run train
```

3. Run api. Api ready in port :3000

```bash
yarn build
yarn start
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

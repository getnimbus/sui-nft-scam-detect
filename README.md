# SUI NFT Spam Detector

A lightweight detector spam classifier for NFTs on Sui.

Also included is the model training code and data, so you can train and bring your own model if the default model is not performing well.

Feature extraction is done with a combination of on-chain data and OCR using the tesseract.js library. Classification is done with naive bayes and hand-picked labels.

We labeled NFT into 4 categories:
- Verified: NFT that is verified and audited in Sui explorer
- Scam: NFT that is reported as scammed
- Spam: NFT that our classifier detected as spammed
- Ham: NFT that our classifier detected as trusted

## Installation

1. Input your list of ham and spam in `ham_ids.json` and `spam_ids.json`

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
This api has rate limit so please don't spam us.

## License

MIT License

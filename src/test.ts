import { extractAndClassify } from "nft-scam-detector";

const imageUrl =
  "https://lh3.googleusercontent.com/9I8geJrt5uoAZx14uAxTkhVYwE1R4Ft-su28858hyn7OJTPkdad91gY-Kqf-8eCDBGYECEEMscpeC9sFiuzK_djgc2LC09ctww=s250";
const result = extractAndClassify(imageUrl);

result.then(console.log);

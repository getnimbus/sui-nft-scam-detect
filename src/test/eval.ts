import "dotenv/config";
import ham_ids from "./ham_ids.json";
import scam_ids from "./scam_ids.json";
import { extractAndClassify } from "src/classify";

let times: number[] = [];

function printAccuracy(accuracy: any, mistakes: string[]) {
  const true_scam = accuracy.scam.true;
  const false_scam = accuracy.scam.false;
  const true_ham = accuracy.ham.true;
  const false_ham = accuracy.ham.false;

  const confusion_matrix = {
    "scam (actual)": {
      "scam (predicted)": true_scam,
      "ham (predicted)": false_ham,
    },
    "ham (actual)": {
      "scam (predicted)": false_scam,
      "ham (predicted)": true_ham,
    },
  };

  const avg_time = times.reduce((a, b) => a + b, 0) / times.length;
  const median_time = times.sort((a, b) => a - b)[Math.floor(times.length / 2)];

  console.clear();
  console.table(confusion_matrix);
  console.log(`avg time: ${avg_time}ms`);
  console.log(`median time: ${median_time}ms`);
  console.log(mistakes);
}

async function evaluate() {
  let accuracy = {
    scam: {
      true: 0,
      false: 0,
      errors: 0,
    },
    ham: {
      true: 0,
      false: 0,
      errors: 0,
    },
  };
  let mistakes = [];

  for (let id of ham_ids) {
    try {
      const startTime = new Date().getTime();
      let result = await extractAndClassify(id);
      const endTime = new Date().getTime();
      times.push(endTime - startTime);

      if (result.classification === "ham") {
        accuracy.ham.true++;
      } else if (result.classification === "scam") {
        accuracy.scam.false++;
        mistakes.push(id);
      }
    } catch (e) {
      accuracy.ham.errors++;
    }
    printAccuracy(accuracy, mistakes);
  }

  for (let id of scam_ids) {
    try {
      const startTime = new Date().getTime();
      let result = await extractAndClassify(id);
      console.log(result);
      const endTime = new Date().getTime();
      times.push(endTime - startTime);

      if (result.classification === "scam") {
        accuracy.scam.true++;
      } else if (result.classification === "ham") {
        accuracy.ham.false++;
        mistakes.push(id);
      }
    } catch (e) {
      accuracy.scam.errors++;
    }
    printAccuracy(accuracy, mistakes);
  }

  printAccuracy(accuracy, mistakes);
}

evaluate();

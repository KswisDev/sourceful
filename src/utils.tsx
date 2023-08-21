import type { attribute, option } from "./types/sharedTypes";

var numeral = require("numeral");

const calculateScore = (optionAttributes: attribute[]) => {
  let totalScore = 0;
  optionAttributes.forEach((attr) => {
    totalScore += attr.value * (attr.weight / 100);
  });
  return Number(numeral(totalScore).format("0.00"));
};

const calculateWinner = (options: option[]) => {
  const winner =
    options.length > 0
      ? options.reduce(function (prev, current) {
          return prev.score > current.score ? prev : current;
        })
      : null;
  return winner;
};

export { calculateScore, calculateWinner };

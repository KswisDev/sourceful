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

const initialEdges = (attributes: attribute[], options: option[]) => {
  let winnerEdges = [];
  const initialEdges = attributes.flatMap((attr, attrIndex) => {
    return options.map((opt, optIndex) => {
      return {
        id: `attr-${attrIndex}-opt-${optIndex}`,
        source: `${attr.id}`,
        target: `${opt.id}`,
        sourceHandle: `handle-${attr.id}`,
        targetHandle: `handle-${opt.id}`,
      };
    });
  });

  for (let i = 0; i < options.length; i++) {
    winnerEdges.push({
      id: `opt-${i}-winner`,
      source: options[i].id,
      target: `winner-node`,
    });
  }

  return [...initialEdges, ...winnerEdges];
};

export { calculateScore, calculateWinner, initialEdges };

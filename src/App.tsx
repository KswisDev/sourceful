import React from "react";
import "./App.css";
import ReactFlow, { Node } from "reactflow";
import { useLocalStorage } from "usehooks-ts";

import "reactflow/dist/style.css";
import AttributeNode from "./components/AttributeNode";
import type { attribute, option } from "./types/sharedTypes";
import OptionNode from "./components/OptionNode";
import WinnerNode from "./components/WinnerNode";
import AttributeForm from "./components/AttributeForm";
import OptionForm from "./components/OptionForm";

var numeral = require("numeral");

const nodeTypes = {
  attribute: AttributeNode,
  option: OptionNode,
  winner: WinnerNode,
};

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

function App() {
  const [showAttributeForm, setShowAttributeForm] = React.useState(false);
  const [showOptionForm, setShowOptionForm] = React.useState(false);
  const [winner, setWinner] = React.useState<option | null>(null);
  const [attributes, setAttributes] = useLocalStorage<attribute[]>(
    "attributes",
    []
  );
  const [options, setOptions] = useLocalStorage<option[]>("options", []);

  React.useEffect(() => {
    setWinner(calculateWinner(options));
  }, [options]);

  const calculateAllScores = (optionsToRescore: option[]) =>
    optionsToRescore.map((opt) => {
      opt.score = calculateScore(opt.attributes);
      return opt;
    });

  const handleWeightChange = (id: string, newValue: number) => {
    let newOptions = options.map((opt) => {
      opt.attributes.forEach((attr) => {
        if (attr.id === id) {
          attr.weight = newValue;
        }
      });

      return opt;
    });

    newOptions = calculateAllScores(newOptions);

    const newAttributes = attributes.map((attr) => {
      if (attr.id === id) {
        attr.weight = newValue;
      }
      return attr;
    });
    setAttributes(newAttributes);
    setOptions(newOptions);
  };

  const handleAttributeChange = (
    attributeId: string,
    optionId: string,
    newValue: number
  ) => {
    let newOptions = options.map((opt) => {
      if (opt.id === optionId) {
        opt.attributes.forEach((attr) => {
          if (attr.id === attributeId) {
            attr.value = newValue;
          }
        });
      }

      return opt;
    });
    newOptions = calculateAllScores(newOptions);
    setOptions(newOptions);
  };

  const updateOptions = (newOptions: option[]) => {
    newOptions = calculateAllScores(newOptions);
    setOptions(newOptions);
  };

  const initialNodes = [
    ...attributes.map((a, index) => {
      return {
        id: `attr-${index}`,
        type: "attribute",
        position: { x: index * 200, y: 0 },
        selectable: true,
        deletable: true,
        data: {
          weight: a.weight,
          heading: a.name,
          onInputChange: handleWeightChange,
        },
      };
    }),
    ...options.map((opt, index) => {
      return {
        id: `opt-${index}`,
        type: "option",
        position: { x: index * 200, y: 200 },
        selectable: true,
        deletable: true,
        data: {
          option: opt,
          handleInputChange: handleAttributeChange,
        },
      };
    }),
    {
      id: "winner-node",
      type: "winner",
      position: { x: 300, y: 400 + attributes.length * 50 },
      data: {
        optionName: winner?.name,
      },
    },
  ];

  // add tests
  // video demo
  const initialEdges = () => {
    let winnerEdges = [];
    const initialEdges = attributes.flatMap((attr, attrIndex) => {
      return options.map((opt, optIndex) => {
        return {
          id: `attr-${attrIndex}-opt-${optIndex}`,
          source: `attr-${attrIndex}`,
          target: `opt-${optIndex}`,
          sourceHandle: `handle-${attr.id}`,
          targetHandle: `handle-${opt.id}`,
        };
      });
    });

    for (let i = 0; i < options.length; i++) {
      winnerEdges.push({
        id: `opt-${i}-winner`,
        source: `opt-${i}`,
        target: `winner-node`,
      });
    }

    return [...initialEdges, ...winnerEdges];
  };

  const deleteNode = (node: Node) => {
    switch (node.type) {
      case "option": {
        setOptions(options.filter((opt) => opt.id !== node.id));
        break;
      }
      case "attribute": {
        updateOptions(
          options.map((opt) => {
            opt.attributes = opt.attributes.filter(
              (attr) => attr.id !== node.id
            );
            return opt;
          })
        );
        setAttributes(attributes.filter((attr) => attr.id !== node.id));
        break;
      }
    }
  };

  return (
    <div>
      <section className="text-center">
        <h1>Decision maker</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowAttributeForm(!showAttributeForm)}
        >
          Add attribute
        </button>
        <button
          className="btn btn-primary ml-4"
          onClick={() => setShowOptionForm(!showOptionForm)}
        >
          Add option
        </button>
      </section>
      {showOptionForm && (
        <OptionForm
          attributes={attributes}
          options={options}
          updateOptions={updateOptions}
          closeForm={() => setShowOptionForm(false)}
        />
      )}
      {showAttributeForm && (
        <AttributeForm
          attributes={attributes}
          options={options}
          updateAttributes={setAttributes}
          updateOptions={updateOptions}
          closeForm={() => setShowAttributeForm(false)}
        />
      )}
      <br />
      <div style={{ height: "90vh" }}>
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges()}
          nodeTypes={nodeTypes}
          onNodesDelete={(nodes) => deleteNode(nodes[0])}
        />
      </div>
    </div>
  );
}

export default App;

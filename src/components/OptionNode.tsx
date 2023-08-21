import React from "react";
import { Handle, Position } from "reactflow";
import Slider from "./Slider";
import type { attribute, option } from "../types/sharedTypes";

type OptionNodeProps = {
  id: string;
  data: {
    option: option;
    handleInputChange: (
      attributeId: string,
      optionId: string,
      value: number
    ) => void;
  };
};

function OptionNode({ id, data }: OptionNodeProps) {
  const handleInputChange = (attributeId: string, value: number) => {
    data.handleInputChange(attributeId, data.option.id, value);
  };

  return (
    <div className="border border-solid p-4 drop-shadow-sm">
      <h3>{data.option?.name}</h3>
      <hr />
      {data.option?.attributes.map((so: attribute) => {
        return (
          <div key={so.name}>
            <Slider
              id={so.id}
              currentValue={so.value}
              label={so.name}
              onChange={handleInputChange}
            />
          </div>
        );
      })}
      <h4>Score</h4>
      <strong>{data.option?.score}</strong>

      <Handle
        type="target"
        position={Position.Top}
        id={`handle-${data.option?.id}`}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id={`handle-${data.option?.id}`}
      />
    </div>
  );
}

export default OptionNode;

import React from "react";
import { Handle, Position } from "reactflow";

import Slider from "./Slider";

type AttributeNodeProps = {
  id: string;
  data: {
    weight: number;
    heading: string;
    onInputChange?: (id: string, value: number) => void;
  };
};

function AttributeNode({ id, data }: AttributeNodeProps) {
  return (
    <div className="border border-solid p-4 drop-shadow-sm">
      <h3>{data.heading}</h3>
      <hr />
      <div>
        <Slider
          id={id}
          currentValue={data.weight}
          label="Weighting"
          onChange={data.onInputChange}
        />
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id={`handle-${data.heading}`}
      />
    </div>
  );
}

export default AttributeNode;

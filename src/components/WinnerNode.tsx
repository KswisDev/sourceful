import React from "react";
import { Handle, Position } from "reactflow";

type WinnerNodeProps = {
  data: {
    optionName?: string;
  };
};

function WinnerNode({ data }: WinnerNodeProps) {
  return (
    <div className="border border-solid p-4 drop-shadow-sm">
      <h3>Winner</h3>
      <hr />
      <h4>
        <strong>{data.optionName}</strong>
      </h4>
      <Handle type="target" position={Position.Top} id={`winner-handle`} />
    </div>
  );
}

export default WinnerNode;

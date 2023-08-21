import React from "react";

type sliderProps = {
  currentValue?: number;
  label: string;
  id: string;
  onChange?: (id: string, value: number) => void;
};

function Slider({ currentValue, label, id, onChange }: sliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(id, Number(e.target.value));
  };

  return (
    <div>
      <div>
        <label>
          {label}: {currentValue}
        </label>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={currentValue}
        onChange={handleChange}
        step="1"
        className="nodrag"
      />
    </div>
  );
}

export default Slider;

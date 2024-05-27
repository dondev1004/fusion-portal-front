import React, { Dispatch, ReactNode, SetStateAction } from "react";

export interface ToggleItem {
  id: string;
  node: ReactNode | string;
}

export interface IToggle {
  first: ToggleItem;
  second: ToggleItem;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
}

const Toggle: React.FC<IToggle> = ({
  first,
  second,
  selected,
  setSelected,
}) => {
  return (
    <div className="grid grid-cols-2 items-center justify-center p-1 bg-grey-1 rounded-custom">
      <button
        onClick={() => setSelected(first.id)}
        className={`${
          selected === first.id
            ? "bg-gradient-to-b border border-custom-opacity shadow-custom-1"
            : ""
        } rounded-custom ${
          typeof first.node === "string" ? "px-6 py-3.5" : "p-3.5"
        } transition duration-300 ease-in-out`}
      >
        <p
          className={`font-medium text-base leading-5 text-center ${
            selected === first.id ? "text-accent" : "text-body-light"
          }`}
        >
          {first.node}
        </p>
      </button>
      <button
        onClick={() => setSelected(second.id)}
        className={`${
          selected === second.id
            ? "bg-gradient-to-b border border-custom-opacity shadow-custom-1"
            : ""
        } rounded-custom ${
          typeof second.node === "string" ? "px-6 py-3.5" : "p-3.5"
        } transition duration-300 ease-in-out`}
      >
        <p
          className={`font-medium text-base leading-5 text-center ${
            selected === second.id ? "text-accent" : "text-body-light"
          }`}
        >
          {second.node}
        </p>
      </button>
    </div>
  );
};

export default Toggle;

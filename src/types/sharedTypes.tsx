export type attribute = {
  id: string;
  name: string;
  value: number;
  weight: number;
};

export type option = {
  id: string;
  name: string;
  attributes: attribute[];
  score: number;
};

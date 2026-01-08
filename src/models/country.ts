export type Country = {
  id: string;
  name: string;
  capital: string;
  population: number;
  flagUrl: string;
  flagAlt: string;
};

export type SortKey = "name" | "population";
export type SortDirection = "asc" | "desc";

export type SortState = {
  key: SortKey;
  direction: SortDirection;
};

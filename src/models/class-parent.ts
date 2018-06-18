import { ParentSymbol } from "../commands";

export interface ClassParent {
  [className: string]: ParentSymbol;
}

export interface ClassInterfaces {
  [className: string]: ParentSymbol[];
}

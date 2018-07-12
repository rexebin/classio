"use strict";

import { SymbolInformation } from "vscode";
import { CachedSymbol, DecorationOptionsForParents } from "../models";
export const baseClassRegex = /(class)(\s+)(\w+)(<.*>)?(\s+)(extends)/;
export const interfaceRegex = /(implements)(\s+)/;

export const csharpRegex = /(class)(\s+)(\w+)(<.*>)?(\s+)?(:)/;

export function hasParents(document: string, regex: RegExp): boolean {
  const map = document.match(regex);
  if (map && map.length > 0) {
    return true;
  }
  return false;
}

export function convertToCachedSymbols(
  symbols: SymbolInformation[]
): CachedSymbol[] {
  const cachedSymbols: CachedSymbol[] = [];
  symbols.forEach(symbol => {
    cachedSymbols.push(
      new CachedSymbol(
        symbol.location.uri.fsPath,
        symbol.location.range.start.line,
        symbol.location.range.start.character,
        symbol.name,
        symbol.containerName,
        symbol.kind
      )
    );
  });
  return cachedSymbols;
}

export function mergeDecorations(
  decorations: DecorationOptionsForParents[]
): DecorationOptionsForParents {
  const result: DecorationOptionsForParents = {
    class: [],
    interface: []
  };
  decorations.forEach(decoration => {
    Object.keys(decoration).forEach(key => {
      if (decoration[key]) {
        if (key === "interface") {
          decoration[key].forEach(d => {
            const existingDecoration = result[key].find(
              r => r.range.start == d.range.start
            );
            if (existingDecoration) {
              existingDecoration.hoverMessage =
                existingDecoration.hoverMessage +
                ", " +
                (<string>d.hoverMessage).replace("implements ", "");
            } else {
              result[key] = [...result[key], d];
            }
          });
        } else {
          result[key] = [...result[key], ...decoration[key]];
        }
      }
    });
  });
  return result;
}

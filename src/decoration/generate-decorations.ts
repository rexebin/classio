import { Position, Range, SymbolInformation, window, SymbolKind } from "vscode";
import { CachedSymbol } from "../models";
import { DecorationOptionsForParents } from "../models/decoration-options";
import { log, ParentSymbol } from "../commands";

export function generateDecorations(
  targetSymbols: SymbolInformation[],
  parentSymbol: ParentSymbol,
  symbolsOfParent: CachedSymbol[],
  symbolKind: SymbolKind
): DecorationOptionsForParents {
  let decorationOptionsForParent: DecorationOptionsForParents = {
    class: [],
    interface: []
  };
  const activeEditor = window.activeTextEditor;
  if (!activeEditor) {
    return {};
  }
  targetSymbols.forEach(targetSymbol => {
    const parentPropertyMethodSymbol = symbolsOfParent.find(
      symbolInParentUri =>
        symbolInParentUri.name === targetSymbol.name &&
        symbolInParentUri.containerName === parentSymbol.name &&
        // filter out false positive when parent symbol and target symbol are in same document uri.
        symbolInParentUri.containerName !== targetSymbol.containerName
    );
    if (!parentPropertyMethodSymbol) {
      return;
    }
    const parentSymbolsInParent = symbolsOfParent.filter(
      s => s.name === parentSymbol.name && s.kind === symbolKind
    );
    if (parentSymbolsInParent.length === 0) {
      return;
    }

    if (symbolKind === SymbolKind.Class) {
      const decoration = {
        range: new Range(
          targetSymbol.location.range.start,
          new Position(
            targetSymbol.location.range.start.line,
            targetSymbol.location.range.start.character +
              targetSymbol.name.length
          )
        ),
        hoverMessage: "override " + parentPropertyMethodSymbol.containerName
      };
      decorationOptionsForParent["class"].push(decoration);
    } else if (symbolKind === SymbolKind.Interface) {
      const decoration = {
        range: new Range(
          targetSymbol.location.range.start,
          new Position(
            targetSymbol.location.range.start.line,
            targetSymbol.location.range.start.character +
              targetSymbol.name.length
          )
        ),
        hoverMessage: "implements " + parentPropertyMethodSymbol.containerName
      };
      decorationOptionsForParent["interface"].push(decoration);
    }
  });
  log("from generateDecorations:");
  log(decorationOptionsForParent);
  return decorationOptionsForParent;
}

import { TextDocument, TextEditor, SymbolKind } from "vscode";
import {
  baseClassRegex,
  getBaseClassSymbol,
  getInterfaceSymbols,
  getSymbolsOpenedUri,
  hasParents,
  interfaceRegex,
  log,
  mergeDecorations,
  getSymbolsForModules
} from "../commands";
import { ClassParent, ClassInterfaces } from "../models";
import { DecorationOptionsForParents } from "../models/decoration-options";
import { clearDecoration, decorateEditor } from "./decorate-editor";
import { getDecorationByParent } from "./get-decoration-by-parent";
export async function refreshDecorations(activeEditor?: TextEditor) {
  try {
    if (!activeEditor) {
      return;
    }
    log("refresh start:");
    const document: TextDocument = activeEditor.document;
    const text = document.getText();
    if (
      !hasParents(text, baseClassRegex) &&
      !hasParents(text, interfaceRegex)
    ) {
      log("no parent found");
      clearDecoration(activeEditor);
      return;
    }

    let symbols = await getSymbolsOpenedUri(document.uri);

    const moduleSymbols = await getSymbolsForModules(document, symbols);
    symbols = [...symbols, ...moduleSymbols];

    // if there is no symbols in the current document, return;
    if (symbols.length === 0) {
      log("no symbol found");
      clearDecoration(activeEditor);
      return;
    }

    log(symbols);
    let classParent: ClassParent = {};
    let classInterfaces: ClassInterfaces = {};

    const uniqueClasses = Array.from(
      new Set(
        symbols.filter(s => s.containerName !== "").map(s => s.containerName)
      )
    );
    log("unique classes:");
    log(uniqueClasses);
    for (let className of uniqueClasses) {
      const classSymbol = symbols.find(s => s.name === className);
      if (!classSymbol) {
        return;
      }
      const baseClassSymbol = await getBaseClassSymbol(
        document,
        classSymbol,
        symbols
      );
      classInterfaces[className] = await getInterfaceSymbols(
        document,
        classSymbol,
        symbols
      );

      if (baseClassSymbol) {
        classParent[className] = baseClassSymbol;
      }
    }
    log("class parent:");
    log(classParent);
    log("class interfaces:");
    log(classInterfaces);

    let decorations: DecorationOptionsForParents = {
      class: [],
      interface: []
    };
    let classNames = Object.keys(classInterfaces);
    for (let className of classNames) {
      for (let symbol of classInterfaces[className]) {
        decorations = mergeDecorations([
          decorations,
          await getDecorationByParent(
            symbol,
            document.uri,
            symbols,
            className,
            SymbolKind.Interface
          )
        ]);
      }
    }
    classNames = Object.keys(classParent);
    for (let className of classNames) {
      if (classParent[className]) {
        decorations = mergeDecorations([
          decorations,
          await getDecorationByParent(
            classParent[className],
            document.uri,
            symbols,
            className,
            SymbolKind.Class
          )
        ]);
      }
    }
    log("complete, decorations:");
    log(decorations);
    decorateEditor(decorations, activeEditor);
  } catch (error) {
    throw error;
  }
}

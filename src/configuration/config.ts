import { workspace, window } from "vscode";
import { ClassIOCache } from "../models";
/**
 * Configuration storage class.
 */
export class Config {
  static overrideSymbol = workspace
    .getConfiguration("classio")
    .get<string>("overrideSymbol");
  static overrideSymbolColor = workspace
    .getConfiguration("classio")
    .get<string>("overrideSymbolColor");
  static implementationSymbol = workspace
    .getConfiguration("classio")
    .get<string>("implementationSymbol");
  static implementationSymbolColor = workspace
    .getConfiguration("classio")
    .get<string>("implementationSymbolColor");
  static isDebug = workspace
    .getConfiguration("classio")
    .get<boolean>("debugMode");
  static overrideDecorationType = window.createTextEditorDecorationType({
    // color: "#10ADBA",
    before: {
      contentText: Config.overrideSymbol,
      color: Config.overrideSymbolColor
    }
  });

  static interfaceDecorationType = window.createTextEditorDecorationType({
    before: {
      contentText: Config.implementationSymbol,
      color: Config.implementationSymbolColor
    }
  });

  static classIOCache: ClassIOCache[] = [];

  static timer: NodeJS.Timer;
}
/**
 * Will be called when vscode configuration is changed, to refresh ClassIO config.
 */
export const updateConfig = () => {
  Config.overrideSymbol = workspace
    .getConfiguration("classio")
    .get<string>("overrideSymbol");
  Config.overrideSymbolColor = workspace
    .getConfiguration("classio")
    .get<string>("overrideSymbolColor");
  Config.implementationSymbol = workspace
    .getConfiguration("classio")
    .get<string>("implementationSymbol");
  Config.implementationSymbolColor = workspace
    .getConfiguration("classio")
    .get<string>("implementationSymbolColor");
  Config.isDebug = workspace
    .getConfiguration("classio")
    .get<boolean>("debugMode");
  Config.overrideDecorationType = window.createTextEditorDecorationType({
    // color: "#10ADBA",
    before: {
      contentText: Config.overrideSymbol,
      color: Config.overrideSymbolColor
    }
  });

  Config.interfaceDecorationType = window.createTextEditorDecorationType({
    before: {
      contentText: Config.implementationSymbol,
      color: Config.implementationSymbolColor
    }
  });
};

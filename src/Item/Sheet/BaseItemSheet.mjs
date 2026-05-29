import * as system from "../../_helpers.mjs";


export class BaseItemSheet extends system.Base.BaseSheet(
  foundry.applications.sheets.ItemSheetV2
) {

  static DEFAULT_OPTIONS = {
    classes: [""],
    position: {
      width: 770,
      height: 550,
    },
  }
  
}
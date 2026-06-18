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
 
    async _onDrop(event) {
    const data = foundry.applications.ux.TextEditor.implementation.getDragEventData(event);

    switch(data.type)
    {
      case "Item": 
        const item = fromUuidSync(data.uuid);
        
        if(item.type == "effetContainer") {
          let effets = [];
          item.effects.forEach(e => effets.push(e.clone()));
          this.document.createEmbeddedDocuments("ActiveEffect", effets);
        }
        else {
          ui.notifications.error("impossible de glisser ca ici")
        }
    }
  }

}
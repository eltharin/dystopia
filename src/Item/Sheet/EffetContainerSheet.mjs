import * as system  from "../../_helpers.mjs";

import { BaseItemSheet } from "./BaseItemSheet.mjs";

export class EffetContainerSheet extends BaseItemSheet {
  
  static EffetTypes = ["effetPorte", "effetApplique", "effetConsomme"];
  
  static PARTS = {
    form: { 
      template: system.Consts.TEMPLATES_PATH + "/item/baseTemplate.hbs",
    },
    effets: {
      template: system.Consts.TEMPLATES_PATH + "/item/common/effets.hbs",
      container: { id: "form" , element: ".tabscontainer" },
    },
    notes: {
      template: system.Consts.TEMPLATES_PATH + "/item/common/notes.hbs",
      container: { id: "form" , element: ".tabscontainer" },
    }
  };

  static TABS = {
    sheet: {
      tabs: [
        { id: "effets", label: system.Consts.SYSTEMID + ".sheet.common.effets.titre"},
        { id: "notes", label: system.Consts.SYSTEMID + ".sheet.common.notes.titre"},
      ],
      initial: "main",
    }
  };


  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    position: {
      width: 790,
      height: 360,
    },
    actions: {
      ...super.DEFAULT_OPTIONS.actions,
      addEffect: system.EffetManager._onAddEffect,
      editEffect: system.EffetManager._onEditEffect,
      deleteEffect: system.EffetManager._onDeleteEffect,
    },
  }

  async _prepareContext(options) {
    
    const context = await super._prepareContext(options);

    context.effets = this.document.effects;

    return context
  }

  /*_prepareSubmitData(event, form, formData, updateData) { 

    let data  = super._prepareSubmitData(event, form, formData, updateData);
    const submitData = foundry.utils.expandObject(formData.object);

    foundry.utils.setProperty(data, "system.prixmoyen", system.Common.Argent.convertBtoA(submitData.system.prix));

    return data ; 
  }*/

  
}
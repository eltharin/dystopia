import * as system  from "../../_helpers.mjs";

import { BaseItemSheet } from "./BaseItemSheet.mjs";

export class ArmureSheet extends BaseItemSheet {
  static PARTS = {
    form: { 
      template: system.Consts.TEMPLATES_PATH + "/item/baseTemplate.hbs",
    },
    main: {
      template: system.Consts.TEMPLATES_PATH + "/item/armure.hbs",
      container: { id: "form" , element: ".tabscontainer" },
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
        { id: "main", label: system.Consts.SYSTEMID + ".sheet.items.armure.nav.main"},
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
      addEffect: this._onAddEffect,
      editEffect: this._onEditEffect,
      deleteEffect: this._onDeleteEffect,
    },
  }

  async _prepareContext(options) {
    
    const context = await super._prepareContext(options)

    context.effets = this.document.effects;

    return context
  }

  /*_prepareSubmitData(event, form, formData, updateData) { 

    let data  = super._prepareSubmitData(event, form, formData, updateData);
    const submitData = foundry.utils.expandObject(formData.object);

    foundry.utils.setProperty(data, "system.prixmoyen", system.Common.Argent.convertBtoA(submitData.system.prix));

    return data ; 
  }*/
  


  static async _onAddEffect(event, target){
    const effects = await this.document.createEmbeddedDocuments("ActiveEffect", [{name: "Nouvel effet"}]);
    
    new ActiveEffectConfig(effects[0]).render(true);
  }

  static async _onEditEffect(event, target){
    const effect = this.document.effects.get(target.dataset.effectid);
    new ActiveEffectConfig(effect).render(true);
    }
    
    
  static async _onDeleteEffect(event, target){
    const effect = this.document.effects.get(target.dataset.effectid);
    await effect.delete();
  }
  
}
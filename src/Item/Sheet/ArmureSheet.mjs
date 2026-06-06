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
    notes: {
      template: system.Consts.TEMPLATES_PATH + "/item/common/notes.hbs",
      container: { id: "form" , element: ".tabscontainer" },
    }
  };

  static TABS = {
    sheet: {
      tabs: [
        { id: "main", label: system.Consts.SYSTEMID + ".sheet.items.armure.nav.main"},
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
  }

  /*_prepareSubmitData(event, form, formData, updateData) { 

    let data  = super._prepareSubmitData(event, form, formData, updateData);
    const submitData = foundry.utils.expandObject(formData.object);

    foundry.utils.setProperty(data, "system.prixmoyen", system.Common.Argent.convertBtoA(submitData.system.prix));

    return data ; 
  }*/
  
}
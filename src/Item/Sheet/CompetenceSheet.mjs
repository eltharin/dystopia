import * as system  from "../../_helpers.mjs";

import { BaseItemSheet } from "./BaseItemSheet.mjs";

export class CompetenceSheet extends BaseItemSheet {
  static PARTS = {
    form: { 
      template: system.Consts.TEMPLATES_PATH + "/item/baseTemplate.hbs",
    },
    main: {
      template: system.Consts.TEMPLATES_PATH + "/item/competence.hbs",
      container: { id: "form" , element: ".tabscontainer" },
    }
  };

  static TABS = {
    sheet: {
      tabs: [
        { id: "main", label: system.Consts.SYSTEMID + ".sheet.items.competence.nav.main"},
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
/*
  _prepareSubmitData(event, form, formData, updateData) { 

    let data  = super._prepareSubmitData(event, form, formData, updateData);
    const submitData = foundry.utils.expandObject(formData.object);

    foundry.utils.setProperty(data, "system.prixmoyen", system.Common.Argent.convertBtoA(submitData.system.prix));

    return data ; 
  }*/
  
}
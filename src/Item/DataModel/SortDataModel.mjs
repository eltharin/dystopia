import * as system from "../../_helpers.mjs";



export class SortDataModel extends system.Base.SystemDataModel {

  static DEFAULT_ICON = system.Consts.ASSETS_PATH + "/pics/sort.svg";



  static defineSchema() {
    return {
      //prixmoyen: new foundry.data.fields.NumberField({initial: 0, min:0}),
      notes: new foundry.data.fields.StringField({}),
    };
  }

  prepareDerivedData() {
      //this.prix = system.Common.Argent.convertAtoB(this.prixmoyen);
  }
}
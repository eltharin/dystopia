import * as system from "../../_helpers.mjs";



export class SortDataModel extends system.Base.SystemDataModel {

  static DEFAULT_ICON = system.Consts.ASSETS_PATH + "/pics/sort.svg";



  static defineSchema() {
    return {
      //prixmoyen: new foundry.data.fields.NumberField({initial: 0, min:0}),
      notes: new foundry.data.fields.StringField({}),
      coutUtilisation: new foundry.data.fields.NumberField({initial: 1, min:0}),
      degats: new foundry.data.fields.SchemaField({
        physique: new foundry.data.fields.NumberField({min: 0, initial: 1}),
        magique: new foundry.data.fields.NumberField({min: 0, initial: 1}),
      }),
    };
  }

  prepareDerivedData() {
      //this.prix = system.Common.Argent.convertAtoB(this.prixmoyen);
  }
}
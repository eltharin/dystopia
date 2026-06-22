import * as system from "../../_helpers.mjs";



export class TraitDataModel extends system.Base.SystemDataModel {

  static DEFAULT_ICON = system.Consts.ASSETS_PATH + "/pics/trait.svg";

  static defineSchema() {
    return {
      valeur : new foundry.data.fields.NumberField({initial: 0}),
      carac : new foundry.data.fields.StringField({}),
      notes: new foundry.data.fields.StringField({}),
    };
  }

  prepareDerivedData() {
      //this.prix = system.Common.Argent.convertAtoB(this.prixmoyen);
  }
}
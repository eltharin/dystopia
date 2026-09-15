import * as system from "../../_helpers.mjs";



export class ObjetDataModel extends system.Base.SystemDataModel {


  static defineSchema() {
    return {
      prix: new foundry.data.fields.NumberField({initial: 0, min:0}),
      notes: new foundry.data.fields.StringField({}),
      isConsommable: new foundry.data.fields.BooleanField({initial: false}),
    };
  }

  prepareDerivedData() {
      //this.prix = system.Common.Argent.convertAtoB(this.prixmoyen);
  }
}
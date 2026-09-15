import * as system from "../../_helpers.mjs";



export class ArmeDataModel extends system.Base.SystemDataModel {

  static DEFAULT_ICON = system.Consts.ASSETS_PATH + "/pics/arme.svg";



  static defineSchema() {
    return {
      prix: new foundry.data.fields.NumberField({initial: 0, min:0}),
      notes: new foundry.data.fields.StringField({}),

      coutUtilisation: new foundry.data.fields.SchemaField({
        pe: new foundry.data.fields.NumberField({initial: 0, min:0}),
        pm: new foundry.data.fields.NumberField({initial: 0, min:0}),
      }),

      degats: new foundry.data.fields.SchemaField({
          physique: new foundry.data.fields.NumberField({min: 0, initial: 0}),
          magique: new foundry.data.fields.NumberField({min: 0, initial: 0}),
      }),
    };
  }

  prepareDerivedData() {
      //this.prix = system.Common.Argent.convertAtoB(this.prixmoyen);
  }
}
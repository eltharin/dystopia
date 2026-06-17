import * as system from "../../_helpers.mjs";



export class EffetContainerDataModel extends system.Base.SystemDataModel {

  static DEFAULT_ICON = system.Consts.ASSETS_PATH + "/pics/armure.svg";

  static defineSchema() {
    return {
      notes: new foundry.data.fields.StringField({}),
    };
  }

}
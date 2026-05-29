import * as system from "../../_helpers.mjs";


export class BaseActorDataModel extends system.Base.SystemDataModel {
    static defineSchema() {
    // All Actors have resources.
        return { 
            isLocked: new foundry.data.fields.BooleanField({initial: false}),
            notes: new foundry.data.fields.StringField({}),
        };
    }

    static preSaveFunctions = [

    ];

    prepareDerivedData() {

        this._prepareDerivedData();
    }

    _prepareDerivedData() {

    }
}
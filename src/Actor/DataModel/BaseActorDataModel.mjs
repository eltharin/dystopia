import * as system from "../../_helpers.mjs";


export class BaseActorDataModel extends system.Base.SystemDataModel {
    static defineSchema() {
    // All Actors have resources.
        return { 
            isLocked: new foundry.data.fields.BooleanField({initial: false}),
            notes: new foundry.data.fields.StringField({}),
            photo: new foundry.data.fields.StringField({}),
            historique: new foundry.data.fields.StringField({}),
            alignement: new foundry.data.fields.StringField({}),
            niveau: new foundry.data.fields.NumberField({min:1, initial: 1}),
            
            values: new foundry.data.fields.SchemaField({
                pv: new foundry.data.fields.SchemaField({
                    val: new foundry.data.fields.NumberField({min: 1, initial: 1}),
                    max: new foundry.data.fields.NumberField({min: 1, initial: 1}),
                    temp: new foundry.data.fields.NumberField({min: 0, initial: 0}),
                    tempMax: new foundry.data.fields.NumberField({min: 0, initial: 0}),
                }),
                
                pe: new foundry.data.fields.SchemaField({
                    val: new foundry.data.fields.NumberField({min: 1, initial: 1}),
                    max: new foundry.data.fields.NumberField({min: 1, initial: 1}),
                    temp: new foundry.data.fields.NumberField({min: 0, initial: 0}),
                    tempMax: new foundry.data.fields.NumberField({min: 0, initial: 0}),
                }),
                
                pm: new foundry.data.fields.SchemaField({
                    val: new foundry.data.fields.NumberField({min: 1, initial: 1}),
                    max: new foundry.data.fields.NumberField({min: 1, initial: 1}),
                    temp: new foundry.data.fields.NumberField({min: 0, initial: 0}),
                    tempMax: new foundry.data.fields.NumberField({min: 0, initial: 0}),
                }),
                
                sm: new foundry.data.fields.SchemaField({
                    val: new foundry.data.fields.NumberField({min: 1, initial: 1}),
                    max: new foundry.data.fields.NumberField({min: 1, initial: 1}),
                    temp: new foundry.data.fields.NumberField({min: 0, initial: 0}),
                    tempMax: new foundry.data.fields.NumberField({min: 0, initial: 0}),
                }),
                
                volonte: new foundry.data.fields.SchemaField({
                    val: new foundry.data.fields.NumberField({min: 1, initial: 1}),
                    max: new foundry.data.fields.NumberField({min: 1, initial: 1}),
                    temp: new foundry.data.fields.NumberField({min: 0, initial: 0}),
                    tempMax: new foundry.data.fields.NumberField({min: 0, initial: 0}),
                }),
                
            }),

            traumas: new foundry.data.fields.ArrayField(
                new foundry.data.fields.SchemaField({
                    niveau: new foundry.data.fields.NumberField({initial: 1}),
                    libelle : new foundry.data.fields.StringField({}),
                }),
            ),

            attributs: new foundry.data.fields.ArrayField(
                new foundry.data.fields.SchemaField({
                    libelle : new foundry.data.fields.StringField({}),
                    carac : new foundry.data.fields.StringField({}),
                    val: new foundry.data.fields.NumberField({initial: 0}),
                }),
            ),

            degat: new foundry.data.fields.NumberField({initial: 0}),
            armure: new foundry.data.fields.NumberField({initial: 0}),
            soin: new foundry.data.fields.NumberField({initial: 0}),

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
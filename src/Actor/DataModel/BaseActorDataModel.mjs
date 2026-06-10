import * as system from "../../_helpers.mjs";


export class BaseActorDataModel extends system.Base.SystemDataModel {
    static defineSchema() {
    // All Actors have resources.
        return { 
            isLocked: new foundry.data.fields.BooleanField({initial: false}),
            notes: new foundry.data.fields.StringField({}),
            values: new foundry.data.fields.SchemaField({
                pv: new foundry.data.fields.SchemaField({
                    val: new foundry.data.fields.NumberField({min: 0, initial: 1}),
                    max: new foundry.data.fields.NumberField({min: 0, initial: 1}),
                    temp: new foundry.data.fields.NumberField({min: 0, initial: 0}),
                    tempMax: new foundry.data.fields.NumberField({min: 0, initial: 0}),
                }),
                
                pe: new foundry.data.fields.SchemaField({
                    val: new foundry.data.fields.NumberField({min: 0, initial: 1}),
                    max: new foundry.data.fields.NumberField({min: 0, initial: 1}),
                    temp: new foundry.data.fields.NumberField({min: 0, initial: 0}),
                    tempMax: new foundry.data.fields.NumberField({min: 0, initial: 0}),
                }),
                
                pm: new foundry.data.fields.SchemaField({
                    val: new foundry.data.fields.NumberField({min: 0, initial: 1}),
                    max: new foundry.data.fields.NumberField({min: 0, initial: 1}),
                    temp: new foundry.data.fields.NumberField({min: 0, initial: 0}),
                    tempMax: new foundry.data.fields.NumberField({min: 0, initial: 0}),
                }),
                
                sm: new foundry.data.fields.SchemaField({
                    val: new foundry.data.fields.NumberField({min: 0, initial: 1}),
                    max: new foundry.data.fields.NumberField({min: 0, initial: 1}),
                    temp: new foundry.data.fields.NumberField({min: 0, initial: 0}),
                    tempMax: new foundry.data.fields.NumberField({min: 0, initial: 0}),
                }),
                
                volonte: new foundry.data.fields.SchemaField({
                    val: new foundry.data.fields.NumberField({min: 0, initial: 1}),
                    max: new foundry.data.fields.NumberField({min: 0, initial: 1}),
                    temp: new foundry.data.fields.NumberField({min: 0, initial: 0}),
                    tempMax: new foundry.data.fields.NumberField({min: 0, initial: 0}),
                }),
                
            }),
            //degat: new foundry.data.fields.NumberField({initial: 0}),
            seuilCritique: new foundry.data.fields.SchemaField({
                val: new foundry.data.fields.NumberField({min: 0, initial: 20}),
                temp: new foundry.data.fields.NumberField({min: 0, initial: 0}),
            }),
            seuilDefense: new foundry.data.fields.NumberField({initial: 0}),
            
            coutDeplacement: new foundry.data.fields.SchemaField({
                val:  new foundry.data.fields.NumberField({initial: 3}),
                temp:  new foundry.data.fields.NumberField({initial: 0}),
            }),

            nbActionParTour: new foundry.data.fields.NumberField({initial: 2}),

            historique: new foundry.data.fields.StringField({}),
            alignement: new foundry.data.fields.StringField({}),
            niveau: new foundry.data.fields.NumberField({min:1, initial: 1}),
        };
    }

    static preSaveFunctions = [
        ...super.preSaveFunctions,

    ];

    
    prepareDerivedData() {
        
        this.seuilCritique.total = this.seuilCritique.val - this.seuilCritique.temp;


        this._prepareDerivedData();
    }

    _prepareDerivedData() {

    }

}
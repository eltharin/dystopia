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
                temp: new foundry.data.fields.NumberField({ initial: 0}),
            }),
            seuilDefense: new foundry.data.fields.NumberField({initial: 0}),
            
            coutDeplacement: new foundry.data.fields.SchemaField({
                val:  new foundry.data.fields.NumberField({initial: 3}),
                temp:  new foundry.data.fields.NumberField({initial: 0}),
            }),

            nbActionParTour: new foundry.data.fields.NumberField({initial: 2}),
            initiative: new foundry.data.fields.NumberField({initial: 0}),

            historique: new foundry.data.fields.StringField({}),
            alignement: new foundry.data.fields.StringField({}),
            niveau: new foundry.data.fields.NumberField({min:1, initial: 1}),
        };
    }

    static preSaveFunctions = [
        ...super.preSaveFunctions,
        "checkMaxValues"
    ];

    
    prepareDerivedData() {
        
        this.seuilCritique.total = this.seuilCritique.val - this.seuilCritique.temp;


        this._prepareDerivedData();
    }

    _prepareDerivedData() {

    }

    checkMaxValues(changes, clone){
        if(foundry.utils.getProperty(clone, "values.pv.val") > foundry.utils.getProperty(clone, "values.pv.max")) {
            foundry.utils.setProperty(changes, "system.values.pv.val", foundry.utils.getProperty(clone, "values.pv.max"));
        }
        if(foundry.utils.getProperty(clone, "values.pe.val") > foundry.utils.getProperty(clone, "values.pe.max")) {
            foundry.utils.setProperty(changes, "system.values.pe.val", foundry.utils.getProperty(clone, "values.pe.max"));
        }
        if(foundry.utils.getProperty(clone, "values.pm.val") > foundry.utils.getProperty(clone, "values.pm.max")) {
            foundry.utils.setProperty(changes, "system.values.pm.val", foundry.utils.getProperty(clone, "values.pm.max"));
        }
        if(foundry.utils.getProperty(clone, "values.sm.val") > foundry.utils.getProperty(clone, "values.sm.max")) {
            foundry.utils.setProperty(changes, "system.values.sm.val", foundry.utils.getProperty(clone, "values.sm.max"));
        }
        if(foundry.utils.getProperty(clone, "values.volonte.val") > foundry.utils.getProperty(clone, "values.volonte.max")) {
            foundry.utils.setProperty(changes, "system.values.volonte.val", foundry.utils.getProperty(clone, "values.volonte.max"));
        }
    }
}
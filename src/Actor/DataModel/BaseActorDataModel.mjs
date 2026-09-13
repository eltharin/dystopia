import * as system from "../../_helpers.mjs";


export class BaseActorDataModel extends system.Base.SystemDataModel {
    static defineSchema() {
    // All Actors have resources.
        return { 
            isLocked: new foundry.data.fields.BooleanField({initial: false}),
            notes: new foundry.data.fields.StringField({}),
            niveau: new foundry.data.fields.NumberField({min:1, initial: 1}),
            



            values: new foundry.data.fields.SchemaField({
                pv: new foundry.data.fields.SchemaField({
                    val: new foundry.data.fields.NumberField({min: 0, initial: 1}),
                    max: new foundry.data.fields.NumberField({min: 0, initial: 1}),
                    temp: new foundry.data.fields.NumberField({initial: 0}),
                    tempMax: new foundry.data.fields.NumberField({initial: 0}),
                }),
                
                pe: new foundry.data.fields.SchemaField({
                    val: new foundry.data.fields.NumberField({min: 0, initial: 1}),
                    max: new foundry.data.fields.NumberField({min: 0, initial: 1}),
                    temp: new foundry.data.fields.NumberField({initial: 0}),
                    tempMax: new foundry.data.fields.NumberField({initial: 0}),
                }),
                
                pm: new foundry.data.fields.SchemaField({
                    val: new foundry.data.fields.NumberField({min: 0, initial: 1}),
                    max: new foundry.data.fields.NumberField({min: 0, initial: 1}),
                    temp: new foundry.data.fields.NumberField({initial: 0}),
                    tempMax: new foundry.data.fields.NumberField({initial: 0}),
                }),
                
                sm: new foundry.data.fields.SchemaField({
                    val: new foundry.data.fields.NumberField({min: 0, initial: 1}),
                    max: new foundry.data.fields.NumberField({min: 0, initial: 1}),
                    temp: new foundry.data.fields.NumberField({initial: 0}),
                    tempMax: new foundry.data.fields.NumberField({initial: 0}),
                }),
                
                volonte: new foundry.data.fields.SchemaField({
                    val: new foundry.data.fields.NumberField({min: 0, initial: 1}),
                    max: new foundry.data.fields.NumberField({min: 0, initial: 1}),
                    temp: new foundry.data.fields.NumberField({initial: 0}),
                    tempMax: new foundry.data.fields.NumberField({initial: 0}),
                }),
                
                reaction: new foundry.data.fields.SchemaField({
                    val: new foundry.data.fields.NumberField({min: 0, initial: 10}),
                    temp: new foundry.data.fields.NumberField({ initial: 0}),
                }),
                
                coutUtilReaction: new foundry.data.fields.SchemaField({
                    val: new foundry.data.fields.NumberField({min: 0, initial: 2}),
                    temp: new foundry.data.fields.NumberField({ initial: 0}),
                }),

                coutPeEsquive: new foundry.data.fields.SchemaField({
                    val: new foundry.data.fields.NumberField({min: 0, initial: 2}),
                    temp: new foundry.data.fields.NumberField({ initial: 0}),
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
            
            

            malus: new foundry.data.fields.SchemaField({
                armure:  new foundry.data.fields.SchemaField({
                    physique: new foundry.data.fields.NumberField({initial: 0}),
                    magique: new foundry.data.fields.NumberField({initial: 0}),
                }),
                pvmax:  new foundry.data.fields.SchemaField({
                    val: new foundry.data.fields.NumberField({initial: 0}),
                }),
            }),
        };
    }

    static preSaveFunctions = [
        ...super.preSaveFunctions,
        "checkMaxValues"
    ];

    
    prepareDerivedData() {
        
        this.seuilCritique.total = this.seuilCritique.val - this.seuilCritique.temp;

        Object.keys(this.values).forEach((k) => {
            this.values[k].total = this.values[k].val + this.values[k].temp;
            if("max" in this.values[k])
            {
                this.values[k].totalMax = this.values[k].max + this.values[k].tempMax;
            }
        });

        this._prepareDerivedData();
    }

    _prepareDerivedData() {

    }

    checkMaxValues(changes, clone){

        Object.keys(this.values).forEach((k) => {
            if("max" in this.values[k])
                {
                if(foundry.utils.getProperty(clone, "values." + k + ".val") > (foundry.utils.getProperty(clone, "values." + k + ".max") + foundry.utils.getProperty(clone, "values." + k + ".tempMax"))) {
                    foundry.utils.setProperty(changes, "system.values." + k + ".val", foundry.utils.getProperty(clone, "values." + k + ".max") + foundry.utils.getProperty(clone, "values." + k + ".tempMax"));
                }

                if(foundry.utils.getProperty(clone, "values." + k + ".val") + foundry.utils.getProperty(clone, "values." + k + ".temp") > (foundry.utils.getProperty(clone, "values." + k + ".max") + foundry.utils.getProperty(clone, "values." + k + ".tempMax"))) {
                    foundry.utils.setProperty(changes, "system.values." + k + ".temp", Math.max(0, foundry.utils.getProperty(clone, "values." + k + ".max") + foundry.utils.getProperty(clone, "values." + k + ".tempMax") - foundry.utils.getProperty(clone, "values." + k + ".val")));
                    foundry.utils.setProperty(changes, "system.values." + k + ".val", Math.max(0, foundry.utils.getProperty(clone, "values." + k + ".max") + foundry.utils.getProperty(clone, "values." + k + ".tempMax") - foundry.utils.getProperty(changes, "system.values." + k + ".temp")));
                }
            }
        });


    }
}
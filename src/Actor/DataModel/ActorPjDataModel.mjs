import * as system from "../../_helpers.mjs";

export class ActorPjDataModel extends system.Actor.BaseActorDataModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),
            
            historique: new foundry.data.fields.StringField({}),
            alignement: new foundry.data.fields.StringField({}),
            niveau: new foundry.data.fields.NumberField({min:1, initial: 1}),
            
            

            traumas: new foundry.data.fields.SchemaField({
                nbNiveaux: new foundry.data.fields.NumberField({initial: 3}),
                niveaux: new foundry.data.fields.ArrayField(
                    new foundry.data.fields.SchemaField({
                        libelle : new foundry.data.fields.StringField({}),
                        nbTraumas : new foundry.data.fields.NumberField({initial: -1}),
                        traumas: new foundry.data.fields.ArrayField(
                            new foundry.data.fields.StringField({}),
                        ),
                    })
                ),
            }),

            attributs: new foundry.data.fields.ArrayField(
                new foundry.data.fields.SchemaField({
                    libelle : new foundry.data.fields.StringField({}),
                    carac : new foundry.data.fields.StringField({}),
                    val: new foundry.data.fields.NumberField({initial: 0}),
                }),
            ),
            
            soin: new foundry.data.fields.NumberField({initial: 0}),
        };
    }

    static preSaveFunctions = [
        ...super.preSaveFunctions,
    ];

    _prepareDerivedData() {

        for(let i=0 ; i<this.traumas.nbNiveaux ; i++)
        {
            if(!this.traumas.niveaux[i] || this.traumas.niveaux[i].nbTraumas === -1) {


                this.traumas.niveaux[i] = {
                    libelle: "",
                    nbTraumas: i == 2 ? 2 : 3,
                    traumas: [],
                };
            }
        }
    }    

    async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);
        this.parent.prototypeToken.updateSource({actorLink: true, "sight.enabled": true});
    }

}
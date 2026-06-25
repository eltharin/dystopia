
import * as system  from "../../_helpers.mjs";

export class AttaqueRoll extends system.DiceRoller.BaseRoll{
    static CHAT_TEMPLATE = system.Consts.TEMPLATES_PATH + "/dice/attaque/roll-result.hbs";

    constructor(formula="", data={}, options={}) {
        if(!("seuilCritique" in options.actor)) {
            const actor = fromUuidSync(options.actor.uuid);
            options.actor.seuilCritique = actor.system.seuilCritique.val - actor.system.seuilCritique.temp;
        }

        super(formula, data, options);

    }

    async _prepareChatRenderContext({flavor, isPrivate=false, ...options}={}) {
        let ret = await super._prepareChatRenderContext({flavor, isPrivate, ...options});

        ret.critique = this.isCritique();  
        ret.seuilCritique = this.options.actor.seuilCritique;  
        ret.item = this.options.item;  
        ret.cibles = this.options.cibles.map(c => {
            return {
                uuid: c.uuid,
                name: c.name,
                seuil: c.seuil,
                degats: this.calculDegats(c),
                armure: c.armure
            };
        });

        return ret;
    }

    isCritique() {
        return this.total > (this.options.actor.seuilCritique || 50);
    }

    calculDegats(cible) {
        let armurePhysique = cible.armure.physique;
        let armureMagique = cible.armure.magique;
        let armureMixte = cible.armure.mixte;

        let malusPhysique = cible.armure.malusPhysique;
        let malusMagique = cible.armure.malusMagique;
        let malusMixte = 0;

        if(malusPhysique > armurePhysique) {
            malusMixte += malusPhysique - armurePhysique
            malusPhysique = armurePhysique;
        }

        if(malusMagique > armureMagique) {
            malusMixte += malusMagique - armureMagique
            malusMagique = armureMagique;
        }

        const degatsPhysiques = (this.options.item.system.degats.physique * (this.isCritique() ? 2 : 1)) - Math.max(0, armurePhysique - malusPhysique);
        const degatsMagiques = (this.options.item.system.degats.magique * (this.isCritique() ? 2 : 1)) - Math.max(0, armureMagique - malusMagique);
        const degatsMixtes = Math.round(0.99* (this.total - cible.seuil)/2) - Math.max(0, armureMixte - malusMixte);
        
        return this.formuleDegats(degatsPhysiques, degatsMagiques, degatsMixtes)
    }

    formuleDegats(degatsPhysiques, degatsMagiques, degatsMixtes) {
        let totalDegatsPhysiques = degatsPhysiques;
        let totalDegatsMagiques = degatsMagiques;
        let totalDegatsMixtes = degatsMixtes;

        if( totalDegatsPhysiques < 0) {
            totalDegatsMixtes = Math.max(Math.min(0, totalDegatsMixtes), totalDegatsMixtes + totalDegatsPhysiques);
            totalDegatsPhysiques = 0;
        }

        if( totalDegatsMagiques < 0) {
            totalDegatsMixtes = Math.max(Math.min(0, totalDegatsMixtes), totalDegatsMixtes + totalDegatsMagiques);
            totalDegatsMagiques = 0;
        }

        return Math.max(0, totalDegatsPhysiques + totalDegatsMagiques + totalDegatsMixtes);
    }

    getSeuil() {
        return (this.options?.modificateurs?.seuil || 0);
    }
}
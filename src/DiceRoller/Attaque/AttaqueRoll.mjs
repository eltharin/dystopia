
import * as system  from "../../_helpers.mjs";

export class AttaqueRoll extends system.DiceRoller.BaseRoll{
    static CHAT_TEMPLATE = system.Consts.TEMPLATES_PATH + "/dice/attaque/roll-result.hbs";

    constructor(formula="", data={}, options={}) {
        /*if(options.modificateurs?.nbDeBonus != 0) {
            formula = (2 + options.modificateurs.nbDeBonus) + "d10kh2";
        }
        */
        super(formula, data, options);
    }

    async _prepareChatRenderContext({flavor, isPrivate=false, ...options}={}) {
        let ret = await super._prepareChatRenderContext({flavor, isPrivate, ...options});

        ret.critique = this.isCritique();  
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
        return this.total > (this.options.seuilCritique || 50);
    }

    calculDegats(cible) {
        const degatsPhysiques = (this.options.item.system.degats.physique * (this.isCritique() ? 2 : 1)) - cible.armure.physique;
        const degatsMagiques = (this.options.item.system.degats.magique * (this.isCritique() ? 2 : 1)) - cible.armure.magique;
        const degatsMixtes = this.total - cible.seuil - cible.armure.mixte;

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
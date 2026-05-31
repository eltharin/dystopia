
import * as system  from "../../_helpers.mjs";

export class GlobalRoll extends system.DiceRoller.BaseRoll{
    static CHAT_TEMPLATE = system.Consts.TEMPLATES_PATH + "/dice/roll-result.hbs";

    constructor(formula="", data={}, options={}) {
        if(options.modificateurs?.nbDeBonus != 0) {
            formula = (2 + options.modificateurs.nbDeBonus) + "d10kh2";
        }

        super(formula, data, options);
        
        
    }

    async _prepareChatRenderContext({flavor, isPrivate=false, ...options}={}) {
        let ret = await super._prepareChatRenderContext({flavor, isPrivate, ...options});

        ret.seuil = this.options.modificateurs?.seuil > 0 ? game.i18n.format(system.Consts.SYSTEMID + ".roll.common.seuil", {seuil: this.options.modificateurs?.seuil}) : "Jet de dé";
        ret.bonus = game.i18n.format(system.Consts.SYSTEMID + ".roll.common.bonus", {bonus: this.options.modificateurs?.bonus});
        
        ret.critique = "seuil critique : " + (this.options.seuilCritique || 50);    

        ret.result = game.i18n.format(this.getResult());
        //ret.totalText = this.getTotalText();
        //ret.totalValue = this.getTotalValue();
        //ret.seuil = this.getSeuil();

        return ret;
    }
/*
    isCompetenceMagie()
    {
        return this.options.competence == "magie";
    }

    getActor()
    {
        return this.options.actorMagie;
    }
*/
    getResult()
    {
        return (this.total >= this.getSeuil() ? "reussite" : "echec") + (this.total > (this.options.seuilCritique || 50) ? "(coup critique)" : "");
    }
/*
    getTotalParts()
    {
        return [
            this.options?.actorCompetence?.value,
            this.options?.modificateurs?.modificateur,

        ]
    }
*/
    getSeuil() {
        return (this.options?.modificateurs?.seuil || 0);
    }
}
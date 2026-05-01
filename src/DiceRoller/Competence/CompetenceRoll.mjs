
import * as system  from "../../_helpers.mjs";

export class CompetenceRoll extends system.DiceRoller.BaseRoll{
    static CHAT_TEMPLATE = system.Consts.SYSTEMTEMPLATE + "/dice/roll-result.hbs";

    constructor(formula="", data={}, options={}) {
        super(formula, data, options);
        
        if(this.options.actorMagie == undefined) {
            this.options.actorMagie = {
                actor : this.options.actor.obj,
                actorUuid: this.options.actor.obj.uuid,
                isDissonnance : this.options.actor.obj.system.magie.isDissonnance,
                isSurchauffe : this.options.actor.obj.system.magie.isSurchauffe,
            }
            
        }
    }

    async _prepareChatRenderContext({flavor, isPrivate=false, ...options}={}) {
        let ret = await super._prepareChatRenderContext({flavor, isPrivate, ...options});
        ret.title = game.i18n.format(system.Consts.SYSTEMID + ".roll.title.carac", {carac: this.options.competence});

        ret.actions = null;
        return ret;
    }

    isCompetenceMagie()
    {
        return this.options.competence == "magie";
    }

    getActor()
    {
        return this.options.actorMagie;
    }

    getResult()
    {
        const resValue = this.getTotalValue() - this.getSeuil();

        if(resValue >= 3) return "reussiteExceptionnelle";
        else if(resValue > 0) return "reussite";
        else if(resValue == 0) return "reussiteJustesse";
        else if(resValue >= -2) return "echec";
        else return "echecCritique";
    }

    getTotalParts()
    {
        return [
            this.options?.actorCompetence?.value,
            this.options?.modificateurs?.modificateur,

        ]
    }

    getSeuil() {
        return (this.options?.modificateurs?.difficulte || 0);
    }
}
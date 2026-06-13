
import * as system  from "../../_helpers.mjs";

export class EsquiveRoll extends system.DiceRoller.BaseRoll{
    static CHAT_TEMPLATE = system.Consts.TEMPLATES_PATH + "/dice/esquive/roll-result.hbs";

    constructor(formula="", data={}, options={}) {
        
        super(formula, data, options);
        
    }

    async _prepareChatRenderContext({flavor, isPrivate=false, ...options}={}) {
        let ret = await super._prepareChatRenderContext({flavor, isPrivate, ...options});

        ret.actor = this.options.actor.name;
        ret.reaction = this.options.reaction;
        
        ret.result = this.getResult();

        return ret;
    }


    getResult()
    {
        return this.total >= this.options.reaction;            
    }

}
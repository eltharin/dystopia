
import * as system  from "../../_helpers.mjs";

export class DegatEffetsRoll extends system.DiceRoller.BaseRoll{
    static CHAT_TEMPLATE = system.Consts.TEMPLATES_PATH + "/dice/degateffets/roll-result.hbs";

    constructor(formula="", data={}, options={}) {
        
        super(formula, data, options);
        if(this.options?.isAffected === null) {
            this.options.isAffected = false;
        }
    }

    async _prepareChatRenderContext({flavor, isPrivate=false, ...options}={}) {
        let ret = await super._prepareChatRenderContext({flavor, isPrivate, ...options});

        ret.canAffect = !this.options.isAffected /*&& await this.testUserPermission(game.user, "canUpdate");;*/
        ret.type = this.options.type;
        ret.token = this.options.token;
        ret.key = this.options.key;
        
        return ret;
    }

}
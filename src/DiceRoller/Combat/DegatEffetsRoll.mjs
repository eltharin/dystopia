
import * as system  from "../../_helpers.mjs";

export class DegatEffetsRoll extends system.DiceRoller.BaseRoll{
    static CHAT_TEMPLATE = system.Consts.TEMPLATES_PATH + "/dice/degateffets/roll-result.hbs";

    constructor(formula="", data={}, options={}) {
        
        options = {
            isAffected: false,
            addEffect: [],
            etatAffected: [],
            ...options
        };

        super(formula, data, options);
    }

    async _prepareChatRenderContext({flavor, isPrivate=false, ...options}={}) {
        let ret = await super._prepareChatRenderContext({flavor, isPrivate, ...options});

        ret.canAffect = !this.options.isAffected /*&& await this.testUserPermission(game.user, "canUpdate");;*/
        ret.actor = this.options.actor;
        ret.etat = this.options.etat;
        ret.type = this.options.type;
        ret.token = this.options.token;
        ret.key = this.options.key;
        
        ret.addEtats = this.options.addEffect.map(e => {
            return {
                id: e,
                name: system.Settings.StatusEffect.getName(e),
                isNotAffected: !(this.options.etatAffected.includes(e)),
            }
        });
        ret.hasEtats = this.options.addEffect.filter(e => e.isNotAffected).length > 0;

        return ret;
    }

    async evaluate(options) {
        const result = await super.evaluate(options);
        if(this.options.onCritical) this.options.onCritical.call(this, this);
        return result;
    }
}
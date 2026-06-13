import * as system  from "../_helpers.mjs";


export class AttaqueMessage extends system.DiceRoller.BaseRoll{
    
    static CHAT_TEMPLATE = system.Consts.TEMPLATES_PATH + "/combat/AttaqueMessage.hbs";

    constructor(formula="", data={}, options={}) {
        formula = "0";
                
        super(formula, data, options);
        
    }

    async _prepareChatRenderContext({flavor, isPrivate=false, ...options}={}) {
        let ret = await super._prepareChatRenderContext({flavor, isPrivate, ...options});
        
        ret.actor = this.options.actor.name;
        ret.cibles = await Promise.all(Object.values(this.options.cibles).map(async (cible) => {
            const cibleToken = await fromUuid(cible.uuid);
            cible.canUpdate = await cibleToken.testUserPermission(game.user, "canUpdate");
            return cible;
        }));

        return ret;
    }
}
import * as system  from "../_helpers.mjs";
import { CombatManager } from "./CombatManager.mjs";


export class AttaqueMessage extends system.Base.ChatMessage.DynamicChatMessage {
    static TEMPLATE = system.Consts.TEMPLATES_PATH + "/combat/AttaqueMessage.hbs";

    static ACTIONS = {
        'reponseAttaque': CombatManager._onReponseAttaque,
        'deAttaque': CombatManager._onDeAttaque
    }

    async getContext(html, message, data) {
        let ret = await super.getContext(html, message, data);
        ret.actor = this._data.actor.name;
        ret.canLaunch = await fromUuidSync(this._data.actor.uuid).testUserPermission(game.user, "canUpdate");
        ret.cibles = await Promise.all(Object.values(this._data.cibles).map(async (cible) => {
            const cibleToken = fromUuidSync(cible.uuid);
            cible.canUpdate = await cibleToken.testUserPermission(game.user, "canUpdate");
            return cible;
        }));

        return ret;
    }
}
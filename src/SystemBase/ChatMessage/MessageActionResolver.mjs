import * as system  from "../_helpers.mjs";

export class MessageActionResolver {
    static actions = {
    }

    static register(key, fct) {
        MessageActionResolver.actions[key] = fct;
    }

    static async executeAction(action, event, message, data) {
        
        let act = this.actions[action];
        if(act != null) {
            act(event, message, data)
        } else if (event.target.dataset.foractoruuid != null) {
            const actor = await fromUuid(event.target.dataset.foractoruuid);
            console.log(event.target.dataset.foractoruuid, actor)
            if(actor) {
                actor.sheet.doAction(action, event, message, data);
            }
        }
        else
        {
            
        }
    }
}
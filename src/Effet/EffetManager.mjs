import * as system from "../_helpers.mjs"


export class EffetManager {

    static async _onAddEffect(event, target) {

        let buttons = [];
        
        if(this.constructor.EffetTypes.includes("effetPorte")) {
            buttons.push({ 
                action: "effetPorte", 
                label: game.i18n.localize("TYPES.ActiveEffect.effetPorte")
            });
        }
        
        if(this.constructor.EffetTypes.includes("effetApplique")) {
            buttons.push({ 
                action: "effetApplique", 
                label: game.i18n.localize("TYPES.ActiveEffect.effetApplique")
            });
        }
        
        if(this.constructor.EffetTypes.includes("effetConsomme")) {
            buttons.push({ 
                action: "effetConsomme", 
                label: game.i18n.localize("TYPES.ActiveEffect.effetConsomme")
            });
        }

        let type = null;

        if(buttons.length == 0) {
             return;
        }
        else if(buttons.length == 1 ) {
            type = buttons[0].action;
        }
        else {
            type = await system.Base.Dialog.wait({
                window: { title: game.i18n.localize(system.Consts.SYSTEMID + ".effet.choix.title") },
                content: game.i18n.localize(system.Consts.SYSTEMID + ".effet.choix.question"),
                buttons: buttons
            });

            if(!type) return;
        }       

        const effects = await this.document.createEmbeddedDocuments("ActiveEffect", [{name: "Nouvel effet", type: type}]);
        new foundry.applications.sheets.ActiveEffectConfig({document: effects[0]}).render(true);
    }
    
    static async _onEditEffect(event, target){
        const effect = this.document.effects.get(target.dataset.effectid);
        new foundry.applications.sheets.ActiveEffectConfig({document: effect}).render(true);
    }
      
      
    static async _onDeleteEffect(event, target){
        const effect = this.document.effects.get(target.dataset.effectid);

        let confirmed = false;

        if(event.ctrlKey && event.shiftKey)
        {
            confirmed = true;
        }
        else
        {
            confirmed = await system.Base.Dialog.confirm({
                content: `<p>Etes-vous sûr de vouloir supprimer ${effect.name}?</p>`,
                rejectClose: false,
                modal: true
            });
        }

        if (confirmed) {
            await effect.delete({ render: true });
            ui.notifications.info(`${effect.name} supprimé(e)`);
        }

    }

    static appliqueEffet(effects, cibles)
    {        
        const newEffects = effects.map(e => {
            if(e.toObject) {
                e = e.toObject()
            }
            
            delete e._id;
            e.type = e.type == 'effetApplique' ? 'effetPorte' : e.type,
            e.disabled = false;
            return e;
        });
        
        if(newEffects.length == 0) {
            return;
        }
        console.log(newEffects)
        cibles.forEach(c => {
            const cibleNewEffects = c.createEmbeddedDocuments('ActiveEffect', newEffects);
            cibleNewEffects.then(e => console.log(e))
        });
    }
}